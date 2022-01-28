import { filter } from 'rxjs'
import { UserRestore } from 'jotto_core'
import { EventBus, AppState, JottoSocket, SocketGuessResult, IllegalStateException, SocketGameSummary, SocketGameConfig } from 'src/core'
import { createGuessResult, createLeaveGame } from 'src/core/events/game'
import { createPickedWord } from 'src/core/events/me'
import { Game } from 'src/models'
import { Players } from './players'
import * as AppEvents from 'src/core/events/app'
import * as Transform from 'src/core/transforms'

/**
 * Handles game flow related functions.
 * If it effects the flow of the game it should be here.
 */
export class GameFlow {

  private _state: AppState
  private _game: Game | undefined

  constructor(
    private _socket: JottoSocket,
    private _bus: EventBus,
    private _players: Players
  ) {
    this._state = 'joining_room'

    this.setupListeners()
  }


  //
  // getters & setters
  // =================


  public get state$() {
    return this._bus.events$
      .pipe(
        filter(AppEvents.isStateChangeEvent)
      )
  }

  public get state() {
    return this._state
  }

  public get game(): Game {
    if (!this._game) {
      throw new IllegalStateException('There is no game')
    }

    return this._game
  }


  //
  // public functions 
  // ================


  public joinRoom(username: string, type: 'observer' | 'player') {
    this._socket.updateAuth({ username, type })
    this._socket.connect()
    this.updateState('joined_room')
  }

  public start() {
    this._socket.emit('startGame')
  }

  public pickWord(word: string) {
    this._socket.emit('submitWord', word)
    this.updateState('picked_word')
    this._bus.publish(createPickedWord(word))
  }

  public backToRoom() {
    this._socket.emit('rejoinRoom')
    this.updateState('joined_room')

    this._game!.dispose()
    this._game = undefined
  }

  public leave() {
    this.updateState('joining_room')
    this._socket.disconnect()
    this._bus.publish(createLeaveGame())

    this._game?.dispose()
    this._game = undefined
  }


  //
  // private functions
  // =================


  private updateState(state: AppState) {
    const preState = this._state
    this._state = state

    if (preState !== state) {
      this._bus.publish(AppEvents.createStateChange(this._state, preState))
    }
  }

  private updateStateIf({ player, obs }: { player: AppState, obs: AppState}) {
    if (this._players.me.isPlaying) {
      this.updateState(player)
    } else {
      this.updateState(obs)
    }
  }

  private setupListeners() {
    this._socket.on('wordPicking', this.onWorkPicking)
    this._socket.on('gameStart', this.onGameStart)
    this._socket.on('guessResult', this.onGuessResult)
    this._socket.on('endGameSummary', this.onGameEnd)
    this._socket.on('restore', this.onRestore)
  }


  //
  // event handlers
  // ==============


  private onWorkPicking = () => {
    this.updateStateIf({ player: 'picking_word', obs: 'picked_word'})
  }

  private onGameStart = (gameConfig: SocketGameConfig, _history?: SocketGuessResult[]) => {
    const config = Transform.gameConfig(gameConfig)
    const history = _history ? Transform.history(_history) : undefined
    this._game = new Game(this._players.connected, config, history)
    if (history) {
      this.updateState('ingame')
    } else {
      this.updateState('starting_game')
      setTimeout(() => this.updateStateIf({ player: 'ingame', obs: 'observing' }), 10_000) // 10 sec
    }
  }

  private onGuessResult = (guessResult: SocketGuessResult) => {
    if (!this._game) {
      throw new IllegalStateException('game not created yet')
    }

    const result = Transform.guessResult(guessResult)
    this._game.addGuess(result)
    this._bus.publish(createGuessResult(result))
  }

  private onGameEnd = (gameSummary: SocketGameSummary) => {
    const summary = Transform.gameSummary(gameSummary)
    this._game!.gameOver(summary)
    this.updateState('game_summary')
  }

  private onRestore = (restore: UserRestore) => {
    switch (restore.state) {
      case 'in_room':
        this.updateState('joined_room')
        break
      case 'picking_word':
        this.updateState('picking_word')
        break
      case 'picked_word':
        this.updateState('picked_word')
        break
      case 'playing':
        this.onGameStart(restore.config!, restore.history)
        break
      case 'game_over':
        this.onGameStart(restore.config!, restore.history)
        this.onGameEnd(restore.gameSummary!)
        break
    }
  }

}
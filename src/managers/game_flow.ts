import { filter } from 'rxjs'
import { EventBus, AppState, JottoSocket, SocketGuessResult, IllegalStateException, GuessResult, SocketGameSummary, UserRestore, SocketGameConfig } from 'src/core'
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
  //

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
  //

  public joinRoom(username: string) {
    this._socket.updateAuth({ username })
    this._socket.connect()
    this.updateState('joined_room')
  }

  public start() {
    this._socket.emit('start_game')
  }

  public pickWord(word: string) {
    this._socket.emit('submit_word', word)
    this.updateState('picked_word')
    this._bus.publish(createPickedWord(word))
  }

  public backToRoom() {
    this._socket.emit('rejoin_room')
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
  //

  private updateState(state: AppState) {
    const preState = this._state
    this._state = state

    if (preState !== state) {
      this._bus.publish(AppEvents.createStateChange(this._state, preState))
    }
  }

  private setupListeners() {
    this._socket.on('word_picking', this.onWorkPicking)
    this._socket.on('game_start', this.onGameStart)
    this._socket.on('guess_result', this.onGuessResult)
    this._socket.on('end_game_summary', this.onGameEnd)
    this._socket.on('restore', this.onRestore)
  }

  //
  // event handlers
  //

  private onWorkPicking = () => {
    this.updateState('picking_word')
  }

  private onGameStart = (gameConfig: SocketGameConfig, _history?: SocketGuessResult[]) => {
    const config = Transform.gameConfig(gameConfig)
    const history = _history ? Transform.history(_history) : undefined
    this._game = new Game(this._players.connected, config, history)
    this.updateState('ingame')
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
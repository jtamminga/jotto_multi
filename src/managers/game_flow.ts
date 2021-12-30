import { filter } from 'rxjs'
import { EventBus, AppState, JottoSocket, SocketGuessResult, IllegalStateException, GuessResult, GameConfig, SocketGameSummary } from 'src/core'
import { createGuessResult, createPickedWord } from 'src/core/events'
import { Game } from 'src/models'
import * as AppEvents from 'src/core/events/app'
import { Players } from './players'

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
    //
  }

  public pickWord(word: string) {
    this._socket.emit('submit_word', word)
    this.updateState('picked_word')
    this._bus.publish(createPickedWord(this._players.me, word))
  }

  public backToRoom() {
    // this._socket.emit('')
    this.updateState('joined_room')
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
  }

  //
  // event handlers
  //

  private onWorkPicking = () => {
    this.updateState('picking_word')
  }

  private onGameStart = (gameConfig: GameConfig) => {
    this._game = new Game(this._players.all, gameConfig)
    this.updateState('ingame')
  }

  private onGuessResult = ({ id, word, common, won, from, to}: SocketGuessResult) => {
    if (!this._game) {
      throw new IllegalStateException('game not created yet')
    }

    const result: GuessResult = {
      id,
      word,
      common,
      won,
      from: this._players.get(from),
      to: this._players.get(to)
    }

    this._game.addGuess(result)
    this._bus.publish(createGuessResult(result))
  }

  private onGameEnd = (gameSummary: SocketGameSummary) => {
    const playerSummaries = gameSummary.playerSummaries.map(s => ({
      ...s, player: this._players.get(s.userId)
    }))

    this._game!.gameOver({ playerSummaries })

    this.updateState('game_summary')
  }

}
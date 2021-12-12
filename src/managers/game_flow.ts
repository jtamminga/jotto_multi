import { filter } from 'rxjs'
import { EventBus, AppState, JottoSocket, createPickedWord } from 'src/core'
import { Game } from 'src/models'
import * as AppEvents from 'src/core/events/app'

export class GameFlow {

  private _state: AppState

  constructor(
    private _socket: JottoSocket,
    private _bus: EventBus
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

  //
  // public functions 
  //

  public joinRoom(username: string) {
    this._socket.updateAuth({ username })
    this._socket.connect()
    this.updateState('joined_room')
  }

  public pickWord(word: string) {
    this._socket.emit('submit_word', word)
    this.updateState('picked_word')
    this._bus.publish(createPickedWord(word))
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
    this._socket.on('end_game_summary', this.onGameEnd)
  }

  //
  // event handlers
  //

  private onWorkPicking = () => {
    this.updateState('picking_word')
  }

  private onGameStart = () => {
    this.updateState('ingame')
  }

  private onGameEnd = () => {

  }

}
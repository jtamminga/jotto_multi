import { filter, Subscription } from "rxjs"
import { Disposable, IllegalStateException, User } from "src/core"
import { eventBus as bus } from 'src/core/di'
import { createWon, GuessEvent, isGuessEvent, isPlayerEvent } from "src/core/events"

export class Player implements Disposable {
  
  protected _userId: string
  protected _username: string
  protected _connected: boolean
  protected _ready: boolean
  protected _won: boolean
  protected _opponent: Player | undefined
  protected _subscription: Subscription

  constructor(user: User) {
    this._userId = user.userId
    this._username = user.username
    this._connected = user.connected
    this._ready = user.ready
    this._won = user.won

    this._subscription = bus.events$
      .pipe(
        filter(isGuessEvent),
        filter(this.isMyGuess)
      )
      .subscribe(e => this.onGuessResult(e))
  }

  //
  // getters & setters
  //

  get change$() {
    return bus.events$
      .pipe(
        filter(isPlayerEvent),
        filter(e => e.player === this)
      )
  }

  get userId(): string {
    return this._userId
  }

  get connected(): boolean {
    return this._connected
  }

  get username(): string {
    return this._username
  }

  get ready(): boolean {
    return this._ready
  }

  get won(): boolean {
    return this._won
  }

  get opponent(): Player {
    if (!this._opponent) {
      throw new Error('Player does not have an opponent')
    }

    return this._opponent
  }

  set connected(value: boolean) {
    this._connected = value
  }

  set ready(value: boolean) {
    this._ready = value
  }

  //
  // public functions
  //

  public setOpponent(player: Player) {
    if (this._opponent) {
      throw new IllegalStateException('player already has an opponent')
    }

    this._opponent = player
  }

  public dispose(): void {
    this._subscription.unsubscribe()
  }

  //
  // handlers
  //

  protected onGuessResult(event: GuessEvent) {
    if (event.guessResult.won) {
      this._won = true
      bus.publish(createWon(this))
    }
  }

  //
  // private functions
  //

  private isMyGuess = (event: GuessEvent): boolean => {
    return event.guessResult.from == this
  }
}
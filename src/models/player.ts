import { PlayerState, UserType } from 'jotto_core'
import { filter, Subscription } from 'rxjs'
import { Disposable, Guess, GuessResult, IllegalStateException } from 'src/core'
import { eventBus as bus } from 'src/core/di'
import { createPlayerChange, createPlayerWon, GuessEvent, isGuessResultEvent, isPlayerEvent } from 'src/core/events'

export class Player implements Disposable {
  
  protected _userId: string
  protected _type: UserType
  protected _username: string
  protected _connected: boolean
  protected _ready: boolean
  protected _won: boolean
  protected _opponent: Player | undefined
  protected _subscription: Subscription
  protected _guesses: Guess[] = []

  constructor(user: PlayerState) {
    this._userId = user.userId
    this._type = user.type
    this._username = user.username
    this._connected = user.connected
    this._ready = user.ready
    this._won = user.won

    this._subscription = bus.events$
      .pipe(
        filter(isGuessResultEvent),
        filter(this.isMyGuess)
      )
      .subscribe(e => this.onGuessResult(e.guessResult))
  }


  //
  // getters & setters
  // =================


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

  get type(): UserType {
    return this._type
  }

  get isPlaying(): boolean {
    return this._type === 'player'
  }

  get isObserving(): boolean {
    return this._type === 'observer'
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

  public get guessResults(): GuessResult[] {
    return this._guesses.filter(this.isGuessResult)
  }

  public get bestGuess(): number {
    return this.guessResults.reduce((max, result) =>
      result.common > max ? result.common : max, 0)
  }

  // setters

  set connected(value: boolean) {
    this._connected = value
  }

  set ready(value: boolean) {
    this._ready = value
  }


  //
  // public functions
  // ================


  public setOpponent(player: Player) {
    if (this._opponent) {
      throw new IllegalStateException('player already has an opponent')
    }

    this._opponent = player
  }

  public restoreGuesses(guesses: GuessResult[]) {
    this._guesses = guesses
    this._won = guesses.some(g => g.won)

    if (this._won) {
      bus.publish(createPlayerWon(this))
    }
  }

  public reset() {
    this._ready = false
    this._won = false
    this._opponent = undefined
  }

  public dispose(): void {
    this._subscription.unsubscribe()
  }


  //
  // handlers
  // ========


  protected onGuessResult(result: GuessResult) {
    const i = this._guesses.findIndex(g => g.id === result.id)

    if (i === -1) {
      this._guesses.push(result)
    } else {
      this._guesses[i] = result
    }

    bus.publish(createPlayerChange(this, 'guesses'))

    if (result.won) {
      this._won = true
      bus.publish(createPlayerWon(this))
    }
  }


  //
  // private functions
  // =================


  private isMyGuess = (event: GuessEvent): boolean => {
    return event.guessResult.from == this
  }

  // guard
  private isGuessResult(guess: Guess): guess is GuessResult {
    return guess.common !== undefined
  } 
}
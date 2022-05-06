import { PlayerPerf, PlayerState, UserState, UserType } from 'jotto_core'
import { filter, Subscription } from 'rxjs'
import { Disposable, Guess, GuessResult } from 'src/core'
import { eventBus as bus } from 'src/core/di'
import { createPlayerChange, createPlayerWon, GuessEvent, isGuessResultEvent, isPlayerEvent } from 'src/core/events'

export class Player implements Disposable {
  
  protected _userId: string
  protected _host: boolean
  protected _lobbyCode: string
  protected _type: UserType
  protected _username: string
  protected _connected: boolean
  protected _ready: boolean
  protected _wonAt: number | undefined
  protected _opponent: Player | undefined
  protected _subscriptions: Subscription[] = []
  protected _guesses: Guess[] = []
  protected _guessedWord: string | undefined

  private _playingAgain = false
  private _leftLobby = false

  constructor(user: PlayerState) {
    this._userId = user.userId
    this._type = user.type
    this._username = user.username
    this._connected = user.connected
    this._ready = user.ready
    this._wonAt = user.wonAt
    this._host = user.host
    this._lobbyCode = user.lobbyCode

    this._subscriptions.push(bus.events$
      .pipe(
        filter(isGuessResultEvent),
        filter(this.isMyGuess)
      )
      .subscribe(e => this.onGuessResult(e.guessResult))
    )

    this._subscriptions.push(bus.events$
      .pipe(
        filter(isGuessResultEvent),
        filter(this.isAgainstMe)
      )
      .subscribe(e => this.onGuessAgainstMe(e.guessResult))
    )
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
    return this._wonAt !== undefined
  }

  get wonAt(): number | undefined {
    return this._wonAt
  }

  get host(): boolean {
    return this._host
  }

  get lobbyCode(): string {
    return this._lobbyCode
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

  /**
   * Only known when guessed
   */
  public get word(): string | undefined {
    return this._guessedWord
  }

  public get wordGuessed(): boolean {
    return this._guessedWord !== undefined
  }

  public get perf(): PlayerPerf {
    return {
      numGuesses: this._guesses.length,
      bestGuess: this.bestGuess,
      wonAt: this._wonAt
    }
  }

  public get playingAgain(): boolean {
    return this._playingAgain
  }

  public get leftLobby(): boolean {
    return this._leftLobby
  }

  // setters

  set connected(value: boolean) {
    this._connected = value
  }

  set ready(value: boolean) {
    this._ready = value
  }

  set playingAgain(value: boolean) {
    this._playingAgain = value
  }

  set leftLobby(value: boolean) {
    this._leftLobby = value
  }


  //
  // public functions
  // ================


  public setOpponent(player: Player) {
    if (this._opponent) {
      console.warn('[player] opponent already set')
      return
    }

    this._opponent = player
  }

  public restoreGuesses(history: GuessResult[]) {
    this._guesses = history.filter(h => h.from === this)

    history
      .filter(h => h.to === this)
      .forEach(h => this.onGuessAgainstMe(h))
  }

  public startPlaying() { }

  public finishPlaying() { }

  public update(state: UserState) {
    this._lobbyCode = state.lobbyCode
    this._username = state.username
    this._type = state.type
    this._host = state.host
    this._connected = state.connected
  }

  public reset() {
    this._ready = false
    this._wonAt = undefined
    this._opponent = undefined
    this._guesses = []

    this._playingAgain = false
    this._leftLobby = false
  }

  public dispose(): void {
    this._subscriptions.forEach(s => s.unsubscribe())
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
      this._wonAt = Date.now()
      bus.publish(createPlayerWon(this))
    }
  }

  protected onGuessAgainstMe(result: GuessResult) {
    if (result.won) {
      this._guessedWord = result.word
    }
  }


  //
  // private functions
  // =================


  private isMyGuess = (event: GuessEvent): boolean => {
    return event.guessResult.from === this
  }

  private isAgainstMe = (event: GuessEvent): boolean => {
    return event.guessResult.to === this
  }

  // guard
  protected isGuessResult(guess: Guess): guess is GuessResult {
    return guess.common !== undefined
  } 
}
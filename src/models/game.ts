import { addMinutes, intervalToDuration } from 'date-fns'
import { Player } from './player'
import { Disposable, GameConfig, GameRestore, GameState, GameSummary, GuessResult, IllegalStateException } from 'src/core'

export class Game implements Disposable {

  private _state: GameState
  private _guesses: GuessResult[] = []
  private _summary: GameSummary | undefined

  private _startedOn: Date | undefined
  private _endedOn: Date | undefined
  private _timeUpOn: Date | undefined

  constructor(
    private _players: Player[],
    private _config: GameConfig,
    restore?: GameRestore
  ) {
    this._state = 'starting'

    this.processConfig()
    this.processRestore(restore)
  }


  //
  // getters & setters
  // =================


  public get state(): GameState {
    return this._state
  }

  public get config(): GameConfig {
    return this._config
  }

  public get hasTimeLimit(): boolean {
    return !!this._config.gameLength
  }

  public get timeLeft(): Duration {
    if (!this._timeUpOn) {
      throw new IllegalStateException('game has not started yet')
    }

    return intervalToDuration({
      start: Date.now(),
      end: this._timeUpOn
    })
  }

  public get guesses(): ReadonlyArray<GuessResult> {
    return this._guesses
  }

  public get summary(): GameSummary {
    if (!this._summary) {
      throw new IllegalStateException('game is not over yet')
    }

    return this._summary
  }


  //
  // public functions
  // ================


  public start() {
    this._state = 'playing'

    this._startedOn = new Date()
    if (this._config.gameLength) {
      this._timeUpOn = addMinutes(this._startedOn, this._config.gameLength)
    }
  }

  public addGuess(history: GuessResult) {
    this._guesses.push(history)
  }

  public gameOver(gameSummary: GameSummary) {
    this._state = 'over'
    this._endedOn = new Date()
    this._summary = gameSummary
  }

  public dispose(): void {
    // this._players.forEach(player => player.dispose())
  }


  //
  // private functions
  // =================


  private processConfig() {
    // set opponents
    for (let o of this._config.opponents) {
      o.player.setOpponent(o.opponent)
    }
  }

  private processRestore(restore: GameRestore | undefined) {
    if (!restore) {
      return
    }

    this._guesses = restore.history
    this._players.forEach(player =>
      player.restoreGuesses(restore.history.filter(h => h.from === player)))

    if (restore.timeUpOn && this._config.gameLength) {
      this._timeUpOn = restore.timeUpOn
      this._startedOn = addMinutes(this._timeUpOn, -this._config.gameLength)
    }
  }
}
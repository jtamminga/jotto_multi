import { addMinutes, addSeconds, intervalToDuration } from 'date-fns'
import { Player } from './player'
import { Disposable, GameConfig, GameRestore, GameState, GuessResult, IllegalStateException } from 'src/core'
import { GameSummary } from 'jotto_core'

export class Game implements Disposable {

  private _state: GameState
  private _guesses: GuessResult[] = []
  private _summary: GameSummary | undefined

  private _pickingWordOn: Date
  private _startedOn: Date | undefined
  private _endedOn: Date | undefined
  private _timeUpOn: Date | undefined

  constructor(
    private _players: Player[],
    private _config: GameConfig,
    restore?: GameRestore
  ) {
    this._state = 'picking_word'
    this._pickingWordOn = new Date()

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

  public get guesses(): ReadonlyArray<GuessResult> {
    return this._guesses
  }

  public get latestGuess(): GuessResult | undefined {
    return this._guesses[this._guesses.length - 1]
  }

  public get summary(): GameSummary {
    if (!this._summary) {
      throw new IllegalStateException('game is not over yet')
    }

    return this._summary
  }

  // time related getters

  public get wordDueOn(): Date {
    return addSeconds(this._pickingWordOn, this._config.pickWordLength)
  }

  public get startedOn(): Date {
    if (this._startedOn) {
      return this._startedOn
    }

    return addSeconds(Date.now(), this.config.preGameLength)
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

  public get timeElasped(): Duration {
    if (!this._startedOn) {
      throw new IllegalStateException('game has not started yet')
    }

    return intervalToDuration({
      start: this._startedOn,
      end: Date.now()
    })
  }

  public get finalTime(): Duration {
    if (!this._startedOn || !this._endedOn) {
      throw new IllegalStateException('game is not over yet')
    }

    return intervalToDuration({
      start: this._startedOn,
      end: this._endedOn
    })
  }


  //
  // public functions
  // ================


  public starting() {
    this._state = 'starting'
  }

  public playing() {
    this._state = 'playing'

    this._startedOn = new Date()
    if (this._config.gameLength) {
      this._timeUpOn = addMinutes(this._startedOn, this._config.gameLength)
    }

    this._players.forEach(player => player.startPlaying())
  }

  public addGuess(history: GuessResult) {
    this._guesses.push(history)
  }

  public gameOver(gameSummary: GameSummary) {
    this._state = 'over'
    // instead of setting it to `new Date()` we are just setting it to
    // based on the game length so it is consistant across users
    this._endedOn = addSeconds(this._startedOn!, gameSummary.gameLength)
    this._summary = gameSummary

    this._players.forEach(player => player.finishPlaying())
  }

  public dispose(): void { }


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
      player.restoreGuesses(restore.history))

    if (!restore.pickingWordOn) {
      throw new IllegalStateException('game needs pickingWordOn')
    }

    this._pickingWordOn = restore.pickingWordOn
    this._startedOn = restore.startedOn

    if (this._startedOn !== undefined && this._config.gameLength) {
      this._timeUpOn = addMinutes(this._startedOn, this._config.gameLength)
    }
  }
}
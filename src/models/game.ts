import { Player } from './player'
import { Disposable, GameConfig, GameState, GameSummary, GuessResult, IllegalStateException } from 'src/core'

export class Game implements Disposable {

  private _state: GameState
  private _guesses: GuessResult[] = []
  private _summary: GameSummary | undefined

  constructor(
    private _players: Player[],
    private _config: GameConfig,
    history?: GuessResult[]
  ) {
    this._state = 'playing'

    this.processConfig()

    if (history) {
      this._guesses = history
      this._players.forEach(player =>
        player.restoreGuesses(history.filter(h => h.from === player)))
    }
  }

  //
  // getters & setters
  //

  public get state(): GameState {
    return this._state
  }

  public get summary(): GameSummary {
    if (!this._summary) {
      throw new IllegalStateException('game is not over yet')
    }

    return this._summary
  }

  //
  // public functions
  //

  public addGuess(history: GuessResult) {
    this._guesses.push(history)
  }

  public gameOver(gameSummary: GameSummary) {
    this._state = 'over'
    this._summary = gameSummary
  }

  public dispose(): void {
    // this._players.forEach(player => player.dispose())
  }

  //
  // private functions
  //

  private processConfig() {
    // set opponents
    for (let o of this._config.opponents) {
      o.player.setOpponent(o.opponent)
    }
  }
  
  private getPlayer(userId: string): Player {
    const player = this._players.find(p => p.userId === userId)

    if (!player) {
      throw new Error('Player not found')
    }

    return player
  }
}
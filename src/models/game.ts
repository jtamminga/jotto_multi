import { Player } from './player'
import { GameConfig, GameState, GameSummary, GuessResult, IllegalStateException } from 'src/core'

export class Game {

  private _state: GameState
  private _guesses: GuessResult[] = []
  private _summary: GameSummary | undefined

  constructor(private _players: Player[], private _config: GameConfig) {
    this._state = 'playing'

    this.processConfig()
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

  //
  // private functions
  //

  private processConfig() {
    // set opponents
    for (let o of this._config.opponents) {
      this.getPlayer(o.id).setOpponent(this.getPlayer(o.opponentId))
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
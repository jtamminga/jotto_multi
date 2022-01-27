import { Guess, GuessResult } from 'src/core'
import { Player } from './player'
import { eventBus as bus } from 'src/core/di'
import { createPlayerChange, createPlayerReady, createSubmitGuess, GuessEvent } from 'src/core/events'
import { v4 as createId } from 'uuid'
import { PlayerState } from 'jotto_core'

export class Me extends Player {
  private _word: string | undefined
  private _guesses: Guess[] = []

  constructor(user: PlayerState) {
    super(user)
  }

  //
  // getters & setters
  //

  public get word(): string | undefined {
    return this._word
  }

  public get guesses(): Guess[] {
    return this._guesses
  }

  //
  // public functions
  //

  public setWord(word: string) {
    this._word = word
    this._ready = true
    bus.publish(createPlayerReady(this))
  }

  public guess(word: string) {
    const guess: Guess = { id: createId(), word }
    this._guesses.push(guess)
    bus.publish(createPlayerChange(this, 'guesses'))
    bus.publish(createSubmitGuess(guess))
  }

  public restoreGuesses(guesses: GuessResult[]) {
    this._guesses = guesses
    bus.publish(createPlayerChange(this, 'guesses'))
    super.restoreGuesses(guesses)
  }

  //
  // handlers
  //

  protected onGuessResult(event: GuessEvent) {
    super.onGuessResult(event)
    this.updateGuess(event.guessResult)
  }

  //
  // private functions
  //

  private updateGuess(result: GuessResult) {
    const guess = this._guesses.find(g => g.id === result.id)

    if (!guess) {
      throw new Error('guess does not exist')
    }

    guess.common = result.common
    bus.publish(createPlayerChange(this, 'guesses'))
  }
}
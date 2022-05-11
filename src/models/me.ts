import { v4 as createId } from 'uuid'
import { Guess, GuessResult } from 'src/core'
import { Player } from './player'
import { eventBus as bus } from 'src/core/di'
import { createPlayerChange, createPlayerReady, createSubmitGuess } from 'src/core/events'
import { Notes } from './notes'

export class Me extends Player {

  private _word: string | undefined
  private _notes: Notes | undefined


  //
  // getters & setters
  // =================


  public get word(): string | undefined {
    return this._word
  }

  public get guesses(): Guess[] {
    return this._guesses
  }

  public get notes(): Notes | undefined {
    return this._notes
  }


  //
  // public functions
  // ================


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


  //
  // overrides
  // =========


  override onGuessResult(result: GuessResult) {
    super.onGuessResult(result)
    this._notes?.addGuess(result)
  }

  override startPlaying() {
    super.startPlaying()
    this._notes = new Notes()
  }

  override finishPlaying() {
    super.finishPlaying()
    this._notes?.dispose()
    this._notes = undefined
  }

  override restoreGuesses(history: GuessResult[]) {
    super.restoreGuesses(history)
    this._notes = new Notes()
    this._notes.restore(this.guessResults)
  }

  override dispose() {
    super.dispose()
    this._notes?.dispose()
  }
}
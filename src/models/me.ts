import { Guess, GuessResult } from 'src/core'
import { Player } from './player'
import { eventBus as bus } from 'src/core/di'
import { createPlayerChange, createPlayerReady, createSubmitGuess, GuessEvent } from 'src/core/events'
import { v4 as createId } from 'uuid'
import { PlayerState } from 'jotto_core'

export class Me extends Player {
  private _word: string | undefined

  constructor(user: PlayerState) {
    super(user)
  }


  //
  // getters & setters
  // =================


  public get word(): string | undefined {
    return this._word
  }

  public get guesses(): Guess[] {
    return this._guesses
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
}
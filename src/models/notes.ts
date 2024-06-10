import { eventBus as bus } from 'src/core/di'
import { createNotesEvent } from 'src/core/events'
import { Disposable, GuessResult, LetterNote } from 'src/core'


export class Notes implements Disposable {

  private _hasZeroGuess: boolean = false
  private readonly _letterNotes = new Map<string, LetterNote>()
  private readonly _letterCounts = new Map<string, number>()


  //
  // getters & setters
  // =================


  public get hasZeroGuess(): boolean {
    return this._hasZeroGuess
  }

  public get letters(): ReadonlyMap<string, LetterNote> {
    return this._letterNotes
  }

  public get letterCounts(): ReadonlyMap<string, number> {
    return this._letterCounts
  }


  //
  // public functions
  // ================


  /**
   * Check if the letter is in the word
   * @param letter The letter to check
   * @returns true/false if in/not-in word, or undefined if not marked 
   */
  public inWord(letter: string): boolean | undefined {
    return this._letterNotes.get(letter)?.inWord
  }

  /**
   * Mark some letters as maybe
   * @param letters The letters as string to set
   * @param inWord pass undefined if you want cleared
   */
  public maybe(letters: string, inWord: boolean | undefined) {
    if (inWord === undefined) {
      this.clear(letters)
    } else {
      this.set(letters, { confidence: 'maybe', inWord })
    }

    bus.publish(createNotesEvent(this))
    this.serialize()
    console.debug(`[notes] '${letters}' marked as inWord: ${inWord}`)
  }

  public addGuess(guess: GuessResult) {
    if (this.processResult(guess)) {
      bus.publish(createNotesEvent(this))
    }
  }

  public restore(guesses: GuessResult[]) {
    this.deserialize()

    const changed = guesses
      .map(guess => this.processResult(guess))
      .some(change => change)

    if (changed) {
      bus.publish(createNotesEvent(this))
    }
  }

  public dispose() {
    sessionStorage.removeItem(STORE_KEY)
  }


  //
  // private functions
  // =================


  /**
   * process the guess
   * @param guess The guess to process
   * @returns true if notes changed
   */
  private processResult(guess: GuessResult): boolean {
    Array.from(guess.word).forEach(letter => {
      const currentCount = this._letterCounts.get(letter) ?? 0
      this._letterCounts.set(letter, currentCount + 1)
    })

    if (guess.common === 0) {
      this._hasZeroGuess = true
      this.set(guess.word, { confidence: 'known', inWord: false })
    }
    else if (guess.common === 5) {
      this.set(LETTERS, { confidence: 'known', inWord: false })
      this.set(guess.word, { confidence: 'known', inWord: true })
    }

    // TODO: maybe rethink notes change event, with the addition of letter counts
    //  this isn't as straight forward.
    return true
  }

  private set(letters: string, note: LetterNote) {
    Array.from(letters).forEach(letter =>
      this._letterNotes.set(letter, { ...note }))
  }

  private clear(letters: string) {
    Array.from(letters).forEach(letter =>
      this._letterNotes.delete(letter))
  }

  private serialize() {
    const condensed = Array.from(this._letterNotes)
      .filter(([_, info]) => info.confidence === 'maybe')
      .map(([key, info]) => ({ key, in: info.inWord }))

    const serialized = JSON.stringify(condensed)
    sessionStorage.setItem(STORE_KEY, serialized)
    console.debug('[notes] serialized')
  }

  private deserialize() {
    const serialized = sessionStorage.getItem(STORE_KEY)

    if (!serialized) {
      return
    }

    const condensed = JSON.parse(serialized) as { key: string, in: boolean }[]

    condensed.forEach(info =>
      this._letterNotes.set(info.key, { confidence: 'maybe', inWord: info.in })
    )

    console.debug('[notes] deserialized')
  }

}


const LETTERS = 'abcdefghijklmnopqrstuvwxyz'
const STORE_KEY = 'notes'
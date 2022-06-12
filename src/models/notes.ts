import { filter, Subscription } from 'rxjs'
import { keyboard, eventBus as bus } from 'src/core/di'
import { createNotesEvent, KeyPressEvent } from 'src/core/events'
import { Disposable, GuessResult, LetterNote, LetterNotes } from 'src/core'

export class Notes implements Disposable {

  private _subscription: Subscription
  private _isMarking: boolean = false
  private readonly _letterNotes = new Map<string, LetterNote>()

  constructor() {
    this._subscription = keyboard.keyPress$
      .pipe(filter(e => e.isMarking))
      .subscribe(this.onKeyPress)
  }


  //
  // getters & setters
  // =================


  public get isMarking(): boolean {
    return this._isMarking
  }

  public get letters(): LetterNotes {
    return this._letterNotes
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
    this._subscription.unsubscribe()
    sessionStorage.removeItem(STORE_KEY)
  }


  //
  // event handlers
  // ==============


  private onKeyPress = (e: KeyPressEvent) => {
    if (this.toggle(e.key)) {
      bus.publish(createNotesEvent(this))
      this.serialize()
    }
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
    if (guess.common === 0) {
      this.set(guess.word, { confidence: 'known', inWord: false })
      return true
    }
    
    if (guess.common === 5) {
      this.set(LETTERS, { confidence: 'known', inWord: false })
      this.set(guess.word, { confidence: 'known', inWord: true })
      return true
    }

    return false
  }

  private set(letters: string, note: LetterNote) {
    Array.from(letters).forEach(letter =>
      this._letterNotes.set(letter, { ...note }))
  }

  private clear(letters: string) {
    Array.from(letters).forEach(letter =>
      this._letterNotes.delete(letter))
  }

  // nothing --> maybe(inword) --> maybe(!inWord) --> nothing
  private toggle(key: string): boolean {
    let info = this._letterNotes.get(key)

    if (!info) {
      this._letterNotes.set(key,
        { confidence: 'maybe', inWord: true })
      return true
    }

    if (info.confidence === 'known') {
      return false
    }

    // confidence == maybe
    if (info.inWord) {
      this._letterNotes.set(key,
        { confidence: 'maybe', inWord: false })
      return true
    }

    // confidence == maybe && inWord == false
    this._letterNotes.delete(key)
    return true
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
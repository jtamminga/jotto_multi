import { filter, Subscription } from 'rxjs'
import { keyboard, eventBus as bus } from 'src/core/di'
import { createNotesEvent, KeyPressEvent } from 'src/core/events'
import { Disposable, GuessResult, IllegalStateException, LetterNote, LetterNotes } from 'src/core'

export class Notes implements Disposable {

  private _subscription: Subscription
  private _isMarking: boolean = false
  private readonly _letterNotes = new Map<string, LetterNote>()

  constructor() {
    this.setInfo(LETTERS, { confidence: 'nothing' })

    this.deserialize()

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


  public setMarking(isMarking: boolean) {
    if (this._isMarking !== isMarking) {
      this._isMarking = isMarking
      bus.publish(createNotesEvent(this))
    }
  }

  public addGuess(guess: GuessResult) {
    if (this.processResult(guess)) {
      bus.publish(createNotesEvent(this))
    }
  }

  public restoreGuesses(guesses: GuessResult[]) {
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


  private processResult(guess: GuessResult): boolean {
    if (guess.common === 0) {
      this.setInfo(guess.word, { confidence: 'known', inWord: false })
      return true
    }
    
    if (guess.common === 5) {
      this.setInfo(guess.word, { confidence: 'known', inWord: true })
      return true
    }

    return false
  }

  private setInfo(letters: string, note: LetterNote) {
    Array.from(letters).forEach(letter =>
      this._letterNotes.set(letter, { ...note }))
  } 

  // nothing --> maybe(inword) --> maybe(!inWord) --> nothing
  private toggle(key: string): boolean {
    let info = this._letterNotes.get(key)

    // should never happen
    if (!info) {
      throw new IllegalStateException('unknown key state')
    }

    if (info.confidence === 'known') {
      return false
    }

    if (info.confidence === 'nothing') {
      info = { confidence: 'maybe', inWord: true }
    }

    else if (info.confidence === 'maybe') {
      info = info.inWord ?
        { confidence: 'maybe', inWord: false } : { confidence: 'nothing' }
    } 

    this._letterNotes.set(key, info)
    return true
  }

  private serialize() {
    const condensed = Array.from(this._letterNotes)
      .filter(([_, info]) => info.confidence === 'maybe' && info.inWord !== undefined)
      .map(([key, info]) => ({ key, in: info.inWord }))

    const serialized = JSON.stringify(condensed)
    sessionStorage.setItem(STORE_KEY, serialized)
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
  }

}


const LETTERS = 'abcdefghijklmnopqrstuvwxyz'
const STORE_KEY = 'notes'
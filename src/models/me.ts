import { EventBus, User } from 'src/core'
import { Player } from './player'

export class Me extends Player {
  private _word: string | undefined

  constructor(user: User, private _bus: EventBus) {
    super(user)
  }

  public setWord(word: string) {
    this._word = word
  }
}
import { Player } from 'src/models'
import { GuessResult } from 'src/core'
import * as Base from './base'

// types
export type GameEventType =
  | 'guess'

//
// events
//

export interface GameEvent extends Base.Event {
  domain: 'game'
  type: GameEventType
}

export interface GuessEvent extends GameEvent {
  guessResult: GuessResult
}

//
// factories
//

export function createGuess(guessResult: GuessResult): GuessEvent {
  return {
    ...Base.create('game', 'guess') as GuessEvent,
    guessResult
  }
}

//
// guards
//

export function isGuessEvent(event: Base.Event): event is GuessEvent {
  return event.domain === 'game' && event.type === 'guess'
}
import { GuessResult } from 'src/core'
import * as Base from './event'

// types
export type GameEventType =
  | 'guess_result'

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

export function createGuessResult(guessResult: GuessResult): GuessEvent {
  return {
    ...Base.create('game', 'guess_result') as GuessEvent,
    guessResult
  }
}

//
// guards
//

export function isGuessEvent(event: Base.Event): event is GuessEvent {
  return event.domain === 'game' && event.type === 'guess_result'
}
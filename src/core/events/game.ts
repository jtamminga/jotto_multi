import { GuessResult } from 'src/core'
import { Event } from './event'


export type GameEventType =

  // result from the guess
  | 'guess_result'

  // leave the game
  | 'leave'


//
// events
// ======

export interface GameEvent extends Event {
  domain: 'game'
  type: GameEventType
}

export interface GuessEvent extends GameEvent {
  guessResult: GuessResult
}


//
// factories
// =========


function create(type: GameEventType): GameEvent {
  return {
    domain: 'game',
    type,
    timestamp: Date.now()
  }
}

export function createGuessResult(guessResult: GuessResult): GuessEvent {
  return {
    ...create('guess_result'),
    guessResult
  }
}

export function createLeaveGame(): GameEvent {
  return create('leave')
}


//
// guards
// ======

export function isGameEvent(event: Event): event is GameEvent {
  return event.domain === 'game'
}

export function isGuessEvent(event: Event): event is GuessEvent {
  return isGameEvent(event) && event.type === 'guess_result'
}

export function isLeaveGame(event: Event): event is GameEvent {
  return isGameEvent(event) && event.type === 'leave'
}
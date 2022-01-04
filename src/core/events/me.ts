import { Guess } from 'src/core'
import { PlayerEvent } from './player'
import { Event } from './event'
import { players } from 'src/core/di'


/**
 * This is more of an extension of player events.
 * These events have to do with just players.me 
 */


//
// events
// ======


export interface WordEvent extends PlayerEvent {
  type: 'picked_word' | 'submit_guess'
  word: string
}

export interface PickedWordEvent extends WordEvent {
  type: 'picked_word'
}

export interface SubmitGuessEvent extends WordEvent {
  type: 'submit_guess'
  id: string
}


//
// factories
// =========


export function createPickedWord(word: string): PickedWordEvent {
  return {
    domain: 'player',
    type: 'picked_word',
    player: players.me,
    word,
    timestamp: Date.now()
  }
}

export function createSubmitGuess(guess: Guess): SubmitGuessEvent {
  return {
    domain: 'player',
    type: 'submit_guess',
    player: players.me,
    word: guess.word,
    id: guess.id,
    timestamp: Date.now()
  }
}


//
// guards
// ======


export function isWordEvent(event: Event): event is WordEvent {
  return event.domain === 'player' &&
    (event.type === 'picked_word' || event.type === 'submit_guess')
}

export function isPickWordEvent(event: Event): event is PickedWordEvent {
  return event.domain === 'player' && event.type === 'picked_word'
}
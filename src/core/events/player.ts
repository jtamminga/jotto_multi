import { Event } from './event'
import { Player } from 'src/models'
import { Guess } from 'src/core'
 
// types
export type PlayerEventType =
  | 'picked_word'
  | 'submit_guess'
  | 'won'

//
// events
//

export interface PlayerEvent extends Event {
  domain: 'player'
  type: PlayerEventType
  player: Player
}

export interface WordEvent extends PlayerEvent {
  domain: 'player'
  type: 'picked_word' | 'submit_guess'
  id?: string
  word: string
}

//
// factories
//

function create(player: Player, type: PlayerEventType): PlayerEvent {
  return {
    domain: 'player',
    type,
    timestamp: Date.now(),
    player,
  }
}

export function createWon(player: Player): PlayerEvent {
  return create(player, 'won')
}

export function createPickedWord(player: Player, word: string): WordEvent {
  return {
    domain: 'player',
    type: 'picked_word',
    timestamp: Date.now(),
    player,
    word
  }
}

export function createSubmitGuess(player: Player, guess: Guess): WordEvent {
  return {
    domain: 'player',
    type: 'submit_guess',
    timestamp: Date.now(),
    player,
    word: guess.word,
    id: guess.id
  }
}

//
// guards
//

export function isPlayerEvent(event: Event): event is PlayerEvent {
  return event.domain === 'player'
}

export function isWordEvent(event: Event): event is WordEvent {
  return event.domain === 'player' &&
    (event.type === 'picked_word' || event.type === 'submit_guess')
}
import { Event } from './event'
import { Player } from 'src/models'
 

/**
 * Some thoughts:
 * - maybe won should move to the players domain
 */
export type PlayerEventType =

  // player property changed
  | 'change'

  // if a player won
  | 'won'

  // if player picked a word
  | 'picked_word'

  // if player submitted a guess
  | 'submit_guess'

  // notes changed
  | 'notes_change'

export type PlayerProperty =
  | 'guesses'
  | 'rank'


//
// events
// ======


export interface PlayerEvent extends Event {
  domain: 'player'
  type: PlayerEventType
  player: Player
}

export interface PlayerChangeEvent extends PlayerEvent {
  type: 'change'
  prop: PlayerProperty
}


//
// factories
// =========


function create(player: Player, type: PlayerEventType): PlayerEvent {
  return {
    domain: 'player',
    type,
    timestamp: Date.now(),
    player,
  }
}

export function createPlayerChange(player: Player, prop: PlayerProperty): PlayerChangeEvent {
  return {
    ...create(player, 'change'),
    type: 'change',
    prop
  }
}

export function createPlayerWon(player: Player): PlayerEvent {
  return create(player, 'won')
}


//
// guards
// ======


export function isPlayerEvent(event: Event): event is PlayerEvent {
  return event.domain === 'player'
}

export function isPlayerWonEvent(event: Event): event is PlayerEvent {
  return isPlayerEvent(event) && event.type === 'won'
}

export function isPlayerChangeEvent(event: Event): event is PlayerChangeEvent {
  return event.domain === 'player' && event.type === 'change'
}
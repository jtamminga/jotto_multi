import * as Base from './base'
import { Player } from 'src/models'
import { Guess } from 'src/core'
 
// types
export type PlayerEventType =
  | 'change'
  | 'connected'
  | 'disconnected'
  | 'ready'
  | 'picked_word'
  | 'submit_guess'
  | 'won'

export type PlayerProp =
  | 'won'
  | 'word'
  | 'guesses'

//
// events
//

export interface PlayerEvent extends Base.Event {
  domain: 'player'
  type: PlayerEventType
  player: Player
}

export interface PlayerChangeEvent extends PlayerEvent {
  prop: PlayerProp
}

export interface WordEvent extends Base.Event {
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
    ...Base.create('player', type) as PlayerEvent,
    player
  }
}

export function createConnected(player: Player): PlayerEvent {
  return create(player, 'connected')
}

export function createDisconnected(player: Player): PlayerEvent {
  return create(player, 'disconnected')
}

export function createReady(player: Player): PlayerEvent {
  return create(player, 'ready')
}

export function createWon(player: Player): PlayerEvent {
  return create(player, 'won')
}

export function createPickedWord(word: string): WordEvent {
  return {
    ...Base.create('player', 'picked_word') as WordEvent,
    word
  }
}

export function createSubmitGuess(guess: Guess): WordEvent {
  return {
    ...Base.create('player', 'submit_guess') as WordEvent,
    word: guess.word,
    id: guess.id
  }
}

export function createPlayerChange(player: Player, prop: PlayerProp): PlayerChangeEvent {
  return {
    ...create(player, 'change'),
    prop
  }
}

//
// guards
//

export function isWordEvent(event: Base.Event): event is WordEvent {
  return event.domain === 'player' &&
    (event.type === 'picked_word' || event.type === 'submit_guess')
}

export function isPlayerChange(event: Base.Event): event is PlayerChangeEvent {
  return event.domain === 'player' && event.type === 'change'
}
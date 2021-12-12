import * as Base from './base'
import { Player } from 'src/models'
 
// types
export type Type = 'connected' | 'disconnected' | 'ready' | 'picked_word'

// event
export interface PlayerEvent extends Base.Event {
  domain: 'player'
  type: Type
  player: Player
}

export interface PickedWordEvent extends Base.Event {
  domain: 'player'
  type: 'picked_word'
  word: string
}

// factories
function create(player: Player, type: Type): PlayerEvent {
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

export function createPickedWord(word: string): PickedWordEvent {
  return {
    ...Base.create('player', 'picked_word') as PickedWordEvent,
    word
  }
}

//
// guards
//

export function isPickedWordEvent(event: Base.Event): event is PickedWordEvent {
  return event.domain === 'player' && event.type === 'picked_word'
}
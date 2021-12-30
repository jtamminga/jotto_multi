import { Player } from 'src/models'
import { Event } from './event'

// types
export type PlayersEventType =
  | 'created'
  | 'connected'
  | 'disconnected'
  | 'ready'

//
// events
//

export interface PlayersEvent extends Event {
  domain: 'players'
  type: PlayersEventType
  player: Player
}

//
// factories
//

function create(player: Player, type: PlayersEventType): PlayersEvent {
  return {
    domain: 'players',
    type,
    timestamp: Date.now(),
    player,
  }
}

export function createPlayerCreated(player: Player) {
  return create(player, 'created')
}

export function createPlayerConnected(player: Player): PlayersEvent {
  return create(player, 'connected')
}

export function createPlayerDisconnected(player: Player): PlayersEvent {
  return create(player, 'disconnected')
}

export function createPlayerReady(player: Player): PlayersEvent {
  return create(player, 'ready')
}

//
// guards
//

export function isPlayersEvent(event: Event): event is PlayersEvent {
  return event.domain === 'players'
}
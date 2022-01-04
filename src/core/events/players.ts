import { Player } from 'src/models'
import { Event } from './event'


export type PlayersEventType =

  // player instance created
  | 'created'

  // player connected
  | 'connected'

  // player disconnected
  | 'disconnected'

  // player picked a word (therefore ready)
  | 'ready'

  // intentional disconnect 
  | 'leave'


//
// events
// ======


export interface PlayersEvent extends Event {
  domain: 'players'
  type: PlayersEventType
  player: Player
}


//
// factories
// =========


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

export function createPlayerLeave(player: Player): PlayersEvent {
  return create(player, 'leave')
}


//
// guards
// ======


export function isPlayersEvent(event: Event): event is PlayersEvent {
  return event.domain === 'players'
}
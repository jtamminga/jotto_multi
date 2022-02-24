import { Player } from 'src/models'
import { Event } from './event'


export type PlayersEventType =

  // after all players fetched and created
  | 'all_created'

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

export interface PlayersCollectionEvent extends Event {
  domain: 'players'
  type: PlayersEventType
  players: Player[]
}


//
// factories
// =========


function create(player: Player, type: PlayersEventType): PlayersEvent {
  return {
    domain: 'players',
    type,
    player,
    timestamp: Date.now()
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

export function createAllPlayersCreated(players: Player[]): PlayersCollectionEvent {
  return {
    domain: 'players',
    type: 'all_created',
    players,
    timestamp: Date.now()
  }
}


//
// guards
// ======


export function isPlayersEvent(event: Event): event is PlayersEvent {
  return event.domain === 'players'
}
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

export interface PlayersConnectEvent extends PlayersEvent {
  reconnected: boolean
}

export interface PlayersDisconnectEvent extends PlayersEvent {
  intended: boolean
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

export function createPlayerConnected(player: Player, reconnected: boolean): PlayersConnectEvent {
  return {
    ...create(player, 'connected'),
    reconnected
  }
}

export function createPlayerDisconnected(player: Player, intended: boolean): PlayersDisconnectEvent {
  return {
    ...create(player, 'disconnected'),
    intended
  }
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

export function isPlayerConnectEvent(event: Event): event is PlayersConnectEvent {
  return isPlayersEvent(event) && event.type === 'connected'
}

export function isPlayerDisconnectEvent(event: Event): event is PlayersDisconnectEvent {
  return isPlayersEvent(event) && event.type === 'disconnected'
}
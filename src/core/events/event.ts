import { AppEventType } from './app'
import { PlayerEventType } from './player'
import { PlayersEventType } from './players'
import { GameEventType } from './game'
import { KeyboardEventType } from './keyboard'
import { ErrorEventType } from './error'
import { ConnectionEventType } from './connection'

// domains
export type Domain = 
  | 'app'
  | 'player'
  | 'players'
  | 'game'
  | 'keyboard'
  | 'error'
  | 'connection'

// event types
export type EventType =
  | AppEventType
  | PlayerEventType
  | PlayersEventType
  | GameEventType
  | KeyboardEventType
  | ErrorEventType
  | ConnectionEventType

export interface Event {
  domain: Domain
  type: EventType
  timestamp: number
}

export function create(domain: Domain, type: EventType): Event {
  return {
    domain,
    type,
    timestamp: Date.now()
  }
}
import { AppEventType } from './app'
import { PlayerEventType } from './player'
import { PlayersEventType } from './players'
import { GameEventType } from './game'

// domains
export type Domain = 
  | 'app'
  | 'player'
  | 'players'
  | 'game'

// event types
export type EventType =
  | AppEventType
  | PlayerEventType
  | PlayersEventType
  | GameEventType

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
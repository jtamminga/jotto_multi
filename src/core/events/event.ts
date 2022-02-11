import { AppEventType } from './app'
import { PlayerEventType } from './player'
import { PlayersEventType } from './players'
import { GameEventType } from './game'
import { KeyboardEventType } from './keyboard'

// domains
export type Domain = 
  | 'app'
  | 'player'
  | 'players'
  | 'game'
  | 'keyboard'

// event types
export type EventType =
  | AppEventType
  | PlayerEventType
  | PlayersEventType
  | GameEventType
  | KeyboardEventType

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
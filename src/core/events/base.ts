import * as AppEvents from './app'
import * as PlayerEvents from './player'

// domains
export type Domain = 
  | 'app'
  | 'player'
  | 'game'

// event types
export type EventType =
  | AppEvents.Type
  | PlayerEvents.Type

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
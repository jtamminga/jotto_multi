import { ConnectionState } from '../types'
import { Event } from './event'

export type ConnectionEventType =
  | 'state_change'


//
// events
// ======


export interface ConnectionEvent extends Event {
  domain: 'connection',
  type: ConnectionEventType,
  state: ConnectionState
}


//
// factories
// =========


export function createConnectionStateChange(state: ConnectionState): ConnectionEvent {
  return {
    domain: 'connection',
    type: 'state_change',
    state,
    timestamp: Date.now()
  }
}


//
// guards
// ======


export function isConnectionEvent(event: Event): event is ConnectionEvent {
  return event.domain === 'connection'
}
import { Event } from './event'

export type ErrorEventType =

  | 'lobby_closed'


//
// events
// ======


export interface ErrorEvent extends Event {
  domain: 'error',
  type: ErrorEventType
  message: string
}


//
// factories
// =========


function create(type: ErrorEventType, message: string): ErrorEvent {
  return {
    domain: 'error',
    type,
    message,
    timestamp: Date.now()
  }
}

export function createError(type: ErrorEventType, message: string): ErrorEvent {
  return create(type, message)
}


//
// guards
// ======


export function isErrorEvent(event: Event): event is ErrorEvent {
  return event.domain === 'error'
}
import { JottoError } from 'src/models'
import { Event } from './event'

export type ErrorEventType =

  | 'new_error'

  | 'clear_error'


//
// events
// ======


export interface ErrorEvent extends Event {
  domain: 'error',
  type: ErrorEventType
  error: JottoError
}


//
// factories
// =========


function create(type: ErrorEventType, error: JottoError): ErrorEvent {
  return {
    domain: 'error',
    type,
    error,
    timestamp: Date.now()
  }
}

export function createError(error: JottoError): ErrorEvent {
  return create('new_error', error)
}

export function createClearError(error: JottoError): ErrorEvent {
  return create('clear_error', error)
}


//
// guards
// ======


export function isErrorEvent(event: Event): event is ErrorEvent {
  return event.domain === 'error'
}
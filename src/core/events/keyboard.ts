import { Event } from './event'


export type KeyboardEventType =
  | 'keypress'


//
// events
// ======


export interface KeyboardEvent extends Event {
  domain: 'keyboard'
  type: KeyboardEventType
  key: string
}


//
// factories
// =========


export function createKeypress(key: string): KeyboardEvent {
  return {
    domain: 'keyboard',
    type: 'keypress',
    timestamp: Date.now(),
    key
  }
}


//
// guards
// ======


export function isKeypressEvent(event: Event): event is KeyboardEvent {
  return event.domain === 'keyboard' && event.type === 'keypress'
}
import { Event } from './event'


export type KeyboardEventType =

  | 'keypress'

  | 'visibilityChange'


//
// events
// ======


export interface KeyboardEvent extends Event {
  domain: 'keyboard'
  type: KeyboardEventType
}

export interface KeyPressEvent extends KeyboardEvent {
  key: string
}


//
// factories
// =========


function create(type: KeyboardEventType): KeyboardEvent {
  return {
    domain: 'keyboard',
    type,
    timestamp: Date.now()
  }
}

export function createKeypress(key: string): KeyPressEvent {
  return {
    domain: 'keyboard',
    type: 'keypress',
    timestamp: Date.now(),
    key
  }
}

export function createKeyboardVisibilityChange(): KeyboardEvent {
  return create('visibilityChange')
}


//
// guards
// ======


export function isKeyboardEvent(event: Event): event is KeyboardEvent {
  return event.domain === 'keyboard'
}

export function isKeypressEvent(event: Event): event is KeyPressEvent {
  return isKeyboardEvent(event) && event.type === 'keypress'
}
import { Event } from './event'


export type KeyboardEventType =

  | 'keypress'

  | 'visibility_change'


//
// events
// ======


export interface KeyboardEvent extends Event {
  domain: 'keyboard'
  type: KeyboardEventType
}

export interface KeyPressEvent extends KeyboardEvent {
  key: string
  isMarking: boolean
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

export function createKeypress(key: string, isMarking: boolean): KeyPressEvent {
  return {
    domain: 'keyboard',
    type: 'keypress',
    timestamp: Date.now(),
    key,
    isMarking
  }
}

export function createKeyboardVisibilityChange(): KeyboardEvent {
  return create('visibility_change')
}


//
// guards
// ======


export function isKeyboardEvent(event: Event): event is KeyboardEvent {
  return event.domain === 'keyboard'
}

export function isKeyPressEvent(event: Event): event is KeyPressEvent {
  return isKeyboardEvent(event) && event.type === 'keypress'
}
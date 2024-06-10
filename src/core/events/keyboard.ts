import { Event } from './event'


export type KeyboardEventType =
  | 'keypress'
  | 'set_word'
  | 'visibility_change'


//
// events
// ======


export interface KeyboardEvent extends Event {
  domain: 'keyboard'
  type: KeyboardEventType
}

export interface KeyPressEvent extends KeyboardEvent {
  type: 'keypress'
  key: string
}

export interface SetWordEvent extends KeyboardEvent {
  type: 'set_word'
  word: string
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

export function createSetWord(word: string): SetWordEvent {
  return {
    domain: 'keyboard',
    type: 'set_word',
    timestamp: Date.now(),
    word
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

export function isSetWordEvent(event: Event): event is SetWordEvent {
  return isKeyboardEvent(event) && event.type === 'set_word'
}
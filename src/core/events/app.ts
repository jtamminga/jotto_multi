import { Event } from './event'
import { AppState } from 'src/core'


export type AppEventType =

  // user authenticated
  | 'auth'

  // the state of the overall app changes
  | 'state_change'

  // menu is shown or hidden
  | 'menu_visibility_change'


//
// events
// ======


export interface AppEvent extends Event {
  domain: 'app',
  type: AppEventType
}

export interface AuthEvent extends AppEvent {
  type: 'auth'
  sessionId: string
}

export interface AppStateChangeEvent extends AppEvent {
  type: 'state_change'
  state: AppState
  preState: AppState
}

export interface MenuEvent extends AppEvent {
  type: 'menu_visibility_change'
}


//
// factories
// =========


function create(type: AppEventType): AppEvent {
  return {
    domain: 'app',
    type,
    timestamp: Date.now()
  }
}

export function createAuth(sessionId: string): AuthEvent {
  return {
    ...create('auth'),
    type: 'auth',
    sessionId
  }
}

export function createStateChange(state: AppState, preState: AppState): AppStateChangeEvent {
  return {
    ...create('state_change'),
    type: 'state_change',
    state,
    preState
  }
}

export function createMenuVisibilityChange(): MenuEvent {
  return {
    ...create('menu_visibility_change'),
    type: 'menu_visibility_change'
  }
}


//
// guards
// ======


export function isAuthEvent(event: Event): event is AuthEvent {
  return event.domain === 'app' && event.type === 'auth'
}

export function isStateChangeEvent(event: Event): event is AppStateChangeEvent {
  return event.domain === 'app' && event.type === 'state_change'
}

export function isMenuVisibilityChangeEvent(event: Event): event is MenuEvent {
  return event.domain === 'app' && event.type === 'menu_visibility_change'
}
import { Event } from './event'
import { AppState } from 'src/core'


export type AppEventType =

  // connected or not
  | 'loading_state_change'

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

export function createLoadingChange(): AppEvent {
  return {
    ...create('loading_state_change'),
    type: 'loading_state_change'
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


export function isStateChangeEvent(event: Event): event is AppStateChangeEvent {
  return event.domain === 'app' && event.type === 'state_change'
}

export function isLoadingStateChangeEvent(event: Event): event is AppEvent {
  return event.domain === 'app' && event.type === 'loading_state_change'
}

export function isMenuVisibilityChangeEvent(event: Event): event is MenuEvent {
  return event.domain === 'app' && event.type === 'menu_visibility_change'
}
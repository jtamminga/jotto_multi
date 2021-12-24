import * as Base from './base'
import { AppState } from 'src/core'

export type AppEventType = 'state_change'

//
// events
//

export interface AppStateChangeEvent extends Base.Event {
  domain: 'app'
  type: AppEventType
  state: AppState
  preState: AppState
}

//
// factories
//

export function createStateChange(state: AppState, preState: AppState): AppStateChangeEvent {
  return {
    ...Base.create('app', 'state_change') as AppStateChangeEvent,
    state,
    preState
  }
}

//
// guards
//

export function isStateChangeEvent(event: Base.Event): event is AppStateChangeEvent {
  return event.domain === 'app' && event.type === 'state_change'
}
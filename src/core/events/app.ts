import * as Base from './base'
import { AppState } from 'src/core'

export type Type = 'state_change'

export interface AppStateChangeEvent extends Base.Event {
  domain: 'app'
  type: Type
  state: AppState
  preState: AppState
}

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
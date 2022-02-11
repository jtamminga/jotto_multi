import { filter, Observable } from 'rxjs'
import { EventBus } from 'src/core'
import { isKeypressEvent, KeyboardEvent } from 'src/core/events'

export class Keyboard {

  private _show = false

  constructor (
    private _bus: EventBus
  ) { }

  public get keyPress$(): Observable<KeyboardEvent> {
    return this._bus.events$
      .pipe(filter(isKeypressEvent))
  }
}
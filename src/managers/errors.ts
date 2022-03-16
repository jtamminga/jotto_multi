import { filter } from 'rxjs'
import { EventBus } from 'src/core'
import { createClearError, ErrorEvent, isErrorEvent } from 'src/core/events'

export class Errors {

  constructor(
    private _bus: EventBus
  ) {

    _bus.events$
      .pipe(
        filter(isErrorEvent),
        filter(event => event.type === 'new_error')
      )
      .subscribe(this.onError)
  }


  //
  // getters & setters
  // =================


  public get change$() {
    return this._bus.events$
      .pipe(filter(isErrorEvent))
  }


  //
  // event handlers
  // ==============


  private onError = (event: ErrorEvent) => {
    setTimeout(() => {
      this._bus.publish(createClearError(event.error))
    }, 3000)
  }

}
import { filter } from 'rxjs'
import { EventBus } from 'src/core'
import { createClearError, ErrorEvent, isErrorEvent } from 'src/core/events'
import { JottoError } from 'src/models'

export class Errors {

  private _latestError: JottoError | undefined

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

  public get latestError(): JottoError | undefined {
    return this._latestError
  }


  //
  // event handlers
  // ==============


  private onError = (event: ErrorEvent) => {
    this._latestError = event.error

    setTimeout(() => {
      this._latestError = undefined
      this._bus.publish(createClearError(event.error))
    }, 2000)
  }

}
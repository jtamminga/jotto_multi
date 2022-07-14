import { filter, Observable } from 'rxjs'
import { EventBus } from 'src/core'
import { createMenuVisibilityChange, isMenuVisibilityChangeEvent, MenuEvent } from 'src/core/events'
import { AppFlow } from './app_flow'

export class Menu {

  private _visible = false

  constructor(
    private _bus: EventBus,
    _appFlow: AppFlow
  ) {

    // hide menu on screen change
    _appFlow.state$
      .subscribe(() => this.hide())

  }


  //
  // getters & setters
  // =================


  public get visibility$(): Observable<MenuEvent> {
    return this._bus.events$
      .pipe(filter(isMenuVisibilityChangeEvent))
  }

  public get visible(): boolean {
    return this._visible
  }


  //
  // public functions
  // ================


  public show() {
    this.updateVisibility(true)
  }

  public hide() {
    this.updateVisibility(false)
  }

  public toggle() {
    this.updateVisibility(!this._visible)
  }


  //
  // private functions
  // =================


  private updateVisibility(visible: boolean) {
    if (this._visible !== visible) {
      this._visible = visible
      this._bus.publish(createMenuVisibilityChange())
    }
  }

}
import { filter, Observable } from 'rxjs'
import { EventBus } from 'src/core'
import { createMenuVisibilityChange, isMenuVisibilityChangeEvent, MenuEvent } from 'src/core/events'
import { GameFlow } from './game_flow'

export class Menu {

  private _visible = false

  constructor(
    private _bus: EventBus,
    _gameFlow: GameFlow
  ) {

    // hide menu on screen change
    _gameFlow.state$
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
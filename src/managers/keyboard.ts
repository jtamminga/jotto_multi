import { filter, Observable } from 'rxjs'
import { EventBus } from 'src/core'
import { appFlow, players } from 'src/core/di'
import {
  AppStateChangeEvent,
  createKeyboardVisibilityChange,
  isKeyboardEvent,
  isKeyPressEvent,
  isMeWon,
  KeyboardEvent,
  KeyPressEvent
} from 'src/core/events'

export class Keyboard {

  private _visible = false

  constructor (
    private _bus: EventBus
  ) {

    _bus.events$
      .pipe(filter(isMeWon))
      .subscribe(() => this.hide())

    appFlow.state$
      .subscribe(e => this.onAppStateChange(e))
  }


  //
  // getters & setters
  // =================


  public get keyPress$(): Observable<KeyPressEvent> {
    return this._bus.events$
      .pipe(filter(isKeyPressEvent))
  }

  public get change$(): Observable<KeyboardEvent> {
    return this._bus.events$
      .pipe(
        filter(isKeyboardEvent),
        filter(e =>
          e.type === 'visibility_change'
        )
      )
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


  //
  // private functions
  // =================


  private updateVisibility(visible: boolean) {
    if (this._visible !== visible) {
      this._visible = visible
      this._bus.publish(createKeyboardVisibilityChange())
    }
  }

  private onAppStateChange(e: AppStateChangeEvent) {
    switch (e.state) {
      case 'picking_word':
        this.show()
        break
      case 'playing':
        if (!players.me.won) {
          this.show()
        }
        break
      default:
        this.hide()
    }
  }
}
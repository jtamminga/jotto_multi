import { filter, Observable } from 'rxjs'
import { EventBus } from 'src/core'
import { gameFlow } from 'src/core/di'
import { AppStateChangeEvent, createKeyboardVisibilityChange, isKeyboardEvent, isKeypressEvent, isMeWon, KeyboardEvent, KeyPressEvent } from 'src/core/events'

export class Keyboard {

  private _visible = false

  constructor (
    private _bus: EventBus
  ) {

    _bus.events$
      .pipe(filter(isMeWon))
      .subscribe(() => this.hide())

    gameFlow.state$
      .subscribe(e => this.onAppStateChange(e))
  }


  //
  // getters & setters
  // =================


  public get keyPress$(): Observable<KeyPressEvent> {
    return this._bus.events$
      .pipe(filter(isKeypressEvent))
  }

  public get visibility$(): Observable<KeyboardEvent> {
    return this._bus.events$
      .pipe(
        filter(isKeyboardEvent),
        filter(e => e.type === 'visibilityChange')
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
    // console.group('updateVisibility')
    // console.log('_visible', this._visible)
    // console.log('visible', visible)
    // console.groupEnd()

    if (this._visible !== visible) {
      // console.log('updating!!!')
      this._visible = visible
      this._bus.publish(createKeyboardVisibilityChange())
    }
  }

  private onAppStateChange(e: AppStateChangeEvent) {
    if (e.state === 'picking_word' || e.state === 'playing') {
      this.show()
    } else {
      this.hide()
    }
  }
}
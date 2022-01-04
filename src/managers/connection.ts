import { filter } from 'rxjs'
import { io } from 'socket.io-client'
import { EventBus, JottoSocket, jottoSocketDecorator } from 'src/core'
import { AuthEvent, isAuthEvent, isLeaveGame } from 'src/core/events'

// constants
const URL = 'http://localhost:3001'


export class Connection {

  private _socket: JottoSocket

  constructor(
    private _bus: EventBus
  ) {
    this._socket = jottoSocketDecorator(io(URL, { autoConnect: false }))

    const sessionId = localStorage.getItem('session')
    if (sessionId) {
      console.info('connecting with session id...')
      this._socket.updateAuth({ sessionId })
      this._socket.connect()
    }

    _bus.events$
      .pipe(filter(isLeaveGame))
      .subscribe(this.onLeaveGame)

    _bus.events$
      .pipe(filter(isAuthEvent))
      .subscribe(this.onAuth)
  }

  get socket(): JottoSocket {
    return this._socket
  }

  private onLeaveGame = () => {
    if (this._socket.sessionId) {
      localStorage.removeItem(this._socket.sessionId)
    } else {
      console.warn('user leaving with no session id')
    }

    this._socket = jottoSocketDecorator(io(URL, { autoConnect: false }))
  }

  private onAuth = (event: AuthEvent) => {
    localStorage.setItem('session', event.sessionId)
    console.debug('saved session id')
  }

}
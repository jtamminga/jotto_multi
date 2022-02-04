import { filter } from 'rxjs'
import { io } from 'socket.io-client'
import { EventBus, JottoSocket, jottoSocketDecorator } from 'src/core'
import { AuthEvent, isAuthEvent, isLeaveGame } from 'src/core/events'

// constants
const URL = 'http://10.0.0.192:3001'


export class Connection {

  private _socket: JottoSocket

  constructor(
    private _bus: EventBus
  ) {
    this._socket = jottoSocketDecorator(io(URL, { autoConnect: false }))

    const sessionId = sessionStorage.getItem('session')
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
    console.info('clearing session from session storage')
    sessionStorage.removeItem('session')

    this._socket = jottoSocketDecorator(io(URL, { autoConnect: false }))
  }

  private onAuth = (event: AuthEvent) => {
    sessionStorage.setItem('session', event.sessionId)
    console.debug('saved session id')
  }

}
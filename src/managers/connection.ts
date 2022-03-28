import { Credentials } from 'jotto_core'
import { filter } from 'rxjs'
import { io, Socket } from 'socket.io-client'
import { EventBus, JottoSocket, jottoSocketDecorator } from 'src/core'
import { isLeaveGame } from 'src/core/events'

// constants
const URL = 'http://10.0.0.192:3001'

const socketOptions = {
  autoConnect: false,
  transports: ['websocket']
}


export class Connection {

  private _socket: JottoSocket

  constructor(
    private _bus: EventBus
  ) {
    this._socket = jottoSocketDecorator(io(URL, socketOptions))

    const sessionId = localStorage.getItem('session')
    if (sessionId) {
      console.info('connecting with session id...')
      this._socket.updateAuth({ sessionId })
      this._socket.connect()
    }

    this._socket.on('session', this.onSession)
    this._socket.on('connect_error', this.onConnectError)
    this._socket.on('disconnect', this.onDisconnect)

    _bus.events$
      .pipe(filter(isLeaveGame))
      .subscribe(this.onLeaveGame)
  }


  //
  // getters & setters
  // =================


  get socket(): JottoSocket {
    return this._socket
  }


  //
  // bus handlers
  // ============


  private onSession = ({ sessionId }: Credentials) => {
    console.debug('[connection] onSession:', { sessionId })

    this._socket.updateAuth({ sessionId })
    // this._socket.connect()

    localStorage.setItem('session', sessionId)
    console.debug('saved session id')
  }

  private onLeaveGame = () => {
    console.info('clearing session from session storage')
    localStorage.removeItem('session')

    this._socket = jottoSocketDecorator(io(URL, socketOptions))
  }

  private onConnectError = (error: Error) => {
    console.error('connect error:', error.message)
    localStorage.removeItem('session')
  }

  private onDisconnect = (reason: Socket.DisconnectReason) => {
    const forced = reason === 'io server disconnect'
    
    if (forced) {
      localStorage.removeItem('session')
    }
  }

}
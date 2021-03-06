import { Credentials } from 'jotto_core'
import { filter, Observable } from 'rxjs'
import { io, Socket } from 'socket.io-client'
import { ConnectionState, EventBus, JottoSocket, jottoSocketDecorator } from 'src/core'
import { ConnectionEvent, createConnectionStateChange, createError, createLoading, isConnectionEvent, isLeaveGame } from 'src/core/events'
import { JottoError } from 'src/models'


const socketOptions = {
  autoConnect: false,
  transports: ["websocket"]
}


export class Connection {

  private _socket: JottoSocket
  private _state: ConnectionState = 'disconnected'
  private _hasConnected: boolean = false
  private _coldRestart = false

  constructor(
    private _bus: EventBus,
    serverUrl: string
  ) {
    this._socket = jottoSocketDecorator(io(serverUrl, socketOptions))

    const sessionId = localStorage.getItem('session')
    if (sessionId) {
      console.info('[connection] connecting with session id...')
      this._coldRestart = true
      this._socket.updateAuth({ sessionId })
      this._socket.connect()
    } else {
      console.info('[connection] no session id found')
    }

    this._socket.on('session', this.onSession)
    this._socket.on('connect', this.onConnect)
    this._socket.on('disconnect', this.onDisconnect)
    this._socket.on('connect_error', this.onConnectError)

    _bus.events$
      .pipe(filter(isLeaveGame))
      .subscribe(this.onLeaveGame)
  }


  //
  // getters & setters
  // =================


  get state$(): Observable<ConnectionEvent> {
    return this._bus.events$
      .pipe(filter(isConnectionEvent))
  }

  get socket(): JottoSocket {
    return this._socket
  }

  get state(): ConnectionState {
    return this._state
  }

  get coldRestart(): boolean {
    return this._coldRestart
  }


  //
  // bus handlers
  // ============


  private onSession = ({ sessionId }: Credentials) => {
    console.debug('[connection] onSession:', { sessionId })

    this._socket.updateAuth({ sessionId })

    localStorage.setItem('session', sessionId)
    console.debug('[connection] saved session id')
  }

  private onLeaveGame = () => {
    console.info('[connection] leaving the game')
    this._bus.publish(createLoading(false))
    this.fullDisconnect()
  }

  private onConnect = () => {
    console.info('[connection] connected')
    this._bus.publish(createLoading(false))
    this._hasConnected = true
    this.updateState('connected')
  }

  private onDisconnect = (reason: Socket.DisconnectReason) => {
    console.log('[connection] onDisconnect reason:', reason)
    this._bus.publish(createLoading(false))

    switch (reason) {
      case 'io server disconnect': // on server socket.disconnect
        this.fullDisconnect()
        break
      case 'io client disconnect': // on client socket.disconnect
        // already handled
        break
      default:
        this.updateState('connecting')
        break
    }
  }

  private onConnectError = (error: Error) => {
    console.warn('[connection] connect error:', error.message)

    this._bus.publish(createLoading(false))

    // this can happen if the internet cuts out
    // so we don't want to kick them out of the game yet
    if (error.message === 'websocket error') {
      this.updateState('connecting')
      return
    }
    
    // at this point do a full disconnect
    this.fullDisconnect()

    if (error.message === 'lobby not available') {
      this._bus.publish(createError(
        new JottoError('lobby_not_available', 'Lobby not available')))
    }
  }


  //
  // private functions
  // =================


  private fullDisconnect() {
    console.info('[connection] full disconnect')
    localStorage.removeItem('session')
    this._coldRestart = false
    this._hasConnected = false
    this._socket.disconnect()
    this._socket.updateAuth({})
    this.updateState('disconnected')
  }

  private updateState(state: ConnectionState) {
    if (this._state !== state) {
      this._state = state
      this._bus.publish(createConnectionStateChange(state))
    }
  }

}
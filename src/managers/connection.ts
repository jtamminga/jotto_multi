import { Credentials } from 'jotto_core'
import { filter } from 'rxjs'
import { io, Socket } from 'socket.io-client'
import { ConnectionState, EventBus, JottoSocket, jottoSocketDecorator } from 'src/core'
import { createConnectionStateChange, createError, isLeaveGame } from 'src/core/events'
import { JottoError } from 'src/models'


const socketOptions = {
  autoConnect: false,
  transports: ["websocket"]
}


export class Connection {

  private _socket: JottoSocket
  private _state: ConnectionState = 'disconnected'
  private _hasConnected: boolean = false

  constructor(
    private _bus: EventBus,
    private _serverUrl: string
  ) {
    this._socket = jottoSocketDecorator(io(_serverUrl, socketOptions))

    const sessionId = localStorage.getItem('session')
    if (sessionId) {
      console.info('connecting with session id...')
      this._socket.updateAuth({ sessionId })
      this._socket.connect()
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


  get socket(): JottoSocket {
    return this._socket
  }

  get state(): ConnectionState {
    return this._state
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
    console.info('[connection] leaving the game')
    this.fullDisconnect()
  }

  private onConnect = () => {
    this._hasConnected = true
    this.updateState('connected')
  }

  private onDisconnect = (reason: Socket.DisconnectReason) => {
    console.log('[connection] onDisconnect reason:', reason)

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
    console.error('connect error:', error.message)
    
    this.fullDisconnect()

    if (!this._hasConnected) {
      this._bus.publish(createError(
        new JottoError('lobby_closed', 'Lobby closed by server')))
    }
  }


  //
  // private functions
  // =================


  private fullDisconnect() {
    console.info('[connection] full disconnect')
    localStorage.removeItem('session')
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
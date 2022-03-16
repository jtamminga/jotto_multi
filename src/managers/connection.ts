import { Credentials } from 'jotto_core'
import { filter } from 'rxjs'
import { io } from 'socket.io-client'
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
  private _lobbyCode: string | undefined

  constructor(
    private _bus: EventBus
  ) {
    this._socket = jottoSocketDecorator(io(URL, socketOptions))

    const sessionId = sessionStorage.getItem('session')
    if (sessionId) {
      console.info('connecting with session id...')
      this._socket.updateAuth({ sessionId })
      this._socket.connect()
    }

    this._socket.on('session', this.onSession)

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

  get lobbyCode(): string | undefined {
    return this._lobbyCode
  }


  //
  // bus handlers
  // ============


  private onSession = ({ sessionId, lobbyCode }: Credentials) => {
    console.debug('[connection] onSession:', { sessionId, lobbyCode })

    this._lobbyCode = lobbyCode
    this._socket.updateAuth({ sessionId })
    // this._socket.connect()

    sessionStorage.setItem('session', sessionId)
    console.debug('saved session id')
  }

  private onLeaveGame = () => {
    console.info('clearing session from session storage')
    sessionStorage.removeItem('session')

    this._socket = jottoSocketDecorator(io(URL, socketOptions))
  }


  //
  // private functions
  // =================


  

}
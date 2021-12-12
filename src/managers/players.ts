import { filter } from 'rxjs'
import { EventBus, IllegalStateException, JottoSocket, SocketSession, User } from 'src/core'
import * as PlayerEvents from 'src/core/events/player'
import { Me, Player } from 'src/models'

export class Players {
  private _players: Player[]

  // this user and player
  private _userId: string | undefined
  private _player: Me | undefined
  
  constructor(
    private _socket: JottoSocket,
    private _bus: EventBus
  ) {
    this._players = []

    this.setupListeners()

    this._bus.events$
      .pipe(filter(PlayerEvents.isPickedWordEvent))
      .subscribe(e => this.me.setWord(e.word))
  }

  private setupListeners() {
    this._socket.on('session', this.onSession)
    this._socket.on('users', this.onUsers)
    this._socket.on('user_connect', this.onConnect)
    this._socket.on('user_disconnect', this.onDisconnect)
    this._socket.on('user_ready', this.onReady)
  }

  //
  // getters & setters
  //

  get me(): Me {
    if (this._player === undefined) {
      throw new IllegalStateException('Not in game yet.')
    }

    return this._player
  }

  //
  // Listeners
  //

  private onSession = ({ sessionId, userId }: SocketSession) => {
    console.debug('onSession')  
    this._socket.userId = userId
    this._socket.updateAuth({ sessionId })
    this._userId = userId
  }

  private onUsers = (users: User[]) => {
    console.debug('onUsers')

    for(const user of users) {
      if (user.userId === this._userId) {
        const me = new Me(user, this._bus)
        this._player = me
        this._players.push(me)
      } else {
        this._players.push(new Player(user))
      }
    }
  }

  private onConnect = (user: User) => {
    console.debug('onConnect', user.userId)
    let player = this._players.find(p => p.userId === user.userId)

    if (player) {
      player.connected = true
    } else {
      player = new Player(user)
      this._players.push(player)
    }

    this._bus.publish(PlayerEvents.createConnected(player))
  }

  private onDisconnect = (userId: string) => {
    console.debug('onDisconnect', userId)
    const player = this._players.find(p => p.userId === userId)
      
    if (!player) {
      throw new IllegalStateException('Player doesn\'t exist.')
    }

    player.connected = false
    this._bus.publish(PlayerEvents.createDisconnected(player))
  }

  private onReady = (userId: string) => {
    console.debug('onReady', userId)
    const player = this._players.find(p => p.userId === userId)

    if (!player) {
      throw new IllegalStateException('Player doesn\'t exist.')
    }

    player.ready = true
    this._bus.publish(PlayerEvents.createReady(player))
  }
}
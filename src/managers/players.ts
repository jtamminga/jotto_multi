import { filter } from 'rxjs'
import { EventBus, IllegalStateException, JottoSocket, SocketSession } from 'src/core'
import { WordEvent, isWordEvent, SubmitGuessEvent } from 'src/core/events/me'
import { Me, Player } from 'src/models'
import {
  createPlayerCreated,
  createPlayerConnected,
  createPlayerDisconnected,
  createPlayerReady,
  isPlayersEvent
} from 'src/core/events/players'
import { GameEvent, isGameEvent } from 'src/core/events/game'
import { createAuth } from 'src/core/events/app'
import { PlayerState, Session, UserRestore } from 'jotto_core'

export class Players {

  // this user and player
  private _userId: string | undefined
  private _player: Me | undefined

  // collection of all players
  private _players: Player[] = []
  
  constructor(
    private _socket: JottoSocket,
    private _bus: EventBus
  ) {
    this.setupListeners()

    this._bus.events$
      .pipe(filter(isWordEvent))
      .subscribe(this.onWordEvent)

    this._bus.events$
      .pipe(filter(isGameEvent))
      .subscribe(this.onGameEvent)
  }

  private setupListeners() {
    this._socket.on('session', this.onSession)
    this._socket.on('users', this.onUsers)
    this._socket.on('userConnect', this.onConnect)
    this._socket.on('userDisconnect', this.onDisconnect)
    this._socket.on('userReady', this.onReady)
    this._socket.on('restore', this.onRestore)
  }


  //
  // getters & setters
  // =================


  get change$() {
    return this._bus.events$
      .pipe(filter(isPlayersEvent))
  }

  get me(): Me {
    if (this._player === undefined) {
      throw new IllegalStateException('Player is not in the game')
    }

    return this._player
  }

  get connected(): Player[] {
    return this._players.filter(p => p.connected && p.isPlaying)
  }

  get playing(): Player[] {
    return this._players.filter(p => p.isPlaying)
  }

  get observing(): Player[] {
    return this._players.filter(p => p.isObserving)
  }

  get all(): Player[] {
    return this._players
  }


  //
  // public functions
  // ================


  public get(userId: string): Player {
    const player = this.find(userId)

    if (!player) {
      throw new Error('Player not found')
    }

    return player
  }


  //
  // listeners
  // =========


  private onSession = ({ sessionId, userId }: SocketSession) => {
    console.debug('onSession')  
    this._socket.userId = userId
    this._socket.updateAuth({ sessionId })
    this._userId = userId
    this._bus.publish(createAuth(sessionId))
  }

  private onUsers = (users: Session[]) => {
    console.debug('onUsers', users.map(u => u.username))

    // first clear players from previous play throughs
    this._players.forEach(p => p.dispose())
    this._players = []

    for(const user of users) {
      if (user.userId === this._userId) {
        const me = new Me(user as PlayerState)
        this._player = me
        this._players.push(me)
        this._bus.publish(createPlayerCreated(me))
      } else {
        const player = new Player(user as PlayerState)
        this._players.push(player)
        this._bus.publish(createPlayerCreated(player))
      }
    }
  }

  private onConnect = (user: Session) => {
    console.debug('onConnect', user)
    let player = this._players.find(p => p.userId === user.userId)

    if (player) {
      player.connected = true
    } else {
      player = new Player(user as PlayerState)
      this._players.push(player)
    }

    this._bus.publish(createPlayerConnected(player))
  }

  private onDisconnect = (userId: string) => {
    console.debug('onDisconnect', userId)
    const player = this.find(userId)

    if (!player) {
      return
    }

    player.connected = false
    this._bus.publish(createPlayerDisconnected(player))
  }

  private onReady = (userId: string) => {
    console.debug('onReady', userId)
    const player = this.get(userId)

    player.ready = true
    this._bus.publish(createPlayerReady(player))
  }

  private onRestore = (restore: UserRestore) => {
    console.debug('onRestore', restore)

    this._userId = restore.userId
    this.onUsers(restore.users)
    
    if (restore.word) {
      this.me.setWord(restore.word)
    }
  }


  //
  // bus handlers
  // ============


  private onWordEvent = (event: WordEvent) => {
    switch(event.type) {
      case 'picked_word':
        this.me.setWord(event.word)
        break
      case 'submit_guess':
        const { id, word } = event as SubmitGuessEvent
        this._socket.emit('submitGuess', { id, word })
        break
    }
  }

  private onGameEvent = (event: GameEvent) => {
    switch(event.type) {
      case 'leave':
        this._players.forEach(p => p.dispose())
        this._players = []
        break
    }
  }


  //
  // private functions
  // =================


  private find(userId: string): Player | undefined {
    return this._players.find(p => p.userId === userId)
  }
}
import { filter } from 'rxjs'
import { EventBus, IllegalStateException, JottoSocket } from 'src/core'
import { WordEvent, isWordEvent, SubmitGuessEvent } from 'src/core/events/me'
import { Me, Player } from 'src/models'
import {
  createPlayerConnected,
  createPlayerDisconnected,
  createPlayerReady,
  isPlayersEvent,
  createAllPlayersCreated
} from 'src/core/events/players'
import { GameEvent, isGameEvent } from 'src/core/events/game'
import { comparePlayers, Credentials, PlayerState, UserRestore, UserState } from 'jotto_core'
import { ConnectionEvent, createLoading, isConnectionEvent } from 'src/core/events'
import { gameFlow } from 'src/core/di'

export class Players {

  // this user and player
  private _userId: string | undefined
  private _player: Me | undefined

  // collection of all players
  private _players: Player[] = []
  private _playersByRank: Player[] | undefined
  
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

    this._bus.events$
      .pipe(filter(isConnectionEvent))
      .subscribe(this.onConnectionEvent)
  }

  private setupListeners() {
    this._socket.on('session', this.onSession)
    this._socket.on('users', this.onUsers)
    this._socket.on('userConnect', this.onConnect)
    this._socket.on('userDisconnect', this.onDisconnect)
    this._socket.on('wordPicking', this.onWordPicking)
    this._socket.on('assignedWord', this.onAssignedWord)
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

  get ready(): boolean {
    return this._player !== undefined
  }

  get me(): Me {
    if (this._player === undefined) {
      throw new IllegalStateException('Player is not in the game')
    }

    return this._player
  }

  get playing(): Player[] {
    return this._players.filter(p => p.isPlaying)
  }

  get byRank(): Player[] {
    return this._playersByRank ?? this.playing
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

  public isMe(player: Player): boolean {
    return this.me === player
  }

  public tutorialMode(): Player[] {
    this.setupMockPlayers()
    return this._players
  }

  public clearTutoralMode() {
    this.reset()
  }

  public updateRanks() {
    // sort players by rank and save results
    this._playersByRank = this.playing.sort((a, b) =>
      comparePlayers(a.perf, b.perf))

    // update each player with new rank
    this._playersByRank.forEach((player, i) =>
      player.updateRank(i + 1))

    return this._playersByRank
  }


  //
  // listeners
  // =========


  private onSession = ({ userId }: Credentials) => {
    console.debug('[players] set userId:', userId)
    this._userId = userId
  }

  private onUsers = (users: UserState[]) => {
    console.debug('[players] onUsers', users)

    for(const userState of users) {
      const user = this.find(userState.userId)

      // if user already exists then update
      if (user) {
        user.update(userState)
        continue
      }

      if (userState.userId === this._userId) {
        const me = new Me(userState as PlayerState)
        this._player = me
        this._players.push(me)
      } else {
        const player = new Player(userState as PlayerState)
        this._players.push(player)
      }
    }

    this._bus.publish(createAllPlayersCreated(this._players))
    this._bus.publish(createLoading(false))
  }

  private onConnect = (user: UserState, reconnected: boolean) => {
    console.debug('[players] onConnect', user)
    let player = this._players.find(p => p.userId === user.userId)

    if (player) {
      player.connected = true
      player.playingAgain = gameFlow.state === 'game_summary' && !reconnected
    }
    // reconnects don't count as a user joining
    else if (!reconnected) {
      player = new Player(user as PlayerState)
      this._players.push(player)
    }

    if (player) {
      this._bus.publish(createPlayerConnected(player, reconnected))
    }
  }

  private onDisconnect = (userId: string, intended: boolean) => {
    console.debug('[players] onDisconnect', userId)
    const index = this._players.findIndex(p => p.userId === userId)

    if (index === -1) {
      return
    }

    const player = this._players[index]
    player.connected = false

    if (intended) {
      player.leftLobby = true
      if (gameFlow.state === 'joined_room') {
        player.dispose()
        this._players.splice(index, 1)
      }
    }

    this._bus.publish(createPlayerDisconnected(player, intended))
  }

  private onWordPicking = () => {
    console.debug('[players] on word picking')
    // reset all players before start of game
    this._players.forEach(p => p.reset())
  }

  protected onAssignedWord = (word: string) => {
    console.debug('[players] assigned word:', word)
    this.me.setWord(word)
  }

  private onReady = (userId: string) => {
    console.debug('[players] onReady', userId)
    const player = this.get(userId)

    player.ready = true
    this._bus.publish(createPlayerReady(player))
  }

  private onRestore = (restore: UserRestore) => {
    console.debug('[players] onRestore', restore)

    // reset players
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
        this._userId = undefined
        this._player?.dispose()
        this._player = undefined
      // eslint-disable-next-line no-fallthrough
      case 'playAgain':
        this._players.forEach(p => p.dispose())
        this._players = []
        break
      case 'guess_result':
        this.updateRanks()
        break
    }
  }

  private onConnectionEvent = (event: ConnectionEvent) => {
    if (event.state === 'disconnected') {
      console.log('[players] disconnected: resetting players')
      this.reset()
    }
  }


  //
  // private functions
  // =================


  private setupMockPlayers() {
    const me = new Me({
      userId: '1',
      lobbyCode: '1',
      username: 'John',
      type: 'player',
      host: false,
      connected: false,
      ready: true,
      wonAt: undefined
    })

    const opponent = new Player({
      userId: '2',
      lobbyCode: '1',
      username: 'Alex',
      type: 'player',
      host: false,
      connected: false,
      ready: true,
      wonAt: undefined
    })

    me.startPlaying() // creates notes

    this._players = [me, opponent]
    this._player = me
    this._userId = me.userId
  }

  private find(userId: string): Player | undefined {
    return this._players.find(p => p.userId === userId)
  }

  private reset() {
    this._userId = undefined
    this._player?.dispose()
    this._player = undefined

    this._players.forEach(p => p.dispose())
    this._players = []
    this._playersByRank = undefined
  }
}
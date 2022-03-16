import { filter } from 'rxjs'
import {
  UserRestore as SocketUserRestore,
  GameConfig as SocketGameConfig,
  GameSummary,
  UserType,
  HostConfig } from 'jotto_core'
import { EventBus, AppState, JottoSocket, SocketGuessResult, IllegalStateException } from 'src/core'
import { createGuessResult, createLeaveGame, createPlayAgain } from 'src/core/events/game'
import { createPickedWord } from 'src/core/events/me'
import { Game, JottoError } from 'src/models'
import { Players } from './players'
import * as AppEvents from 'src/core/events/app'
import * as Transform from 'src/core/transforms'
import { createError } from 'src/core/events'

/**
 * Handles game flow related functions.
 * If it effects the flow of the game it should be here.
 */
export class GameFlow {

  private _state: AppState
  private _game: Game | undefined
  private _loading: boolean


  constructor(
    private _socket: JottoSocket,
    private _bus: EventBus,
    private _players: Players
  ) {
    this._loading = false
    this._state = 'role_select'

    this.setupListeners()
  }

  private setupListeners() {
    this._socket.on('connect', this.onConnect)
    this._socket.on('connect_error', this.onError)
    this._socket.on('wordPicking', this.onWorkPicking)
    this._socket.on('startPlaying', this.onStartPlaying)
    this._socket.on('guessResult', this.onGuessResult)
    this._socket.on('endGameSummary', this.onGameOver)
    this._socket.on('restore', this.onRestore)
  }


  //
  // getters & setters
  // =================


  public get state$() {
    return this._bus.events$
      .pipe(
        filter(AppEvents.isStateChangeEvent)
      )
  }

  public get loading$() {
    return this._bus.events$
      .pipe(
        filter(AppEvents.isLoadingStateChangeEvent)
      )
  }

  public get state(): AppState {
    return this._state
  }

  public get loading(): boolean {
    return this._loading
  }

  public get game(): Game {
    if (!this._game) {
      throw new IllegalStateException('There is no game')
    }

    return this._game
  }


  //
  // public functions 
  // ================


  public hostLobby() {
    this._socket.connect()
    this.updateState('joining_room')
  }

  public joiningLobby() {
    this.updateState('joining_lobby')
  }

  public joinLobby(code: string) {
    this._socket.updateAuth({ lobbyCode: code })
    this._socket.connect()
    this.updateLoading(true)
    // switch to 'joining_room' on connect success
  }

  public joinRoom(username: string, type: UserType) {
    this._socket.emit('joinRoom', username, type)
    this.updateState('joined_room')
  }

  public start(config: HostConfig) {
    this._socket.emit('startGame', config)
  }

  public pickWord(word: string) {
    this._socket.emit('submitWord', word)
    this.updateState('picked_word')
    this._bus.publish(createPickedWord(word))
  }

  public observe() {
    this.updateState('observing')
  }

  public backToRoom() {
    this._socket.emit('rejoinRoom')
    this.updateState('joined_room')
    this._bus.publish(createPlayAgain())

    this._game!.dispose()
    this._game = undefined
  }

  public leave() {
    this.updateState('joining_room')
    this._socket.disconnect()
    this._bus.publish(createLeaveGame())

    this._game?.dispose()
    this._game = undefined
  }


  //
  // event handlers
  // ==============


  private onConnect = () => {
    console.log('onConnect', this._state)

    // bail if not in role select
    // (this is also called on reconnect)
    if (this._state !== 'joining_lobby') {
      return
    }

    this.updateState('joining_room')
    this.updateLoading(false)
  }

  private onError = (error: Error) => {
    console.error('connect error:', error.message)
    this._bus.publish(createError(
      new JottoError('lobby_not_available', 'Lobby is not available')))
    this.updateLoading(false)
  }

  private onWorkPicking = () => {
    this.updateStateIf({ player: 'picking_word', obs: 'picked_word'})
  }

  private onStartPlaying = (gameConfig: SocketGameConfig, restore?: SocketUserRestore) => {
    const config = Transform.gameConfig(gameConfig)
    const gameRestore = restore ? Transform.gameRestore(restore) : undefined

    this._game = new Game(this._players.playing, config, gameRestore)
    
    if (restore) {
      this.updateStateIf({ player: 'playing', obs: 'observing' })
    } else {
      this.updateState('starting_game')
      setTimeout(() => {
        this._game?.start()
        this.updateStateIf({ player: 'playing', obs: 'observing' })
      }, config.preGameLength * 1_000)
    }
  }

  private onGuessResult = (guessResult: SocketGuessResult) => {
    if (!this._game) {
      throw new IllegalStateException('game not created yet')
    }

    const result = Transform.guessResult(guessResult)
    this._game.addGuess(result)
    this._bus.publish(createGuessResult(result))
  }

  private onGameOver = (summary: GameSummary) => {
    this._game!.gameOver(summary)
    this.updateState('game_summary')
  }

  private onRestore = (restore: SocketUserRestore) => {
    switch (restore.state) {
      case 'in_room':
        this.updateState('joined_room')
        break
      case 'picking_word':
        this.updateState('picking_word')
        break
      case 'picked_word':
        this.updateState('picked_word')
        break
      case 'playing':
        this.onStartPlaying(restore.config!, restore)
        break
      case 'game_over':
        this.onStartPlaying(restore.config!, restore)
        this.onGameOver(restore.gameSummary!)
        break
    }
  }


  //
  // private functions
  // =================


  private updateState(state: AppState) {
    const preState = this._state
    this._state = state

    if (preState !== state) {
      this._bus.publish(AppEvents.createStateChange(this._state, preState))
    }
  }

  private updateLoading(loading: boolean) {
    if (this._loading !== loading) {
      this._loading = loading
      this._bus.publish(AppEvents.createLoadingChange())
    }
  }

  private updateStateIf({ player, obs }: { player: AppState, obs: AppState}) {
    if (this._players.me.isPlaying) {
      this.updateState(player)
    } else {
      this.updateState(obs)
    }
  }

}
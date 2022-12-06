import { filter } from 'rxjs'
import {
  UserRestore as SocketUserRestore,
  GameConfig as SocketGameConfig,
  GameSummary as SocketGameSummary,
  GuessResult as SocketGuessResult,
  UserType,
  HostConfig
} from 'jotto_core'
import { EventBus, AppState, JottoSocket, IllegalStateException } from 'src/core'
import { createGuessResult, createLeaveGame, createPlayAgain } from 'src/core/events/game'
import { createPickedWord } from 'src/core/events/me'
import { Game } from 'src/models'
import { Players } from './players'
import * as AppEvents from 'src/core/events/app'
import * as Transform from 'src/core/transforms'
import { ConnectionEvent, createLoading, isConnectionEvent } from 'src/core/events'
import { differenceInMilliseconds } from 'date-fns'

/**
 * Handles game flow related functions.
 * If it effects the flow of the game it should be here.
 */
export class GameFlow {

  private _state: AppState
  private _game: Game | undefined

  private _pickWordTimer: ReturnType<typeof setTimeout> | undefined
  private _startingTimer: ReturnType<typeof setTimeout> | undefined


  constructor(
    private _socket: JottoSocket,
    private _bus: EventBus,
    private _players: Players
  ) {
    this._state = 'role_select'

    this.setupListeners()
  }

  private setupListeners() {
    this._socket.on('wordPicking', this.onWorkPicking)
    this._socket.on('startPlaying', this.onStartPlaying)
    this._socket.on('guessResult', this.onGuessResult)
    this._socket.on('endGameSummary', this.onGameOver)
    this._socket.on('restore', this.onRestore)

    this._bus.events$
      .pipe(filter(isConnectionEvent))
      .subscribe(this.onConnectionEvent)
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

  public get state(): AppState {
    return this._state
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


  public startTutorial() {
    this.updateState('tutorial')
  }

  public hostLobby() {
    this._socket.connect()
    this.updateState('joining_room')
  }

  public joiningLobby() {
    this.updateState('joining_lobby')
  }

  public joinLobby(code: string) {
    this._bus.publish(createLoading(true))
    this._socket.updateAuth({ lobbyCode: code })
    this._socket.connect()
    // switch to 'joining_room' on connect success
    // aren't optimistic in this case (just switch to the next state)
    // because we don't want to go back if lobby code is wrong
  }

  public joinRoom(username: string, type: UserType) {
    this._bus.publish(createLoading(true))
    this._socket.emit('joinRoom', username, type)
    this.updateState('joined_room')
  }

  public start(config: HostConfig) {
    this._socket.emit('startGame', config)
  }

  public pickWord(word: string) {
    if (this._pickWordTimer) {
      clearTimeout(this._pickWordTimer)
    }
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
    this.updateState('role_select')
    this._bus.publish(createLeaveGame())

    this._game?.dispose()
    this._game = undefined
  }


  //
  // event handlers
  // ==============


  private onConnectionEvent = (event: ConnectionEvent) => {
    console.log('[gameflow] onConnectionEvent state:', event.state)

    switch (event.state) {
      case 'connected':
        // bail if not in role select
        // (this is also called on reconnect)
        if (this._state !== 'joining_lobby') {
          return
        }

        this.updateState('joining_room')
        break

      case 'disconnected':
        this.updateState('role_select')
        this._game?.dispose()
        this._game = undefined
        break
    }
  }

  private onWorkPicking = (socketConfig: SocketGameConfig, socketRestore?: SocketUserRestore) => {
    console.log('[gameflow] on word picking')

    this._game = new Game(
      this._players.playing,
      Transform.gameConfig(socketConfig),
      socketRestore && Transform.gameRestore(socketRestore)
    )

    if (this._players.me.isObserving) {
      this.updateState('picked_word')
      return
    }

    // if me picked a word
    if (socketRestore?.word !== undefined) {
      this.updateState('picked_word')
    }
    // if me didn't pick a word
    else {
      this.updateState('picking_word')

      if (this._pickWordTimer) clearTimeout(this._pickWordTimer)
      this._pickWordTimer = setTimeout(() => {
        // skip over picked_word
        this.updateState('starting_game')
      }, differenceInMilliseconds(this._game.wordDueOn, Date.now()))
    }
  }

  private onStartPlaying = (restore?: SocketUserRestoreExt) => {
    console.log('[gameflow] on start playing')

    if (!this._game) {
      throw new IllegalStateException('game not created yet')
    }

    this._game.starting()
    const milliTillStart = differenceInMilliseconds(this._game.startedOn, Date.now())

    // if restoring and game has started (playing)
    // then either in playing or observing state
    if (restore && milliTillStart <= 0) {
      if (this._players.me.isObserving || restore.preRestoreState === 'observing') {
        this.updateState('observing')
      } else {
        this.updateState('playing')
      }
    }

    // otherwise the game is still starting
    else {
      this.updateState('starting_game')
      
      if (this._startingTimer) clearTimeout(this._startingTimer)
      if (this._pickWordTimer) clearTimeout(this._pickWordTimer)
      
      this._startingTimer = setTimeout(() => {
        this._game?.playing()
        this.updateStateIf({ player: 'playing', obs: 'observing' })
      }, milliTillStart)
    }

    this._players.updateRanks()
  }

  private onGuessResult = (guessResult: SocketGuessResult) => {
    if (!this._game) {
      throw new IllegalStateException('game not created yet')
    }

    const result = Transform.guessResult(guessResult)
    this._game.addGuess(result)
    this._bus.publish(createGuessResult(result))
  }

  private onGameOver = (summary: SocketGameSummary) => {
    this._game!.gameOver(Transform.gameSummary(summary))
    this.updateState('game_summary')
  }

  private onRestore = (userRestore: SocketUserRestore) => {
    console.log('[gameflow] on restore')

    // optimization
    // this restores only missing guesses rather than doing a full restore
    if (this.tryHistoryRestore(userRestore)) {
      console.log('[gameflow] restored history')
      return
    }

    console.log('[gameflow] full restore')

    const restore: SocketUserRestoreExt = {
      ...userRestore,
      preRestoreState: this._state
    }

    switch (restore.state) {
      case 'in_room':
        this.updateState('joined_room')
        break
      case 'picking_word':
        this.onWorkPicking(restore.config!, restore)
        break
      case 'picked_word':
        this.onWorkPicking(restore.config!, restore)
        this.updateState('picked_word')
        break
      case 'playing':
        this.onWorkPicking(restore.config!, restore)
        this.onStartPlaying(restore)
        break
      case 'game_over':
        this.onWorkPicking(restore.config!, restore)
        this.onStartPlaying(restore)
        this.onGameOver(restore.gameSummary!)
        break
    }
  }


  //
  // private functions
  // =================


  private tryHistoryRestore(restore: SocketUserRestore): boolean {
    if (this._game
      && this._game.id === restore.config?.gameId
      && (this._state === 'playing' || this._state === 'observing')
      && restore.state === 'playing'
      && restore.history
    ) {
      const { history } = restore
      const numMissed = history.length - this._game.guesses.length
      console.log(`[gameflow] restoring ${numMissed} guess(es)`)

      for (let i = history.length - numMissed; i < history.length; i++) {
        this.onGuessResult(history[i])
      }

      return true
    }

    return false
  }

  private updateState(state: AppState) {
    const preState = this._state
    this._state = state

    if (preState !== state) {
      this._bus.publish(AppEvents.createStateChange(this._state, preState))
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

//
interface SocketUserRestoreExt extends SocketUserRestore {
  preRestoreState: AppState
}
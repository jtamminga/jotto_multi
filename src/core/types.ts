import { Player } from 'src/models'
import { Minutes, PlayerSummary as SocketPlayerSummary, Seconds } from 'jotto_core'

export interface User {
  userId: string;
  sessionId: string;
  username: string;
  connected: boolean;
  ready: boolean;
  won: boolean;
}

export type AppState =
  | 'joining_room'
  | 'joined_room'
  | 'picking_word'
  | 'picked_word'
  | 'starting_game'
  | 'playing'
  | 'observing'
  | 'game_summary'

export type GameState =
  | 'starting'
  | 'playing'
  | 'over'

export interface SocketGameConfig {
  opponents: { id: string, opponentId: string }[]
}

export interface GameConfig {
  preGameLength: Seconds
  gameLength: Minutes | undefined
  opponents: { player: Player, opponent: Player }[]
}

export interface SocketGuessResult {
  id: string
  word: string
  date: number
  common: number
  won: boolean
  from: string
  to: string
}

export interface Guess {
  id: string
  word: string
  common?: number
}

export interface GuessResult extends Guess {
  common: number
  won: boolean
  from: Player
  to: Player
}

export interface PlayerSummary extends Omit<SocketPlayerSummary, 'userId'> {
  player: Player
}

export interface SocketGameSummary {
  playerSummaries: SocketPlayerSummary[]
}

export interface GameSummary {
  playerSummaries: PlayerSummary[]
}

export type PlayerLobbyState =
  | 'in_room'
  | 'picking_word'
  | 'picked_word'
  | 'playing'
  | 'game_over'

export interface GameRestore {
  timeUpOn: Date | undefined
  history: GuessResult[]
}

export class IllegalStateException extends Error { }
import { Player } from 'src/models'

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
  | 'ingame'
  | 'game_summary'

export type GameState =
  | 'playing'
  | 'over'

export interface GameConfig {
  opponents: { id: string, opponentId: string }[]
}

export interface SocketGuessResult {
  id: string
  word: string
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

export interface SocketPlayerSummary {
  userId: string
  place: number
  word: string
  numGuesses: number
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

export class IllegalStateException extends Error { }
import { Player } from 'src/models'
import {
  GameOverReason,
  Minutes,
  PlayerSummary as SocketPlayerSummary,
  Seconds
} from 'jotto_core'

export interface AppConfig {
  serverUrl: string
  logRocketAppId: string
}

export interface User {
  userId: string;
  sessionId: string;
  username: string;
  connected: boolean;
  ready: boolean;
  won: boolean;
}

export type AppState =
  | 'tutorial'
  | 'role_select'
  | 'joining_lobby'
  | 'joining_room'
  | 'joined_room'
  | 'picking_word'
  | 'picked_word'
  | 'starting_game'
  | 'playing'
  | 'observing'
  | 'game_summary'

export type ConnectionState =
  | 'disconnected'
  | 'connected'
  | 'connecting'

export type GameState =
  | 'picking_word'
  | 'starting'
  | 'playing'
  | 'over'

export type LetterNote = {
  confidence: 'known' | 'maybe'
  inWord: boolean
}

export type LetterNotes = Map<string, LetterNote>

export interface SocketGameConfig {
  opponents: { id: string, opponentId: string }[]
}

export interface GameConfig {
  gameId: string
  pickWordLength: Seconds
  preGameLength: Seconds
  gameLength: Minutes | undefined
  opponents: { player: Player, opponent: Player }[]
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
  date: number
}

export interface DetailedGuessResult extends GuessResult {
  worksWithNotes: boolean | undefined
}

export interface PlayerSummary extends Omit<SocketPlayerSummary, 'userId'> {
  player: Player
}

export interface GameSummary {
  gameLength: Seconds
  gameOverReason: GameOverReason
  playerSummaries: PlayerSummary[]
}

export type PlayerLobbyState =
  | 'in_room'
  | 'picking_word'
  | 'picked_word'
  | 'playing'
  | 'game_over'

export interface GameRestore {
  pickingWordOn: Date | undefined
  startedOn: Date | undefined
  history: GuessResult[]
}

export class IllegalStateException extends Error { }
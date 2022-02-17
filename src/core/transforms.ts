import { players } from 'src/core/di'
import {
  GameConfig as SocketGameConfig,
  GameSummary as SocketGameSummary,
  UserRestore as SocketUserRestore
} from 'jotto_core'
import { GameRestore, GameSummary, GuessResult, SocketGuessResult, GameConfig } from './types'

export function gameConfig(config: SocketGameConfig): GameConfig {
  const opponents = config.opponents.map(o => ({
    player: players.get(o.id),
    opponent: players.get(o.opponentId)
  }))

  const { preGameLength, gameLength } = config

  return { opponents, preGameLength, gameLength }
}

export function guessResult(guess: SocketGuessResult): GuessResult {
  return {
    id: guess.id,
    word: guess.word,
    common: guess.common,
    won: guess.won,
    from: players.get(guess.from),
    to: players.get(guess.to)
  }
}

export function history(guesses: SocketGuessResult[]): GuessResult[] {
  return guesses.map(guessResult)
}

export function gameRestore(restore: SocketUserRestore): GameRestore {
  return {
    history: history(restore.history ?? []),
    startedOn: restore.startedOn ? new Date(restore.startedOn) : undefined
  }
}

export function gameSummary(summary: SocketGameSummary): GameSummary {
  const playerSummaries = summary.playerSummaries.map(s => ({
    ...s, player: players.get(s.userId)
  }))

  return {
    gameLength: summary.gameLength,
    gameOverReason: summary.gameOverReason,
    playerSummaries
  }
}
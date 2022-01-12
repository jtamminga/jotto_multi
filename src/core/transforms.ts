import { players } from 'src/core/di'
import { GameSummary, GuessResult, SocketGameSummary, SocketGuessResult, GameConfig, SocketGameConfig } from './types'

export function gameConfig(config: SocketGameConfig): GameConfig {
  const opponents = config.opponents.map(o => ({
    player: players.get(o.id),
    opponent: players.get(o.opponentId)
  }))

  return { opponents }
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

export function gameSummary(summary: SocketGameSummary): GameSummary {
  const playerSummaries = summary.playerSummaries.map(s => ({
    ...s, player: players.get(s.userId)
  }))

  return { playerSummaries }
}
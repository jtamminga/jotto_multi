import { players } from 'src/core/di'
import {
  GameConfig as SocketGameConfig,
  UserRestore as SocketUserRestore
} from 'jotto_core'
import { GameRestore, GuessResult, SocketGuessResult, GameConfig } from './types'

export function gameConfig(config: SocketGameConfig): GameConfig {
  const opponents = config.opponents.map(o => ({
    player: players.get(o.id),
    opponent: players.get(o.opponentId)
  }))

  const { pickWordLength, preGameLength, gameLength } = config

  return { opponents, pickWordLength, preGameLength, gameLength }
}

export function guessResult(guess: SocketGuessResult): GuessResult {
  return {
    id: guess.id,
    word: guess.word,
    common: guess.common,
    won: guess.won,
    from: players.get(guess.from),
    to: players.get(guess.to),
    date: guess.date
  }
}

export function history(guesses: SocketGuessResult[]): GuessResult[] {
  return guesses.map(guessResult)
}

export function gameRestore(restore: SocketUserRestore): GameRestore {
  return {
    history: history(restore.history ?? []),
    pickingWordOn: restore.pickingWordOn ? new Date(restore.pickingWordOn) : undefined,
    startedOn: restore.startedOn ? new Date(restore.startedOn) : undefined
  }
}
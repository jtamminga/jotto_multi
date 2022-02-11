import { GuessResult } from './types'

export function resultStats(results: GuessResult[]): GuessResultStats {
  const inWord = new Set<string>()
  const notInWord = new Set<string>()

  for (const result of results) {
    if (result.common === 5) {
      result.word.split('').forEach(char => inWord.add(char))
    }

    else if (result.common === 0) {
      result.word.split('').forEach(char => notInWord.add(char))
    }
  }

  return {
    inWord: Array.from(inWord.values()),
    notInWord: Array.from(notInWord.values())
  }
}

export interface GuessResultStats {
  inWord: string[]
  notInWord: string[]
}
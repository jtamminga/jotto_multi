import { ReactNode } from 'react'
import { GuessResult } from 'src/core'

type Props = {
  result: GuessResult
}

export function GuessResultItem({ result }: Props) {
  let content: ReactNode

  // determine what to render

  if (result.won) {
    content = playerWon(result)
  }
  else {
    content = playerGuess(result)
  }

  // render
  return content
}


//
// helper renders
// ==============


function playerWon({ from, word }: GuessResult) {
  return (
    <>
      <b>{from.username}</b> won 🎉 guessing <b>{word}</b>
    </>
  )
}

function playerGuess({ from, word }: GuessResult) {
  return (
    <>
      <b>{from.username}</b> guessed <b>{word}</b>
    </>
  )
}
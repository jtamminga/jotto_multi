import { GuessResult } from 'src/core'

type Props = {
  result: GuessResult
}

export function GuessResultSummary({ result }: Props) {
  let content: JSX.Element

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
    <span>
      <b>{from.username}</b> won 🎉 guessing <b>{word}</b>
    </span>
  )
}

function playerGuess({ from, word, common }: GuessResult) {
  return (
    <span>
      <b>{from.username}</b> guessed <b>{word}</b> <span className="text-slate-400">{common} common</span> {common > 3 && '👀'}
    </span>
  )
}
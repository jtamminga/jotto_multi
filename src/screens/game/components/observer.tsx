import classNames from 'classnames'
import { ReactNode } from 'react'
import { GuessResult } from 'src/core'
import { useObserver } from 'src/core/hooks'

type Props = {
  className?: string
  onClick?: (word: string | undefined) => void
}

export function Observer({ className, onClick }: Props) {
  const { latestEvent } = useObserver()

  let content: ReactNode

  // determine what to render
  // ========================

  if (!latestEvent) {
    content = 'Nothing happened yet'
  }
  else if (latestEvent.guessResult.won) {
    content = playerWon(latestEvent.guessResult)
  }
  else {
    content = playerGuess(latestEvent.guessResult)
  }

  // event handler
  // =============

  function handleOnClick() {
    if (onClick) {
      onClick(latestEvent?.guessResult.word)
    }
  }

  // render
  // ======

  const classes = classNames(
    'bg-blue-100 h-12 px-6 rounded flex items-center gap-1 justify-center',
    { 'cursor-pointer hover:bg-blue-200': latestEvent !== undefined },
    className
  )

  // render
  return (
    <div className={classes} onClick={handleOnClick}>
      {content}
    </div>
  )
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
import { ReactNode } from 'react'
import { isGameEvent, isGuessResultEvent, isPlayerWonEvent } from 'src/core/events'
import { useObserver } from 'src/core/hooks'

export function Observer() {
  const { latestEvent } = useObserver()

  let content: ReactNode

  if (!latestEvent) {
    content = 'Nothing happened yet'
  }
  else if (isPlayerWonEvent(latestEvent)) {
    content =
      <>
        <b>{latestEvent.player.username}</b> won
      </>
  }
  else if (isGuessResultEvent(latestEvent)) {
    const guess = latestEvent.guessResult

    content =
      <>
        <b>{guess.from.username}</b> guessed <b>{guess.word}</b>
      </>
  }

  return (
    <div className="bg-blue-100 p-2 rounded mb-5">
      {content}
    </div>
  )
}
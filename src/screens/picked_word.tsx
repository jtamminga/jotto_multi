import { useEffect, useState } from 'react'
import { filter } from 'rxjs'
import { Players, Screen, Timer } from 'src/components'
import { useGameFlow, useTimer } from 'src/core/hooks'

export function PickedWord() {

  const { gameFlow } = useGameFlow()
  const [gameStarting, setGameStarting] = useState(false)
  const timer = useTimer()

  // title based on state
  const title = gameStarting ?
    'Starting game' : 'Waiting for other players'

  // time left
  const timeLeft = { seconds: gameFlow.game.config.preGameLength - timer.seconds}

  useEffect(() => {
    if (gameFlow.state === 'starting_game') {
      timer.start()
      setGameStarting(true)
    }
  }, [])
 
  useEffect(() => {
    const subscription = gameFlow.state$
      .pipe(filter(e => e.state === 'starting_game'))
      .subscribe(() => {
        timer.start()
        setGameStarting(true)
      })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <Screen title={title}>

      { gameStarting &&
        <div className="text-center mb-5">
          Starting in <Timer duration={timeLeft} />
        </div>
      }

      <Players show={timer.seconds >= 3 ? 'opponents' : 'readyState'} />

    </Screen>
  )
}
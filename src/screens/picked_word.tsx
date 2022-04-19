import { useEffect, useState } from 'react'
import { filter } from 'rxjs'
import { AutoTimer, Players, Screen, Timer } from 'src/components'
import { useGameFlow, useTimer } from 'src/core/hooks'

export function PickedWord() {

  const { gameFlow } = useGameFlow()
  const [gameStarting, setGameStarting] = useState(false)
  // const timer = useTimer()

  // title based on state
  const title = gameFlow.state === 'starting_game' ?
    'Starting game' : 'Waiting for other players'

  // time left
  // const timeLeft = { seconds: gameFlow.game.config.preGameLength - timer.seconds}

  // useEffect(() => {
  //   if (gameFlow.state === 'starting_game') {
  //     timer.start()
  //     setGameStarting(true)
  //   }
  // }, [])
 
  // useEffect(() => {
  //   const subscription = gameFlow.state$
  //     .pipe(filter(e => e.state === 'starting_game'))
  //     .subscribe(() => {
  //       timer.start()
  //       setGameStarting(true)
  //     })

  //   return () => subscription.unsubscribe()
  // }, [])

  return (
    <Screen title={title}>

      { gameFlow.state === 'picked_word' &&
        <div className="text-center mb-5">
          <AutoTimer dueAt={gameFlow.game.wordDueOn} />
        </div>
      }

      { gameFlow.state === 'starting_game' &&
        <div className="text-center mb-5">
          Starting in <AutoTimer dueAt={gameFlow.game.startedOn} />
        </div>
      }

      <Players show={gameFlow.state === 'starting_game' ? 'opponents' : 'readyState'} />

    </Screen>
  )
}
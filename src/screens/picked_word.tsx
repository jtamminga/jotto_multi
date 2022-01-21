import { useEffect, useState } from 'react'
import { Players, Screen } from 'src/components'
import { AppState } from 'src/core'
import { useGameFlow, useTimer } from 'src/core/hooks'

export function PickedWord() {

  const { gameFlow } = useGameFlow()
  const [isCounting, setIsCounting] = useState(false)
  const timer = useTimer()
 
  useEffect(() => {
    const subscription = gameFlow.state$
      .subscribe(e => {
        if (e.state === 'starting_game') {
          timer.start()
          setIsCounting(true)
        }
      })

    return () => subscription.unsubscribe()
  }, [])

  // title based on state
  const title = gameFlow.state === 'starting_game' ?
    'Starting game' : 'Waiting for other players'

  return (
    <Screen title={title}>

      { isCounting &&
        <span>Starting in {10 - timer.seconds}</span>
      }

      <Players show={timer.seconds >= 3 ? 'opponents' : 'readyState'} />

    </Screen>
  )
}
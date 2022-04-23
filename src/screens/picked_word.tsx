import { AutoTimer, Players, Screen } from 'src/components'
import { useGameFlow } from 'src/core/hooks'

export function PickedWord() {

  const { gameFlow } = useGameFlow()

  // title based on state
  const title = gameFlow.state === 'starting_game' ?
    'Starting game' : 'Waiting for other players'

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
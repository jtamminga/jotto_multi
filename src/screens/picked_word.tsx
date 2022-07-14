import { AutoTimer, Players, Screen } from 'src/components'
import { useAppFlow } from 'src/core/hooks'

export function PickedWord() {

  const { appFlow } = useAppFlow()

  // title based on state
  const title = appFlow.state === 'starting_game' ?
    'Starting game' : 'Waiting for other players'

  return (
    <Screen title={title}>

      { appFlow.state === 'picked_word' &&
        <div className="text-center mb-5">
          <AutoTimer dueAt={appFlow.game.wordDueOn} />
        </div>
      }

      { appFlow.state === 'starting_game' &&
        <div className="text-center mb-5">
          Starting in <AutoTimer dueAt={appFlow.game.startedOn} />
        </div>
      }

      <Players show={appFlow.state === 'starting_game' ? 'opponents' : 'readyState'} />

    </Screen>
  )
}
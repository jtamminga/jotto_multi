import { useQueryParams } from 'src/core/hooks'
import { gameFlow } from 'src/core/di'
import { Button, Players, Screen } from 'src/components'

type URLParams = { host: boolean }

export function InRoom() {

  const { host } = useQueryParams<URLParams>()

  return (
    <Screen title="Waiting for players">

      <Players className="mb-5" />

      { host &&
        <Button
          text="Start Game"
          className="w-full"
          onClick={() => gameFlow.start()}
        />
      }

    </Screen>
  )
}
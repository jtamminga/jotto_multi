import { gameFlow, connection } from 'src/core/di'
import { Button, Players, Screen } from 'src/components'
import { usePlayers } from 'src/core/hooks'

export function InRoom() {

  const { players } = usePlayers()

  return (
    <Screen title="Waiting for players">

      { players.ready && players.me.host &&
        <div className="text-center mb-5">
          Lobby code is <span className="text-emerald-500">{connection.lobbyCode}</span>
        </div>
      }

      <Players className="mb-5" />

      { players.ready && players.me.host &&
        <div className="flex gap-1">
          <Button
            text="Relaxed"
            className="grow"
            onClick={() => gameFlow.start({ gameLength: undefined })}
          />

          <Button
            text="10 min"
            className="grow"
            onClick={() => gameFlow.start({ gameLength: 10 })}
          />

          <Button
            text="15 min"
            className="grow"
            onClick={() => gameFlow.start({ gameLength: 15 })}
          />
        </div>
      }

    </Screen>
  )
}
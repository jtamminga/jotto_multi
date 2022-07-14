import { appFlow } from 'src/core/di'
import { Button, Clickable, Players, Screen } from 'src/components'
import { usePlayers } from 'src/core/hooks'
import { Em } from 'src/components/typography'
import { share } from 'src/core/share'

export function InRoom() {

  const { players } = usePlayers()
  const valid = players.playing.length >= 2

  return (
    <Screen title="Waiting for players">

      { players.ready &&
        <div className="flex justify-center mb-5">
          <Clickable onClick={() => share(players.me.lobbyCode)}>
            Lobby code is <Em>{players.me.lobbyCode}</Em>
          </Clickable>
        </div>
      }

      <Players className="mb-5" />

      { players.ready && players.me.host &&
        <div className="flex gap-1">
          <Button
            text="Relaxed"
            className="grow"
            disabled={!valid}
            onClick={() => appFlow.start({ gameLength: undefined })}
          />

          <Button
            text="5 min"
            className="grow"
            disabled={!valid}
            onClick={() => appFlow.start({ gameLength: 5 })}
          />

          <Button
            text="10 min"
            className="grow"
            disabled={!valid}
            onClick={() => appFlow.start({ gameLength: 10 })}
          />
        </div>
      }

    </Screen>
  )
}
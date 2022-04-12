import { Button, Screen } from 'src/components'
import { gameFlow } from 'src/core/di'

export function RoleSelect() {
  return (
    <Screen title="Join game or host" canLeave={false}>
      <div className="flex flex-col space-y-3">

        {/* join game */}
        <Button
          text="Join Game"
          onClick={() => gameFlow.joiningLobby()}
        />

        {/* host lobby */}
        <Button
          text="Host"
          type="link"
          onClick={() => gameFlow.hostLobby()}
        />

      </div>
    </Screen>
  )
}
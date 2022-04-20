import { Button, Screen } from 'src/components'
import { gameFlow } from 'src/core/di'

export function RoleSelect() {
  return (
    <Screen title="Join game or host" canLeave={false}>

      <div className="my-10 text-center">
        a simple <span className="text-emerald-500">five letter</span> word game that is played with a group
      </div>

      <div className="flex flex-col space-y-3 grow">

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

      <div className="mb-3 text-center text-slate-400">
        learn how to play
        <Button text="tutorial" className="block w-full" type="link" onClick={() => {}} />
      </div>
    </Screen>
  )
}
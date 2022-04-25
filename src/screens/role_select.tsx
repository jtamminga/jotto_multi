import { Button, EmptyScreen, ErrorToast, GameHeader } from 'src/components'
import { Em } from 'src/components/typography'
import { gameFlow } from 'src/core/di'
import { useErrors } from 'src/core/hooks'

export function RoleSelect() {

  const { latestError } = useErrors()

  return (
    <EmptyScreen>
      <div className="flex flex-col grow justify-center">

        {/* game header */}
        <GameHeader className="text-5xl" />

        {/* quick description */}
        <div className="my-10 text-center">
          a simple <Em>five letter</Em> word game that is played with a group
        </div>

        {/* call to action */}
        <div className="flex flex-col space-y-3 mb-5">

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

        { latestError &&
          <ErrorToast message={latestError.message} />
        }
      </div>
      
      {/* tutorial */}
      <div className="mb-3 text-center text-slate-400">
        learn how to play
        <Button
          text="start tutorial"
          className="block w-full"
          type="link"
          onClick={() => gameFlow.startTutorial()}
        />
      </div>

    </EmptyScreen>
  )
}
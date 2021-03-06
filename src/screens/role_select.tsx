import { Button, EmptyScreen, Errors, GameHeader } from 'src/components'
import { Em } from 'src/components/typography'
import { gameFlow } from 'src/core/di'

export function RoleSelect() {

  return (
    <EmptyScreen>
      <div className="flex flex-col grow justify-center">
        <div className="relative">

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

          {/* absolute so it doesn't re-adjust the centered div when error goes away */}
          <div className="absolute -bottom-5 w-full">
            <Errors />
          </div>
          
        </div>
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
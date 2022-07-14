import { Button, EmptyScreen, Errors, GameHeader } from 'src/components'
import { Em, Muted, Text } from 'src/components/typography'
import { appFlow } from 'src/core/di'

export function RoleSelect() {

  return (
    <EmptyScreen>
      <div className="flex flex-col grow justify-center">
        <div className="relative">

          {/* game header */}
          <GameHeader className="text-5xl" />

          {/* quick description */}
          <div className="my-10 text-center">
            <Text>a simple <Em>five letter</Em> word game that is played with a group</Text>
          </div>

          {/* call to action */}
          <div className="flex flex-col space-y-3 mb-5">

            {/* join game */}
            <Button
              text="Join Game"
              onClick={() => appFlow.joiningLobby()}
            />

            {/* host lobby */}
            <Button
              text="Host"
              type="link"
              onClick={() => appFlow.hostLobby()}
            />

          </div>

          {/* absolute so it doesn't re-adjust the centered div when error goes away */}
          <div className="absolute -bottom-5 w-full">
            <Errors />
          </div>
          
        </div>
      </div>
      
      {/* tutorial */}
      <div className="mb-3 text-center">
        <Muted>learn how to play</Muted>
        <Button
          text="start tutorial"
          className="block w-full"
          type="link"
          onClick={() => appFlow.startTutorial()}
        />
      </div>

    </EmptyScreen>
  )
}
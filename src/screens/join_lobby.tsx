import { useState } from 'react'
import { Button, Input, Screen } from 'src/components'
import { gameFlow } from 'src/core/di'
import { useErrors } from 'src/core/hooks'

export function JoinLobby() {
  
  const { latestError } = useErrors()
  const [code, setCode] = useState('')
  const isValid = code.length === 4

  return (
    <Screen title="Enter the lobby">

      <div className="text-center mb-5">
        Ask the host for the <span className="text-emerald-500">lobby code</span>
      </div>

      <Input
        autoFocus
        type="number"
        pattern="\d*"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Lobby code"
        className="mb-5 text-center"
      />

      <Button
        text="Join Lobby"
        className="w-full mb-5"
        disabled={!isValid}
        onClick={() => gameFlow.joinLobby(code)}
      />

      { latestError && 
        <div className="p-2 bg-red-400 text-white rounded text-center">
          {latestError.message}
        </div>
      }

    </Screen>
  )
}
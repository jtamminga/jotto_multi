import { useState } from 'react'
import { Button, Errors, Input, Screen } from 'src/components'
import { Em } from 'src/components/typography'
import { gameFlow } from 'src/core/di'
import { useLoading } from 'src/core/hooks'

export function JoinLobby() {
  
  const { loading } = useLoading()
  const [code, setCode] = useState('')
  const isValid = code.length === 4

  return (
    <Screen title="Enter the lobby">

      <div className="text-center mb-5">
        Ask the host for the <Em>lobby code</Em>
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
        loading={loading}
        onClick={() => gameFlow.joinLobby(code)}
      />

      <Errors />

    </Screen>
  )
}
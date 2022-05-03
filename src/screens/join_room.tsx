import { useState } from 'react'
import { Button, Input, Screen } from 'src/components'
import { gameFlow } from 'src/core/di'

export function JoinRoom() {
  
  const maxLength = 8
  const [username, setUsername] = useState('')
  const isValid = username.length > 0 && username.length <= maxLength

  return (
    <Screen title="Join the game">

      <div className="flex justify-end mb-1">
        <span className="text-slate-400">{username.length}/{maxLength}</span>
      </div>

      <Input
        autoFocus
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Your name"
        className="mb-5"
      />

      <div className="flex flex-col space-y-3">
        <Button
          text="Join Game"
          disabled={!isValid}
          onClick={() => gameFlow.joinRoom(username, 'player')}
        />

        <Button
          text="Join as Observer"
          disabled={!isValid}
          type="link"
          onClick={() => gameFlow.joinRoom(username, 'observer')}
        />
      </div>
      
    </Screen>
  )
}
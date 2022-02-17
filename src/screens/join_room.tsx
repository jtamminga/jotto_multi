import { useState } from 'react'
import { Button, Input, Screen } from 'src/components'
import { gameFlow } from 'src/core/di'

export function JoinRoom() {
  
  const [username, setUsername] = useState('')
  const isValid = username.length > 0 && username.length <= 8

  return (
    <Screen title="Join the game">

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
          type="link"
          text="Join as Observer"
          disabled={!isValid}
          onClick={() => gameFlow.joinRoom(username, 'observer')}
        />
      </div>
      
    </Screen>
  )
}
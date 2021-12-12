import { useState } from 'react'
import { gameFlow } from 'src/core/di'

export function JoinRoom() {
  const [username, setUsername] = useState('')

  return (
    <div>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <button
        type="button"
        onClick={() => gameFlow.joinRoom(username)}
      >Submit</button>
    </div>
  )
}
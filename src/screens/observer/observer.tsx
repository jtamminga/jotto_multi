import { useState } from 'react'
import { observer } from 'src/core/di'

export function Observer() {
  const [username, setUsername] = useState('')

  return (
    <div>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <button
        type="button"
        onClick={() => observer.join(username)}
      >Submit</button>
    </div>
  )
}
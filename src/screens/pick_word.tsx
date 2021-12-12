import { useState } from 'react'
import { gameFlow } from 'src/core/di'

export function PickWord() {
  const [word, setWord] = useState('')

  return (
    <div>
      <input
        value={word}
        onChange={e => setWord(e.target.value)}
      />

      <button
        type="button"
        onClick={() => gameFlow.pickWord(word)}
      >Submit</button>
    </div>
  )
}
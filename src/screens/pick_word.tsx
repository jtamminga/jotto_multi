import { useState } from 'react'
import { Button, Screen, FiveWordInput, AutoTimer } from 'src/components'
import { Em } from 'src/components/typography'
import { gameFlow } from 'src/core/di'

export function PickWord() {
  
  const [word, setWord] = useState<string>()

  return (
    <Screen title="Pick a word">

      <div className="text-center mb-5">
        <AutoTimer dueAt={gameFlow.game.wordDueOn} />
      </div>

      <div className="text-center mb-5">
        Pick a <Em>5 letter</Em> word with <Em>no duplicate</Em> letters
      </div>

      <div className="flex justify-center mb-5">
        <FiveWordInput
          onChange={e => setWord(e.word)}
        />
      </div>

      <Button
        text="Submit"
        className="w-full mb-5"
        disabled={word === undefined}
        onClick={() => gameFlow.pickWord(word!)}
      ></Button>

      <div className="text-center mb-5">
        playing a {gameLength()} game
      </div>
      
    </Screen>
  )
}

// game length
function gameLength() {
  const { gameLength } = gameFlow.game
  const content = gameLength ? `${gameLength} min` : 'relaxed'
  return <span className="bg-slate-100 px-2 py-1 rounded">{content}</span>
}
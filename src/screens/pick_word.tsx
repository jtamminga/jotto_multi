import { useState } from 'react'
import { Button, Screen, FiveWordInput, AutoTimer } from 'src/components'
import { gameFlow } from 'src/core/di'

export function PickWord() {
  
  const [word, setWord] = useState<string>()

  return (
    <Screen title="Pick a word">

      <div className="text-center mb-5">
        <AutoTimer length={gameFlow.game.config.pickWordLength} />
      </div>

      <div className="text-center mb-5">
        Pick a <span className="text-emerald-500">5 letter</span> word with <span className="text-emerald-500">no duplicate</span> letters
      </div>

      <div className="flex justify-center mb-5">
        <FiveWordInput
          onChange={e => setWord(e.word)}
        />
      </div>

      <Button
        text="Submit"
        className="w-full"
        disabled={word === undefined}
        onClick={() => gameFlow.pickWord(word!)}
      ></Button>
      
    </Screen>
  )
}
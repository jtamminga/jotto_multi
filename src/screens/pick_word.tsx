import { useState } from 'react'
import { Button, Screen, FiveWordInput } from 'src/components'
import { PinInput } from 'src/components/pin_input'
import { gameFlow } from 'src/core/di'

export function PickWord() {
  
  const [word, setWord] = useState<string>()

  return (
    <Screen title="Pick a word">

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
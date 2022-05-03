import { Keyboard } from 'src/components'
import * as Text from 'src/components/typography'

export function StepFive() {

  return (
    <div>
      <p className="mb-5">
        Something that will make your life a lot easier is being able to take note of which letters are in or not in your opponent's word <Text.Em>using the keyboard</Text.Em>. Notice that the keyboard auto updated because of a 0 guess.
      </p>

      <p className="mb-5">
        To mark your own letter, just <Text.Em>hold a key</Text.Em> and select whether you think it is in the word or not.
      </p>

      <div className="text-center mb-3 text-sm text-slate-400">Try holding a letter!</div>

      <Keyboard />
    </div>
  )
}
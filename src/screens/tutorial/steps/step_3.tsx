import * as Text from 'src/components/typography'
import { Word } from './word'

export function StepThree() {
  return (
    <div>
      <p className="mb-5">
        Deducing your opponent's word is done by submitting a <Text.Em>series of words</Text.Em>.
      </p>

      <p className="mb-5">
        For each word you submit you get the number of letters in common with your opponent's word.
      </p>

      <div className="flex justify-center mb-5">
        <div>
          <div className="mb-3">
            <div className="mb-1">Opponents secret word</div>
            <Word word="cabin" highlight="a" />
          </div>

          <div className="mb-3">
            <div className="mb-1">Your word guessed</div>
            <Word word="stack" highlight="a" />
          </div>
        </div>
      </div>

      <p>
        Since <Text.Em>A</Text.Em> is the only letter in common <Text.Em>1</Text.Em> would be returned to you.
      </p>
    </div>
  )
}
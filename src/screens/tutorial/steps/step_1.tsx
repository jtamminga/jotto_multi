import * as Text from 'src/components/typography'

export function StepOne() {
  return (
    <div>
      <p className="mb-5">
        Jotto is a five letter word <Text.Em>deduction game</Text.Em> played with two or more players.
      </p>

      <p>
        Everyone in the game picks a secret <Text.Em>five letter word</Text.Em> with <Text.Em>no duplicate letters</Text.Em>.
      </p>
    </div>
  )
}
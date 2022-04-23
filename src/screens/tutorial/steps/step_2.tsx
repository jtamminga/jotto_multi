import * as Text from 'src/components/typography'

export function StepTwo() {
  return (
    <div>
      <p className="mb-5">
        Each player is assigned a random opponent.
      </p>


      <p className="mb-5">
        The objective of the game is to guess the your opponent's secret word in the <Text.Em>fewest guesses</Text.Em> possible.
      </p>

      <p>
        The player with the <Text.Em>least</Text.Em> amount of guesses wins!
      </p>
    </div>
  )
}
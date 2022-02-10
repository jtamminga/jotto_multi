import { GameTime, GuessResultSummary, Screen } from 'src/components'
import { useObserver } from 'src/core/hooks'
import { gameFlow } from 'src/core/di'
import { GuessResult } from 'src/core'

export function Observing() {
  useObserver()

  const { game } = gameFlow
  const guesses = [...game.guesses].reverse()

  return (
    <Screen title="Game">
      
      <div className="mb-5 flex justify-center">
        <GameTime game={game} style="large" />
      </div>

      <div>
        {guessResults(guesses)}
      </div>
    </Screen>
  )
}


//
// helpers
// =======


function guessResults(guesses: ReadonlyArray<GuessResult>) {
  return (
    <ol className="list-decimal text-slate-300 pl-6" reversed>
      { guesses.map(guess =>
        <li key={guess.id} className="pl-3 mb-2">
          {guessResultItem(guess)}
        </li>
      )}
    </ol>
  )
}

function guessResultItem(result: GuessResult) {
  return (
    <div className="bg-slate-100 p-2 px-3 rounded text-slate-800">
      <GuessResultSummary result={result} />
    </div>
  )
}
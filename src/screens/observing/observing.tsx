import { GameTime, GuessResultSummary, Players, Screen, SubHeader } from 'src/components'
import { useObserver } from 'src/core/hooks'
import { gameFlow } from 'src/core/di'
import { GuessResult } from 'src/core'

export function Observing() {
  useObserver()

  const { game } = gameFlow
  const guesses = [...game.guesses].reverse()

  return (
    <Screen title="Game">
      
      <div className="mb-8 flex justify-center">
        <GameTime game={game} style="large" />
      </div>

      <div className="sm:flex">
        {/* players */}
        <div className="mb-8 sm:w-64">
          <Players show="stats" />
        </div>

        {/* events */}
        <div className="sm:grow">
          <SubHeader className="mb-3">
            Events
          </SubHeader>

          {guessResults(guesses)}
        </div>
      </div>
    </Screen>
  )
}


//
// helpers
// =======


function guessResults(guesses: ReadonlyArray<GuessResult>) {
  if (guesses.length === 0) {
    return (
      <div className="p-5 bg-slate-100 rounded text-center text-slate-400">
        Nothing has happened yet
      </div>
    )
  }

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
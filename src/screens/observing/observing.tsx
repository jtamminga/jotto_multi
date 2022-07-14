import { GameTime, GuessResultSummary, PlayersStats, Screen, SubHeader, Timer } from 'src/components'
import { useObserver } from 'src/core/hooks'
import { appFlow } from 'src/core/di'
import { GuessResult } from 'src/core'
import { intervalToDuration } from 'date-fns'

export function Observing() {
  useObserver()

  const { game } = appFlow
  const guesses = [...game.guesses].reverse()

  return (
    <Screen title="Game">
      
      <div className="mb-8 flex justify-center">
        <GameTime game={game} style="large" />
      </div>

      <div className="sm:flex">
        {/* players */}
        <div className="mb-8 sm:w-80 sm:mt-[5px]">
          <PlayersStats />
        </div>

        {/* events */}
        <div className="sm:grow sm:ml-5">
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
    <ol>
      { guesses.map(guess =>
        <li key={guess.id} className="mb-2">
          {guessResultItem(guess)}
        </li>
      )}
    </ol>
  )
}

function guessResultItem(result: GuessResult) {
  const relative = intervalToDuration({ start: appFlow.game.startedOn, end: result.date })

  return (
    <div className="bg-slate-100 p-2 px-3 rounded text-slate-800 flex">
      <Timer className="w-12 text-slate-400" duration={relative} />
      <GuessResultSummary result={result} />
    </div>
  )
}
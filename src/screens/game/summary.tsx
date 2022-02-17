import classNames from 'classnames'
import { Button, Screen, Timer } from 'src/components'
import { PlayerSummary } from 'src/core'
import { gameFlow, players } from 'src/core/di'

export function GameSummary() {
  const { game } = gameFlow
  const { summary, finalTime } = game

  return (
    <Screen title="Game over">

      {/* player summarys */}
      <div className="flex justify-center mb-5">
        <ol className="list-decimal">

          {/* header */}
          {playerSummaryHeader}

          {/* player rows */}
          {summary.playerSummaries.map((summary, i) =>
            <li key={i} className="pl-3 mb-2">
              {playerSummaryItem(summary)}
            </li>
          )}

        </ol>
      </div>

      <div className="mb-8 text-center">
        Game time <Timer duration={finalTime} />
      </div>

      {/* actions */}
      <div className="flex flex-col space-y-3">
        { players.me.isPlaying &&
          <Button
            text="Play again"
            onClick={() => gameFlow.backToRoom()}
          />
        }

        <Button
          text="Finished"
          type="secondary"
          onClick={() => gameFlow.leave()}
        />
      </div>
    </Screen>
  )
}


//
// player summary
// ==============


function playerSummaryItem(summary: PlayerSummary) {
  const classes = classNames(
    'flex rounded',
    { 'bg-yellow-100 px-3 py-4': summary.place === 1 },
    { 'bg-slate-100 p-2 px-3': summary.place > 1 }
  )

  return (
    <div className={classes}>
      <div className="w-24 text-center">{summary.player.username}</div>
      <div className="w-16 text-center">{bestGuess(summary)}</div>
      <div className="w-16 text-center">{summary.word}</div>
      <div className="w-16 text-center">{summary.numGuesses}</div>
    </div>
  )
}

const playerSummaryHeader =
  (
    <div className="flex text-slate-400 text-sm ml-3 mb-3 px-3">
      <div className="w-24 flex justify-center items-end text-center">Player</div>
      <div className="w-16 flex justify-center items-end text-center">Best</div>
      <div className="w-16 flex justify-center items-end text-center">Word</div>
      <div className="w-16 flex justify-center items-end text-center">Guesses</div>
    </div>
  )

const bestGuess = (summary: PlayerSummary) =>
  summary.wonAt === undefined ? summary.bestGuess : '⭐'

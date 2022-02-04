import classNames from 'classnames'
import { Button, Screen } from 'src/components'
import { PlayerSummary } from 'src/core'
import { gameFlow } from 'src/core/di'

export function GameSummary() {
  const summary = gameFlow.game.summary

  return (
    <Screen title="Game over">

      {/* player summarys */}
      <div className="flex justify-center mb-5">
        <ol className="list-decimal">
          <PlayerSummaryHeader />
          {summary.playerSummaries.map((summary, i) =>
            <PlayerSummaryItem key={i} summary={summary} />
          )}
        </ol>
      </div>

      {/* actions */}
      <div className="flex flex-col space-y-3">
        <Button
          text="Play again"
          onClick={() => gameFlow.backToRoom()}
        />

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


type PlayerSummaryProps = {
  summary: PlayerSummary
}

function PlayerSummaryItem({ summary }: PlayerSummaryProps) {
  const classes = classNames(
    'flex rounded mb-2 ml-3',
    { 'bg-yellow-100 px-3 py-4': summary.place === 1 },
    { 'bg-slate-100 p-2 px-3': summary.place > 1 }
  )

  return (
    <li>
      <div className={classes}>
        <div className="w-32 text-center">{summary.player.username}</div>
        <div className="w-16 text-center">{summary.word}</div>
        <div className="w-32 text-center">{summary.numGuesses}</div>
      </div>
    </li>
  )
}

function PlayerSummaryHeader() {
  return (
    <div className="flex p-2 text-slate-400 ml-3">
      <div className="w-32 text-center">Player</div>
      <div className="w-16 text-center">Word</div>
      <div className="w-32 text-center"># Guesses</div>
    </div>
  )
}
import { Button, Screen } from 'src/components'
import { PlayerSummary } from 'src/core'
import { gameFlow } from 'src/core/di'

export function GameSummary() {
  const summary = gameFlow.game.summary

  return (
    <Screen title="Game over">

      {/* player summarys */}
      <div className="flex justify-center mb-5">
        <ol className="list-decimal pl-3">
          {summary.playerSummaries.map((summary, i) =>
            <PlayerSummaryItem key={i} summary={summary} />
          )}
        </ol>
      </div>

      {/* actions */}
      <div className="flex justify-center space-x-2">
        <Button
          text="Play again"
          onClick={() => gameFlow.backToRoom()}
        />

        <Button
          text="Finished"
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
  return (
    <li>
      <b>{summary.player.username}</b> ({summary.numGuesses} guesses)
    </li>
  )
}
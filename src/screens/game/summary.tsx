import { gameFlow } from 'src/core/di'

export function GameSummary() {

  const summary = gameFlow.game.summary

  return (
    <div>
      <h1>Game over!</h1>
      <ol>
        {summary.playerSummaries.map((summary, i) =>
          <li key={`summary-${i}`}>
            <b>{summary.player.username}</b> ({summary.numGuesses} guesses)
          </li>  
        )}
      </ol>

      <button
        type="button"
        onClick={() => gameFlow.backToRoom()}
      >Done</button>
    </div>
  )
}
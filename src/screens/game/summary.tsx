import classNames from 'classnames'
import { Button, PlayerContainer, PlayersHeader, Screen, Timer } from 'src/components'
import { PlayerSummary } from 'src/core'
import { gameFlow, players } from 'src/core/di'
import { usePlayers } from 'src/core/hooks'

export function GameSummary() {
  usePlayers()
  const { game } = gameFlow
  const { summary, finalTime } = game

  return (
    <Screen title="Game over">

      {/* player summarys */}
      <div className="flex justify-center mb-5">
        <ol>

          {/* header */}
          <PlayersHeader className="mb-3">
            {headerColumns}
          </PlayersHeader>

          {/* player rows */}
          {summary.playerSummaries.map((summary, i) =>
            <li key={i} className="mb-2">
              <PlayerContainer
                isMe={players.isMe(summary.player)}
                style={summary.place === 1 ? 'grand' : 'primary'}
                num={i+1}
              >
                {playerSummary(summary)}
              </PlayerContainer>
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


function playerSummary(summary: PlayerSummary) {
  return (
    <>
      <div className="w-24 text-center">{name(summary)}</div>
      <div className="w-16 text-center">{summary.wonAt ? '⭐' : summary.bestGuess}</div>
      <div className="w-16 text-center">{summary.word}</div>
      <div className="w-16 text-center">{summary.numGuesses}</div>
    </>
  )
}

function name({ player }: PlayerSummary) {
  const style = classNames({
    'bg-emerald-400 px-2 py-1 rounded text-white': player.playingAgain,
    'bg-red-400 px-2 py-1 rounded text-white': player.leftLobby
  })

  return <span className={style}>{player.username}</span>
}

const headerColumns =
  (
    <>
      <div className="w-24 flex justify-center items-end text-center">Player</div>
      <div className="w-16 flex justify-center items-end text-center">Best</div>
      <div className="w-16 flex justify-center items-end text-center">Word</div>
      <div className="w-16 flex justify-center items-end text-center">Guesses</div>
    </>
  )

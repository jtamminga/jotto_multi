import { comparePlayers } from 'jotto_core'
import { useGuessResult, usePlayers } from 'src/core/hooks'
import { Player } from 'src/models'
import { PlayerContainer } from './player_container'

export function PlayersStats() {

  const { players } = usePlayers()
  useGuessResult()

  const sortedPlayers = players.playing
    .slice()
    .sort((a, b) =>
      comparePlayers(a.perf, b.perf)
    )

  return (
    <div>
      <ol className="list-decimal pl-2">

        {/* header */}
        {header}

        {/* players */}
        {sortedPlayers.map(player =>
          <li key={player.userId} className="pl-1 mb-2">
            <PlayerContainer isMe={players.isMe(player)}>
              {renderPlayerStats(player)}
            </PlayerContainer>
          </li>
        )}
      </ol>
    </div>
  )
}

function renderPlayerStats(player: Player) {
  return (
    <>
      <div className="grow text-center">
        {player.username}
      </div>
      <div className="w-20 text-center">
        {player.won ? '⭐' : player.bestGuess}
      </div>
      <div className="w-20 text-center">
        {player.guessResults.length}
      </div>
    </>
  )
}

const header =
  (
    <div className="flex text-slate-400 text-sm px-3 mb-2">
      <div className="grow text-center">
        Player
      </div>
      <div className="w-20 text-center">
        Best
      </div>
      <div className="w-20 text-center">
        Guesses
      </div>
    </div>
  )
import { comparePlayers } from 'jotto_core'
import { useGuessResult, usePlayers } from 'src/core/hooks'
import { Player } from 'src/models'
import { PlayersHeader } from './players_header'
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
      <ol>

        {/* header */}
        <PlayersHeader className="mb-3">
          {headerColumns}
        </PlayersHeader>

        {/* players */}
        {sortedPlayers.map((player, i) =>
          <li key={player.userId} className="mb-2">
            <PlayerContainer isMe={players.isMe(player)} num={i+1}>
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

const headerColumns =
  (
    <>
      <div className="grow text-center">
        Player
      </div>
      <div className="w-20 text-center">
        Best
      </div>
      <div className="w-20 text-center">
        Guesses
      </div>
    </>
  )
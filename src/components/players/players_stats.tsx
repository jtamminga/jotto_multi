import { comparePlayers } from 'jotto_core'
import { useState } from 'react'
import { useGuessResult, usePlayers } from 'src/core/hooks'
import { Player } from 'src/models'
import { PlayersHeader } from './players_header'
import { PlayerContainer } from './player_container'

export function PlayersStats() {

  const [showOpponents, setShowOpponents] = useState(false)
  const { players } = usePlayers()
  useGuessResult()

  const sortedPlayers = players.playing
    .slice()
    .sort((a, b) =>
      comparePlayers(a.perf, b.perf)
    )

  return (
    <div
      onTouchStart={() => setShowOpponents(true)}
      onTouchEnd={() => setShowOpponents(false)}
    >
      <ol>
        {/* header */}
        <PlayersHeader className="mb-3">
          {renderHeaders(showOpponents)}
        </PlayersHeader>

        {/* players */}
        {sortedPlayers.map((player, i) =>
          <li key={player.userId} className="mb-2">
            <PlayerContainer isMe={players.isMe(player)} num={i+1}>
              {renderPlayerStats(player, showOpponents)}
            </PlayerContainer>
          </li>
        )}
      </ol>

      <div className="my-5 text-center">
        <span className="text-emerald-500">{players.me.opponent.username}</span> is your opponent
      </div>
    </div>
  )
}

function renderPlayerStats(player: Player, showOpponent: boolean) {
  return (
    <>
      <div className="grow text-center">
        {player.username}
      </div>
      <div className="w-20 text-center">
        {showOpponent ? player.opponent.username : player.word}
      </div>
      <div className="w-16 text-center">
        {player.won ? '⭐' : player.bestGuess}
      </div>
      <div className="w-16 text-center">
        {player.guessResults.length}
      </div>
    </>
  )
}

function renderHeaders(showOpponent: boolean) {
  return (
    <>
      <div className="grow text-center">
        Player
      </div>
      <div className="w-20 text-center">
        {showOpponent ? 'Opponent' : 'Word'}
      </div>
      <div className="w-16 text-center">
        Best
      </div>
      <div className="w-16 text-center">
        Guesses
      </div>
    </>
  )
}
import classNames from 'classnames'
import { ReactNode } from 'react'
import { usePlayers } from 'src/core/hooks'
import { Player } from 'src/models'
import { PlayerContainer } from './player_container'
import { Observers } from './observers'

export type PlayersShowMode = 'readyState' | 'opponents' | undefined

type Props = {
  show?: PlayersShowMode
  className?: string
}

export function Players({ show, className }: Props) {
  const { players } = usePlayers()

  if (!players.ready) {
    console.warn('players not ready yet')
    return null
  }

  if (players.all.length === 0) {
    console.warn('players empty')
  }

  // render
  return (
    <div className={className}>
      <ul>
        { players.playing.map(player =>
          <li key={player.username} className="mb-2">
            <PlayerContainer isMe={players.isMe(player)}>
              {playerContent(player, show)}
            </PlayerContainer>
          </li>
        )}
      </ul>
      { players.observing.length > 0 &&
        <Observers observers={players.observing} me={players.me} />
      }
    </div>
  )

}

function playerContent(player: Player, show: PlayersShowMode | undefined) {

  let content: ReactNode
  switch(show) {

    case 'readyState':
      content = renderPlayerWithStatus(player)
      break

    case 'opponents':
      content = renderPlayerWithOpponent(player)
      break
      
    default:
      content = renderPlayer(player)
      break
  }

  return content
}


//
// different show renders
// ======================


function renderPlayer(player: Player) {
  return (
    <span>{player.username}</span>
  )
}

function renderPlayerWithStatus(player: Player) {
  return (
    <>
      {renderStatus(player.ready)}
      {renderPlayer(player)}
    </>
  )
}

function renderPlayerWithOpponent(player: Player) {
  return (
    <div className="grow text-center">
      {renderPlayer(player)}
      <span className="text-gray-400 inline-block px-1">against</span>
      {renderPlayer(player.opponent)}
    </div>
  )
}


//
// helper render functions
// =======================


function renderStatus(status: boolean) {
  const classes = classNames(
    'w-16 rounded mr-2 text-center text-sm text-white',
    status ?
      'bg-emerald-400' :
      'bg-red-400'
  )

  return <span className={classes}>{status ? 'Ready' : 'Picking'}</span>
}
import classNames from 'classnames'
import { ReactNode } from 'react'
import { usePlayers } from 'src/core/hooks'
import { Player } from 'src/models'

type Mode = 'readyState' | 'opponents' | undefined
type Props = { show?: Mode }
type PlayerProps = Props & { player: Player }

export function Players(props: Props) {

  const { players } = usePlayers()

  return (
    <div className="mb-5">
      <ul>
        {players.connected.map(player =>
          <PlayerItem key={player.userId} {...props} player={player} />
        )}
      </ul>
    </div>
  )

}

function PlayerItem({ player, show }: PlayerProps) {

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

  return (
    <li className="flex items-center bg-slate-100 p-2 rounded mb-2">
      {content}
    </li>
  )
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
    <>
      {renderPlayer(player)}
      <span className="text-gray-500 inline-block px-1">against</span>
      {renderPlayer(player.opponent)}
    </>
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
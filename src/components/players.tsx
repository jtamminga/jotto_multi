import classNames from 'classnames'
import { ReactNode } from 'react'
import { usePlayers } from 'src/core/hooks'
import { Player } from 'src/models'

type Mode = 'readyState' | 'opponents' | undefined
type Props = { show?: Mode }
type PlayerProp = { player: Player, isMe: boolean }
type PlayerItemProps = Props & PlayerProp

export function Players(props: Props) {

  const { players } = usePlayers()

  if (!players.ready) {
    return null
  }

  return (
    <div className="mb-5">
      <ul>
        {players.playing.map(player =>
          <PlayerItem
            key={player.userId}
            {...props}
            player={player}
            isMe={player === players.me}
          />
        )}
      </ul>
      { players.observing.length > 0 &&
        <>
          <h4 className="font-medium mb-2">Observers</h4>
          <ul>
            {players.observing.map(player =>
              <ObserverItem
                key={player.userId}
                player={player}
                isMe={player === players.me}
              />  
            )}
          </ul>
        </>
      }
    </div>
  )

}

function PlayerItem({ player, isMe, show }: PlayerItemProps) {

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

  const classes = classNames(
    'flex items-center bg-slate-100 p-2 px-3 rounded mb-2',
    { 'border-2 border-slate-300': isMe }
  )

  return (
    <li className={classes}>
      {content}
    </li>
  )
}

function ObserverItem({ player, isMe }: PlayerProp) {
  const classes = classNames(
    'flex items-center bg-orange-100 p-2 px-3 rounded mb-2',
    { 'border-2 border-orange-300': isMe }
  )

  return (
    <li className={classes}>
      {renderPlayer(player)}
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
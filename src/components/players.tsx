import classNames from 'classnames'
import { comparePlayers } from 'jotto_core'
import { ReactNode } from 'react'
import { usePlayers } from 'src/core/hooks'
import { Player } from 'src/models'
import { SubHeader } from './header'

export type PlayersShowMode = 'readyState' | 'opponents' | 'stats' | undefined
type Props = { show?: PlayersShowMode }
type PlayerProp = { player: Player, isMe: boolean }
type PlayerItemProps = Props & PlayerProp

export function Players(props: Props) {

  const { players } = usePlayers()

  if (!players.ready) {
    console.warn('players not ready yet')
    return null
  }

  let playing = players.playing
  // sort players only if in stats mode
  if (props.show === 'stats') {
    playing = [...players.playing].sort((a, b) =>
      comparePlayers(a.perf, b.perf))
  }

  // render
  return (
    <div className="mb-5">
      <ul>
        { props.show === 'stats' &&
          statsHeader
        }

        { playing.map(player =>
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
          <SubHeader className="mb-2">Observers</SubHeader>
          <ul>
            { players.observing.map(player =>
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

    case 'stats':
      content = renderPlayerStats(player)
      break
      
    default:
      content = renderPlayer(player)
      break
  }

  const classes = classNames(
    'flex items-center bg-slate-100 p-2 px-3 rounded mb-2',
    { 'outline outline-offset-2 outline-2 outline-slate-200': isMe }
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
    { 'outline outline-offset-2 outline-2 outline-orange-300': isMe }
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
    <div className="grow text-center">
      {renderPlayer(player)}
      <span className="text-gray-400 inline-block px-1">against</span>
      {renderPlayer(player.opponent)}
    </div>
  )
}

function renderPlayerStats(player: Player) {
  return (
    <>
      <div className="grow text-center">
        {renderPlayer(player)}
      </div>
      <div className="w-20 text-center">
        {bestGuess(player)}
      </div>
      <div className="w-20 text-center">
        {player.guessResults.length}
      </div>
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

function bestGuess(player: Player) {
  return player.won ? '⭐' : player.bestGuess
}

const statsHeader =
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
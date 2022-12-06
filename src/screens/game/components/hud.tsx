import classNames from 'classnames'
import { players, gameFlow, menu } from 'src/core/di'
import { GameTime } from 'src/components'
import { Me } from 'src/models'

type Props = {
  className?: string
}

export function Hud({ className }: Props) {

  const { me } = players
  const { game } = gameFlow

  const classes = classNames(
    'flex justify-between',
    className
  )

  return (
    <div className={classes} onClick={() => menu.show()}>

      {/* users rank */}
      <div>
        {renderRank(me)}
      </div>

      {/* opponent */}
      <div>
        <span className="text-slate-400">against</span> {me.opponent.username}
      </div>

      {/* game time */}
      <GameTime game={game} style="inline" />
    </div>
  )
}

function renderRank(me: Me) {
  const classes = classNames(
    'w-16 text-center rounded transition-colors',
    { 'bg-yellow-100 ring-2 ring-yellow-200': me.firstRank }
  )

  return (
    <div className={classes}>
      <span className="text-slate-400">rank</span> {me.rank}
    </div>
  )
}
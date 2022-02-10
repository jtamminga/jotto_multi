import classNames from 'classnames'
import { players, gameFlow } from 'src/core/di'
import { GameTime } from 'src/components'

type Props = {
  className?: string
}

export function Hud({ className }: Props) {

  const { me } = players
  const { game } = gameFlow

  const classes = classNames(
    'flex bg-slate-100 rounded p-2',
    className
  )

  return (
    <div className={classes}>
      <div className="flex justify-around grow">

        {/* users word */}
        <div>
          <span className="text-slate-400">word:</span> {me.word}
        </div>

        {/* opponent */}
        <div>
          <span className="text-slate-400">against:</span> {me.opponent.username}
        </div>
      </div>

      {/* game time */}
      <GameTime game={game} style="inline" />
    </div>
  )
}
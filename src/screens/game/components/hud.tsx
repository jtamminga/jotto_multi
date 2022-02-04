import classNames from 'classnames'
import { Game, Me } from 'src/models'
import { players, gameFlow } from 'src/core/di'
import { useTimer } from 'src/core/hooks'
import { Timer } from 'src/components'

type Props = {
  className?: string
}

export function Hud({ className }: Props) {

  const { me } = players
  const { game } = gameFlow

  const classes = classNames(
    'flex bg-slate-100 rounded p-2 justify-around',
    className
  )

  return (
    <div className={classes}>

      {/* username */}
      <div>
        <span className="text-slate-400">name:</span> {me.username}
      </div>

      {/* users word */}
      <div>
        <span className="text-slate-400">word:</span> {me.word}
      </div>

      {/* opponent */}
      <div>
        <span className="text-slate-400">against:</span> {me.opponent.username}
      </div>

      { game.hasTimeLimit &&
        <GameCountdown game={game} />
      }

    </div>
  )
}


//
// countdown
// =========


function GameCountdown({ game }: { game: Game }) {
  useTimer(true)

  return (
    <Timer duration={game.timeLeft} className="w-16" />
  )
}
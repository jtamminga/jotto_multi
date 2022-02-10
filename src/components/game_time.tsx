import classNames from 'classnames'
import { milliseconds } from 'date-fns'
import { useTimer } from 'src/core/hooks'
import { Game } from 'src/models'
import { Timer } from './timer'

type Style = 'inline' | 'large'

type Props = {
  game: Game,
  style: Style
}

export function GameTime({ game, style }: Props) {
  useTimer(true)

  const duration = game.hasTimeLimit ?
    game.timeLeft : game.timeElasped

  const classes = gameTimeStyle(game, style)

  return (
    <Timer duration={duration} className={classes} />
  )
}


function gameTimeStyle(game: Game, style: Style) {
  const almostOver =
    game.hasTimeLimit && milliseconds(game.timeLeft) < 30_000

  return classNames(
    'rounded text-center',
    {
      'w-16': style === 'inline',
      'text-xl p-3 bg-slate-100 w-24': style === 'large',
      'bg-red-100 text-red-800': almostOver
    }
  )
}
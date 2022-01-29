import classNames from "classnames"
import { Me } from "src/models"

type Props = {
  me: Me,
  className?: string
}

export function Hud({ me, className }: Props) {

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
    </div>
  )
}
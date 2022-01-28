import { Me } from "src/models"

type Props = {
  me: Me
}

export function Hud({ me }: Props) {
  return (
    <div className="flex mb-2 bg-slate-100 rounded p-2 mt-2 justify-around">

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
import { useQueryParams } from 'src/core/hooks'
import { gameFlow } from 'src/core/di'

export function InRoom() {

  const { host } = useQueryParams()

  return (
    <div>
      <button
        type="button"
        onClick={() => {}}
      >Start</button>
    </div>
  )
}
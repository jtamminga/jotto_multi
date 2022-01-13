import { useQueryParams } from 'src/core/hooks'
import { gameFlow } from 'src/core/di'
import { PlayerStatus } from 'src/components'

type URLParams = { host: boolean }

export function InRoom() {

  const { host } = useQueryParams<URLParams>()

  return (
    <div>
      <PlayerStatus />

      { host && 
        <button
          type="button"
          onClick={() => gameFlow.start()}
        >Start</button>
      }
    </div>
  )
}
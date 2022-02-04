import { Screen } from 'src/components'
import { useObserver } from 'src/core/hooks'
import { gameFlow } from 'src/core/di'

export function Observing() {
  useObserver()

  const { game } = gameFlow

  return (
    <Screen title="Game">
      <span>observing!</span>
    </Screen>
  )
}
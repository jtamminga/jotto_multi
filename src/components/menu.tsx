import { Screen } from './screen'
import { Players, PlayersShowMode } from './players'
import { AppState } from 'src/core'

type Props = {
  state: AppState
}

export function Menu({ state }: Props) {

  let showMode: PlayersShowMode = undefined
  if (state === 'playing' || state === 'observing') {
    showMode = 'stats'
  }

  return (
    <Screen title="Menu" showMenu>

      <Players show={showMode} />

    </Screen>
  )
}
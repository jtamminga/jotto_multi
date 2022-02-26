import { Screen } from './screen'
import { AppState } from 'src/core'
import { PlayersStats } from './players/players_stats'

type Props = {
  state: AppState
}

export function Menu({ state }: Props) {

  const showStats = state === 'playing' || state === 'observing'

  return (
    <Screen title="Menu" showMenu>

      { showStats &&
        <PlayersStats />
      }

    </Screen>
  )
}
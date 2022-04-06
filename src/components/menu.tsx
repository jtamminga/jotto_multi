import { Screen } from './screen'
import { AppState } from 'src/core'
import { PlayersStats } from './players/players_stats'
import { useTransition, animated, config } from 'react-spring'

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

type FullScreenProps = {
  visible: boolean
} & Props

export function FullScreenMenu({ visible, state }: FullScreenProps) {

  const transitions = useTransition(visible, {
    from: { transform: 'translateY(-100%)' },
    enter: { transform: 'translateY(0%)' },
    leave: { transform: 'translateY(-100%)' },
    config: { mass: 1, tension: 300, friction: 30 }
  })

  return transitions((styles, item) => item &&
    <animated.div className="absolute inset-0 z-10 bg-white" style={styles}>
      <Menu state={state} />
    </animated.div>
  )
}
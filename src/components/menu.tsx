import { Screen } from './screen'
import { AppState } from 'src/core'
import { PlayersStats } from './players/players_stats'
import { useTransition, animated } from '@react-spring/web'
import { Button } from './button'
import { menu } from 'src/core/di'

type Props = {
  state: AppState
}

export function Menu({ state }: Props) {

  const showStats = state === 'playing' || state === 'observing'

  return (
    <Screen title="Menu">

      <div className="grow">
        { showStats &&
          <PlayersStats />
        }
      </div>

      <div className="pb-3 flex flex-col">
        <Button
          text="Back"
          type="secondary"
          onClick={() => menu.hide()}
        />
      </div>

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

  return transitions((styles, visible) => visible &&
    <animated.div className="absolute inset-0 z-10 bg-white flex" style={styles}>
      <Menu state={state} />
    </animated.div>
  )
}
import { Game, GameSummary, InRoom, JoinRoom, PickWord } from './screens'
import { useGameFlow, useQueryParams } from './core/hooks'
import { AppState } from './core'
import { Observer } from './screens/observer'

type URLParams = { obs: boolean }

const stateToScreen: Record<AppState, JSX.Element> = {
  'joining_room': <JoinRoom />,
  'joined_room': <InRoom />,
  'picking_word': <PickWord />,
  'picked_word': <span>Picked Word</span>,
  'ingame': <Game />,
  'game_summary': <GameSummary />
}

export default function App() {

  const { gameFlow } = useGameFlow()
  const { obs } = useQueryParams<URLParams>()

  if (obs) {
    return <Observer />
  }

  return stateToScreen[gameFlow.state]
}

 

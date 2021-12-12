import { JoinRoom, PickWord } from './screens'
import { useGame } from './core/hooks/useGame'
import { AppState } from './core'

// styles
import './App.css'

const stateToScreen: Record<AppState, JSX.Element> = {
  'joining_room': <JoinRoom />,
  'joined_room': <span>Joined Room</span>,
  'picking_word': <PickWord />,
  'picked_word': <span>Picked Word</span>,
  'ingame': <span>In Game</span>
}

export default function App() {
  const { gameFlow } = useGame()

  return stateToScreen[gameFlow.state]
}

 

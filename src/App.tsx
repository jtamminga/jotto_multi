import { Game, GameSummary, InRoom, JoinRoom, PickWord } from './screens'
import { useGame } from './core/hooks/useGame'
import { AppState } from './core'

// styles
import './App.css'

const stateToScreen: Record<AppState, JSX.Element> = {
  'joining_room': <JoinRoom />,
  'joined_room': <InRoom />,
  'picking_word': <PickWord />,
  'picked_word': <span>Picked Word</span>,
  'ingame': <Game />,
  'game_summary': <GameSummary />
}

export default function App() {
  const { gameFlow } = useGame()

  return stateToScreen[gameFlow.state]
}

 

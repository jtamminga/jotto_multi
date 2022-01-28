import { Game, GameSummary, InRoom, JoinRoom, Observing, PickedWord, PickWord } from './screens'
import { useGameFlow } from './core/hooks'
import { ReactNode } from 'react'

export default function App() {

  const { gameFlow } = useGameFlow()

  let screen: ReactNode

  switch (gameFlow.state) {
    case 'joining_room':
      screen = <JoinRoom />
      break

    case 'joined_room':
      screen = <InRoom />
      break

    case 'picking_word':
      screen = <PickWord />
      break

    case 'picked_word':
    case 'starting_game':
      screen = <PickedWord />
      break

    case 'ingame':
      screen = <Game />
      break

    case 'observing':
      screen = <Observing />
      break

    case 'game_summary':
      screen = <GameSummary />
      break
  }

  return (
    <div className="container mx-auto max-w-screen-sm px-3">
      {screen}
    </div>
  )
}

 

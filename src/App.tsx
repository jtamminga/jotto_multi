import { Game, GameSummary, InRoom, JoinRoom, Observing, PickedWord, PickWord } from './screens'
import { useGameFlow } from './core/hooks'
import { ReactNode } from 'react'
import { Keyboard } from './components'

export default function App() {

  const { gameFlow } = useGameFlow()

  let screen: ReactNode
  let showKeyboard: boolean = false

  switch (gameFlow.state) {
    case 'joining_room':
      screen = <JoinRoom />
      break

    case 'joined_room':
      screen = <InRoom />
      break

    case 'picking_word':
      screen = <PickWord />
      showKeyboard = true
      break

    case 'picked_word':
    case 'starting_game':
      screen = <PickedWord />
      break

    case 'playing':
      screen = <Game />
      showKeyboard = true
      break

    case 'observing':
      screen = <Observing />
      break

    case 'game_summary':
      screen = <GameSummary />
      break
  }

  return (
    <div className="container mx-auto max-w-screen-sm h-full flex flex-col">

      {screen}

      { showKeyboard &&
        <Keyboard />
      }
    </div>
  )
}

 

import { Game, GameSummary, InRoom, JoinRoom, Observing, PickedWord, PickWord } from './screens'
import { useGameFlow, useKeyboard, useMenu } from './core/hooks'
import { ReactNode } from 'react'
import { Keyboard, Menu } from './components'
import { AppState } from './core'

export default function App() {

  const { gameFlow } = useGameFlow()
  const { keyboard } = useKeyboard()
  const { menu } = useMenu()

  return (
    <div className={containerStyle}>

      {/* menu */}
      { menu.visible &&
        <div className="absolute w-full h-full bg-white">
          <Menu state={gameFlow.state} />
        </div>
      }

      {/* render screen based on app state */}
      {screen(gameFlow.state)}

      {/* keyboard */}
      { keyboard.visible &&
        <Keyboard />
      }
    </div>
  )
}


//
// helpers
// =======


function screen(state: AppState): ReactNode {
  let screen: ReactNode

  switch (state) {
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

    case 'playing':
      screen = <Game />
      break

    case 'observing':
      screen = <Observing />
      break

    case 'game_summary':
      screen = <GameSummary />
      break
  }

  return screen
}


//
// styles
// ======


const containerStyle =
  "container mx-auto max-w-screen-sm h-full flex flex-col relative"

 

import { useGameFlow, useKeyboard, useMenu } from './core/hooks'
import { ReactNode } from 'react'
import { Keyboard, Menu } from './components'
import { AppState } from './core'

import {
  Game,
  GameSummary,
  InRoom,
  JoinLobby,
  JoinRoom,
  Observing,
  PickedWord,
  PickWord,
  RoleSelect
} from './screens'


export default function App() {

  const { gameFlow } = useGameFlow()
  const { keyboard } = useKeyboard()
  const { menu } = useMenu()

  return (
    <div className={containerStyle(gameFlow.state)}>

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
    case 'role_select':
      screen = <RoleSelect />
      break

    case 'joining_lobby':
      screen = <JoinLobby />
      break

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


function containerStyle(state: AppState): string {
  const wide = state === 'observing'

  return "container mx-auto h-full flex flex-col relative " +
    (wide ? 'max-w-screen-lg' : 'max-w-screen-sm')
}

 

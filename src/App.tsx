import { useGameFlow, useKeyboard, useMenu } from './core/hooks'
import { ConnectionStatus, FullScreenMenu, Keyboard } from './components'
import { AppState } from './core'
import { Navigation } from './screens'


export default function App() {

  const { gameFlow } = useGameFlow()
  const { keyboard } = useKeyboard()
  const { menu } = useMenu()

  return (
    <div className={containerStyle(gameFlow.state)}>

      {/* menu */}
      <FullScreenMenu
        visible={menu.visible}
        state={gameFlow.state}
      />

      {/* render screen based on app state */}
      <Navigation state={gameFlow.state} />

      {/* connecting feedback */}
      <div className="relative">
        <ConnectionStatus />
      </div>

      {/* keyboard */}
      { keyboard.visible &&
        <Keyboard />
      }

    </div>
  )
}


//
// styles
// ======


function containerStyle(state: AppState): string {
  const wide = state === 'observing'

  return "container mx-auto h-full flex flex-col relative select-none " +
    (wide ? 'max-w-screen-lg' : 'max-w-screen-sm')
}

 

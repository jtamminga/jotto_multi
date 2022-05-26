import { animated, useTransition } from 'react-spring'
import { toastAnimation } from 'src/core'
import { useConnection } from 'src/core/hooks'

export function ConnectionStatus() {
  const { state } = useConnection()
  const isConnecting = state === 'connecting'
  const transitions = useTransition(isConnecting, toastAnimation)

  return transitions((styles, isConnecting) => isConnecting &&
    <animated.div style={styles}>
      <Reconnecting />
    </animated.div>
  )
}

function Reconnecting() {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-3">
      <div className="p-2 bg-orange-400 text-white rounded text-center animate-pulse">
        trying to reconnect
      </div>
    </div>
  )
}
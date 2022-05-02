import { animated, useTransition } from 'react-spring'
import { useErrors } from 'src/core/hooks'

type ToastProps = {
  message: string
}

export function Errors() {
  const { latestError } = useErrors()

  const transitions = useTransition(latestError, {
    from: { opacity: 0, transform: 'scale(0.95)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.95)' },
    config: { mass: 1, tension: 600, friction: 30 }
  })

  return transitions((styles, latestError) => latestError &&
    <animated.div style={styles}>
      <ErrorToast message={latestError.message} />
    </animated.div>
  )
}

export function ErrorToast({ message }: ToastProps) {
  return (
    <div className="p-2 bg-red-400 text-white rounded text-center">
      {message}
    </div>
  )
}
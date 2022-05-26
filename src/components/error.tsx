import { animated, useTransition } from 'react-spring'
import { toastAnimation } from 'src/core'
import { useErrors } from 'src/core/hooks'

type ToastProps = {
  message: string
}

export function Errors() {
  const { latestError } = useErrors()
  const transitions = useTransition(latestError, toastAnimation)

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
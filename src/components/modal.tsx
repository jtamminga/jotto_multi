import { ReactNode } from 'react'
import { useTransition, animated } from 'react-spring'

type Props = {
  visible: boolean,
  onClose: () => void,
  children: ReactNode
}

export function Modal({ visible, children, onClose }: Props) {

  const transitions = useTransition(visible, {
    from: { opacity: 0, transform: 'translateY(-40px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(-40px)' },
    config: { mass: 1, tension: 600, friction: 30 }
  })

  return transitions((styles, visible) => visible &&
    <animated.div
      className="fixed inset-0 z-10 bg-slate-100/[.8] flex flex-col justify-center items-center p-3"
      onClick={() => onClose()}
      style={{ opacity: styles.opacity }}
    >

      <animated.div className="max-w-screen-sm w-full bg-white p-3 rounded drop-shadow-2xl" style={{ transform: styles.transform }}>
        {children}
      </animated.div>

    </animated.div>
  )
}
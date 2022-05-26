import { ReactNode } from 'react'
import { useTransition, animated } from 'react-spring'
import { movementConfig } from 'src/core'

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
    config: movementConfig
  })

  return transitions((styles, visible) => visible &&
    <animated.div
      className="fixed inset-0 z-10 bg-slate-200/[.9] flex flex-col justify-center items-center p-3"
      onClick={() => onClose()}
      style={{ opacity: styles.opacity }}
    >

      <animated.div className="max-w-screen-sm w-full bg-white p-3 rounded shadow-[5px_5px_0_0_rgba(0,0,0,0.05)]" style={{ transform: styles.transform }}>
        {children}
      </animated.div>

    </animated.div>
  )
}
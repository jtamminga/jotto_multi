import classNames from 'classnames'
import { ReactNode, useEffect } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { GuessResultSummary } from 'src/components'
import { useObserver } from 'src/core/hooks'
import { eventBus } from 'src/core/di'
import { createSetWord } from 'src/core/events'

type Props = {
  className?: string
  onClick?: (word: string | undefined) => void
}

export function Observer({ className, onClick }: Props) {
  const { latestResult } = useObserver()
  const [styles, animate] = useSpring(() => ({ transform: 'scale(1)' }))

  // animate only when there is a new guess result
  useEffect(() => {
    animate({ transform: 'scale(1.1)'})
    animate({ transform: 'scale(1)', delay: 100 })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestResult])


  let content: ReactNode

  // determine what to render
  // ========================

  if (!latestResult) {
    content = 'Nothing happened yet'
  }
  else {
    content = <GuessResultSummary result={latestResult} />
  }

  // event handler
  // =============

  function handleOnClick() {
    if (latestResult === undefined) {
      return
    }

    eventBus.publish(createSetWord(latestResult.word))
    if (onClick) {
      onClick(latestResult.word)
    }
  }

  // render
  // ======

  const classes = classNames(
    'h-12 px-6 rounded flex items-center justify-center',
    {
      [noEventStyle]: latestResult === undefined,
      [hasEventStyle]: latestResult !== undefined
    },
    className
  ) 

  return (
    <animated.div style={styles} className={classes} onClick={handleOnClick}>
      {content}
    </animated.div>
  )
}


//
// styles
// ======


const noEventStyle =
  'bg-slate-100 text-slate-400'

const hasEventStyle =
  'bg-blue-100 cursor-pointer hover:bg-blue-200'
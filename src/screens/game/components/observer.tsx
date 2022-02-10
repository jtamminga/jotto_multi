import classNames from 'classnames'
import { ReactNode } from 'react'
import { GuessResultSummary } from 'src/components'
import { useObserver } from 'src/core/hooks'

type Props = {
  className?: string
  onClick?: (word: string | undefined) => void
}

export function Observer({ className, onClick }: Props) {
  const { latestEvent } = useObserver()

  let content: ReactNode

  // determine what to render
  // ========================

  if (!latestEvent) {
    content = 'Nothing happened yet'
  }
  else {
    content = <GuessResultSummary result={latestEvent.guessResult} />
  }

  // event handler
  // =============

  function handleOnClick() {
    if (onClick) {
      onClick(latestEvent?.guessResult.word)
    }
  }

  // render
  // ======

  const classes = classNames(
    'h-12 px-6 rounded flex items-center justify-center',
    {
      [noEventStyle]: latestEvent === undefined,
      [hasEventStyle]: latestEvent !== undefined
    },
    className
  )

  return (
    <div className={classes} onClick={handleOnClick}>
      {content}
    </div>
  )
}


//
// styles
// ======


const noEventStyle =
  'bg-slate-100 text-slate-400'

const hasEventStyle =
  'bg-blue-100 cursor-pointer hover:bg-blue-200'
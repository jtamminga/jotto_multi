import { intervalToDuration } from 'date-fns'
import { useEffect } from 'react'
import { useTimer } from 'src/core/hooks'
import { Timer } from './timer'

type Props = {
  dueAt: Date
}

export function AutoTimer({ dueAt }: Props) {
  const timer = useTimer()

  useEffect(() => {
    timer.start()
  }, [])

  const duration = intervalToDuration({
    start: Date.now(),
    end: dueAt
  })

  return (
    <Timer duration={duration} />
  )
}
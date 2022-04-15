import { Seconds } from 'jotto_core'
import { useEffect } from 'react'
import { useTimer } from 'src/core/hooks'
import { Timer } from './timer'

type Props = {
  length: Seconds
}

export function AutoTimer({ length }: Props) {
  const timer = useTimer()

  useEffect(() => {
    timer.start()
  }, [])

  const timeLeft = { seconds: length - timer.seconds }

  return (
    <Timer duration={timeLeft} />
  )
}
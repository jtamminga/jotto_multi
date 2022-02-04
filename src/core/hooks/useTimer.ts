import { useEffect, useState } from 'react'
import { interval, Subscription } from 'rxjs'

export function useTimer(autoStart = false) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function start() {
    setIsActive(true)
  }

  useEffect(() => {
    let subscription: Subscription | undefined

    if (autoStart || isActive) {
      subscription = interval(1000)
        .subscribe(i => {
          setSeconds(i + 1)
        })
    }

    return () => subscription?.unsubscribe()
  }, [isActive])

  return { start, seconds }
}
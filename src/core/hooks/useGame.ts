import { useEffect, useState } from 'react'
import { gameFlow } from 'src/core/di'

export function useGame() {
  const [updatedAt, setUpdatedAt] = useState(0)

  useEffect(() => {
    const subscription = gameFlow.state$
      .subscribe(e => setUpdatedAt(e.timestamp))

    return () => subscription.unsubscribe()
  }, [])

  return { gameFlow, updatedAt }
}
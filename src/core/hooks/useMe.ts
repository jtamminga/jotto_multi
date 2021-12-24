import { useEffect, useState } from 'react'
import { players } from 'src/core/di'

export function useMe() {
  const [updatedAt, setUpdatedAt] = useState(0)

  useEffect(() => {
    const subscription = players.me.change$
      .subscribe(e => setUpdatedAt(e.timestamp))

    return () => subscription.unsubscribe()
  }, [])

  return { me: players.me, updatedAt }
}
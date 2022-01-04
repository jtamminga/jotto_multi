import { useEffect, useState } from 'react'
import { Observable } from 'rxjs'
import { Event } from 'src/core/events/event'

export function createHook<T extends Event, K>(
  observer: Observable<T>,
  object: K
) {
  return function() {
    const [updatedAt, setUpdatedAt] = useState(0)

    useEffect(() => {
      const subscription = observer
        .subscribe(e => setUpdatedAt(e.timestamp))

      return () => subscription.unsubscribe()
    }, [])

    return { ...object, updatedAt }
  }
}
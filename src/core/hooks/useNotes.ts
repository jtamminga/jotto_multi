import { eventBus, players } from 'src/core/di'
import { filter } from 'rxjs'
import { isNotesEvent } from '../events'
import { useEffect, useState } from 'react'

export function useNotes() {
  const [updatedAt, setUpdatedAt] = useState(0)

  useEffect(() => {
    const subscription = eventBus.events$
      .pipe(filter(isNotesEvent))
      .subscribe(e => setUpdatedAt(e.timestamp))

    return () => subscription.unsubscribe()
  }, [])

  return { notes: players.me.notes, updatedAt }
}
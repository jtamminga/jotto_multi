import { useEffect, useState } from 'react'
import { distinctUntilChanged, filter, map } from 'rxjs'
import { eventBus } from 'src/core/di'
import { isLoadingEvent } from '../events'

export function useLoading() {

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {

    const subscription = eventBus.events$
      .pipe(
        filter(isLoadingEvent),
        map(e => e.loading),
        distinctUntilChanged()
      )
      .subscribe(loading => {
        console.log('[useLoading] loading:', loading)
        setIsLoading(loading)
      })

    return () => subscription.unsubscribe()
  })

  return { loading: isLoading }
}
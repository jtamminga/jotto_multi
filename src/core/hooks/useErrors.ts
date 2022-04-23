import { useEffect, useState } from 'react'
import { JottoError } from 'src/models'
import { errors } from 'src/core/di'

export function useErrors() {

  const [latestError, setLatestError] = useState<JottoError>()

  useEffect(() => {

    if (errors.latestError) {
      setLatestError(errors.latestError)
    }

    const subscription = errors.change$
      .subscribe(event => {
        if (event.type === 'new_error') {
          setLatestError(event.error)
        } else if (event.type === 'clear_error') {
          setLatestError(undefined)
        }
      })

    return () => subscription.unsubscribe()
  })

  return { latestError }
}
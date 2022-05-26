import { useEffect, useState } from 'react'
import { ConnectionState } from 'src/core'
import { connection } from 'src/core/di'

export function useConnection() {

  const [state, setState] = useState<ConnectionState>(connection.state)

  useEffect(() => {

    const subscription = connection.state$
      .subscribe(event => setState(event.state))

    return () => subscription.unsubscribe()
  }, [])

  return { state }
}
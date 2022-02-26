import { createHook } from './factory'
import { eventBus } from 'src/core/di'
import { isGuessResultEvent } from '../events'
import { filter } from 'rxjs'

const guessResult$ = eventBus.events$
  .pipe(filter(isGuessResultEvent))

export const useGuessResult = createHook(guessResult$, {})
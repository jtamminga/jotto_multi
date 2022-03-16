import { gameFlow } from 'src/core/di'
import { createHook } from './factory'

export const useLoading = createHook(gameFlow.loading$, { gameFlow, loading: gameFlow.loading })
import { gameFlow } from 'src/core/di'
import { createHook } from './factory'

export const useGameFlow = createHook(gameFlow.state$, { gameFlow })
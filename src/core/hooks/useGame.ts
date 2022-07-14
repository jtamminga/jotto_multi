import { appFlow } from 'src/core/di'
import { createHook } from './factory'

export const useAppFlow = createHook(appFlow.state$, { appFlow })
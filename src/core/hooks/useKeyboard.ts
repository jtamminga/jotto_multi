import { keyboard } from 'src/core/di'
import { createHook } from './factory'

export const useKeyboard = createHook(keyboard.change$,
  { keyboard }
)
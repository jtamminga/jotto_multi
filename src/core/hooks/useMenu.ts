import { menu } from 'src/core/di'
import { createHook } from './factory'

export const useMenu = createHook(menu.visibility$, { menu })
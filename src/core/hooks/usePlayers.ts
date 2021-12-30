import { players } from 'src/core/di'
import { createHook } from './factory'

export const usePlayers = createHook(players.change$, { players })
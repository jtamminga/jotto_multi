import { io } from 'socket.io-client'
import { jottoSocketDecorator } from './socket'
import { GameFlow, Players } from 'src/managers'
import { EventBus } from './event_bus'
import 'colors'

console.debug('setting up dependencies...'.gray)

// constants
const URL = 'http://localhost:3001'

// setup instances
export const socket = jottoSocketDecorator(io(URL, { autoConnect: false }))

export const eventBus = new EventBus()

// eventBus.events$.subscribe(e => console.debug('events', e))

// managers
export const players = new Players(socket, eventBus)
export const gameFlow = new GameFlow(socket, eventBus, players)

console.debug('dependences setup')
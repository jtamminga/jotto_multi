import { GameFlow, Players } from 'src/managers'
import { EventBus } from './event_bus'
import { Connection } from 'src/managers/connection'

console.debug('setting up dependencies...')

// setup bus
export const eventBus = new EventBus()

// eventBus.events$.subscribe(e => console.debug('events', e))

// managers
export const connection = new Connection(eventBus)
export const players = new Players(connection.socket, eventBus)
export const gameFlow = new GameFlow(connection.socket, eventBus, players)

console.debug('dependences setup')
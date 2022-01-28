import { GameFlow, Players, Connection, Observer } from 'src/managers'
import { EventBus } from './event_bus'

console.debug('setting up dependencies...')

// setup bus
export const eventBus = new EventBus()

// eventBus.events$.subscribe(e => console.debug('events', e))

// managers
export const connection = new Connection(eventBus)
export const players = new Players(connection.socket, eventBus)
export const gameFlow = new GameFlow(connection.socket, eventBus, players)
export const observer = new Observer(eventBus)

console.debug('dependences setup')
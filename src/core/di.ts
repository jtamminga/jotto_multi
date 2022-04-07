import {
  GameFlow,
  Players,
  Connection,
  Observer,
  Keyboard,
  Menu,
  Errors
} from 'src/managers'
import { EventBus } from './event_bus'

console.debug('setting up dependencies...')

const serverUrl = process.env.REACT_APP_SERVER_URL

if (!serverUrl) {
  throw new Error('server url not defined')
}

// setup bus
export const eventBus = new EventBus()

// eventBus.events$.subscribe(e => console.debug('eventbus', e))

// managers
export const errors = new Errors(eventBus)
export const connection = new Connection(eventBus, serverUrl)
export const players = new Players(connection.socket, eventBus)
export const gameFlow = new GameFlow(connection.socket, eventBus, players)
export const observer = new Observer(eventBus)
export const keyboard = new Keyboard(eventBus)
export const menu = new Menu(eventBus, gameFlow)

console.debug('dependences setup')
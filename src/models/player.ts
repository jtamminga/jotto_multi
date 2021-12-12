import { User } from "src/core"

export class Player {
  private _userId: string
  private _username: string
  private _connected: boolean
  private _ready: boolean

  constructor(user: User) {
    this._userId = user.userId
    this._username = user.username
    this._connected = user.connected
    this._ready = user.ready
  }

  get userId(): string {
    return this._userId
  }

  get connected(): boolean {
    return this._connected
  }

  get username(): string {
    return this._username
  }

  get ready(): boolean {
    return this._ready
  }

  set connected(value: boolean) {
    this._connected = value
  }

  set ready(value: boolean) {
    this._ready = value
  }
}
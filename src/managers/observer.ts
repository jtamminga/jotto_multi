import { JottoSocket } from "src/core";

export class Observer {

  constructor(
    private _socket: JottoSocket
  ) {

  }

  public join(username: string) {
    this._socket.updateAuth({ username, type: 'observer' })
    this._socket.connect()
  }

}
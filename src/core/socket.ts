import { Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from 'jotto_core'

type Auth = {
  sessionId?: string
  lobbyCode?: string
}

export abstract class JottoSocket extends Socket<ServerToClientEvents, ClientToServerEvents> {
  sessionId?: string
  userId?: string
  username?: string

  abstract updateAuth(auth: Auth): void
}

export function jottoSocketDecorator(socket: Socket): JottoSocket {
  const jottoSocket = socket as JottoSocket
  
  jottoSocket.updateAuth = function(auth: Auth) {
    jottoSocket.auth = auth
    // jottoSocket.sessionId = auth.sessionId
  }

  return jottoSocket
}
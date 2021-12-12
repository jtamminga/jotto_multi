import { Socket } from 'socket.io-client';

type Auth = {
  username?: string;
  sessionId?: string;
}

export type SocketSession = {
  sessionId: string;
  userId: string;
}

export abstract class JottoSocket extends Socket {
  sessionId?: string
  userId?: string
  username?: string

  abstract updateAuth(auth: Auth): void
}

export function jottoSocketDecorator(socket: Socket): JottoSocket {
  const jottoSocket = socket as JottoSocket
  
  jottoSocket.updateAuth = function(auth: Auth) {
    jottoSocket.auth = auth
  }

  return jottoSocket
}
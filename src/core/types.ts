export interface User {
  userId: string;
  sessionId: string;
  username: string;
  connected: boolean;
  ready: boolean;
  won: boolean;
}

export type AppState =
  | 'joining_room'
  | 'joined_room'
  | 'picking_word'
  | 'picked_word'
  | 'ingame'

export class IllegalStateException extends Error { }
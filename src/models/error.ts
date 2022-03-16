export type ErrorType =

  | 'lobby_not_available'
  

export class JottoError {

  constructor(
    private _type: ErrorType,
    private _message: string
  ) { }

  public get type(): ErrorType {
    return this._type
  }

  public get message(): string {
    return this._message
  }
}
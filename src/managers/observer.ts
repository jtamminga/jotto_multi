import { filter, map, merge, Observable } from 'rxjs'
import { EventBus } from 'src/core'
import { Player } from 'src/models/player'
import { Event } from 'src/core/events/event'
import { isGuessResultEvent, GuessEvent } from 'src/core/events/game'
import { PlayerEvent, isPlayerWonEvent } from 'src/core/events/player'

type PlayerBasedEvent<T extends Event> = T & { player: Player }
type Obs<T extends Event> = Observable<PlayerBasedEvent<T>>

export class Observer {

  constructor(
    private _bus: EventBus
  ) { }

  get won$(): Obs<PlayerEvent> {
    return this._bus.events$
      .pipe(
        filter(isPlayerWonEvent)
      )
  }

  get guessResult$(): Obs<GuessEvent> {
    return this._bus.events$
      .pipe(
        filter(isGuessResultEvent),
        map(e => ({
          ...e,
          player: e.guessResult.from
        }))
      )
  }

  get players$(): Obs<PlayerEvent | GuessEvent> {
    return merge(
      this.guessResult$,
      this.won$
    )
  }

}
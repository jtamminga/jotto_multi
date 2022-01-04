import { Observable, Subject } from 'rxjs'
import { Event } from './events/event'

export class EventBus {
  private _subject: Subject<Event>

  constructor() {
    this._subject = new Subject<Event>()
  }

  get events$(): Observable<Event> {
    return this._subject.asObservable()
  }

  public publish(event: Event) {
    this._subject.next(event)
  }
}
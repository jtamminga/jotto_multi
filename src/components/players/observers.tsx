import { Player } from 'src/models'
import { SubHeader } from '../header'
import { PlayerContainer } from './player_container'

type Props = {
  observers: Player[]
  me: Player,
  className?: string
}

export function Observers({ observers, me, className }: Props) {
  return (
    <div className={className}>
      <SubHeader className="mb-2">Observers</SubHeader>
      <ul>
        { observers.map(observer =>
          <li key={observer.userId} className="mb-2">
            <PlayerContainer isMe={observer === me} style="secondary">
              {observer.username}
            </PlayerContainer>
          </li>
        )}
      </ul>
    </div>
  )
}
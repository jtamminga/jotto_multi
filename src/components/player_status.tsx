import { usePlayers } from 'src/core/hooks'

export function PlayerStatus() {

  const { players } = usePlayers()

  return (
    <div>
      <ul>
        {players.connected.map(player =>
          <li key={player.userId}>{player.username}</li>
        )}
      </ul>
    </div>
  )

}
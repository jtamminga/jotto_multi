import { usePlayers } from "src/core/hooks";
import { Player } from "src/models";

export function PlayersStatus() {

  const { players } = usePlayers()

  return (
    <>
      <ul>
        {players.playing.map(player =>
          <li key={player.userId}>
            {playerItem(player)}
          </li>
        )}
      </ul>
    </>
  )

}

function playerItem(player: Player) {
  return (
    <div>
      
    </div>
  )
}
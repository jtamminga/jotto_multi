import { AppState } from 'src/core'
import { Game, GameSummary } from './game'
import { InRoom } from './in_room'
import { JoinLobby } from './join_lobby'
import { JoinRoom } from './join_room'
import { Observing } from './observing'
import { PickedWord } from './picked_word'
import { PickWord } from './pick_word'
import { RoleSelect } from './role_select'


type Props = {
  state: AppState
}

export function Navigation({ state }: Props): JSX.Element {
  let screen: JSX.Element

  switch (state) {
    case 'role_select':
      screen = <RoleSelect />
      break

    case 'joining_lobby':
      screen = <JoinLobby />
      break

    case 'joining_room':
      screen = <JoinRoom />
      break

    case 'joined_room':
      screen = <InRoom />
      break

    case 'picking_word':
      screen = <PickWord />
      break

    case 'picked_word':
    case 'starting_game':
      screen = <PickedWord />
      break

    case 'playing':
      screen = <Game />
      break

    case 'observing':
      screen = <Observing />
      break

    case 'game_summary':
      screen = <GameSummary />
      break
  }

  return screen
}
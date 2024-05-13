import { Screen, FiveWordInput, AutoTimer } from 'src/components'
import { Em } from 'src/components/typography'
import { gameFlow } from 'src/core/di'

export function PickWord() {
  return (
    <Screen title="Pick a word">

      <div className="text-center mb-5">
        <AutoTimer dueAt={gameFlow.game.wordDueOn} />
      </div>

      <div className="text-center mb-5">
        Pick a <Em>5 letter</Em> word with <Em>no duplicate</Em> letters
      </div>

      <div className="text-center mb-5 grow">
        playing a {gameLength()} game
      </div>

      
      <FiveWordInput
        className="my-3"
        buttonLabel="Submit"
        onSubmit={word => gameFlow.pickWord(word)}
      />

    </Screen>
  )
}

// game length
function gameLength() {
  const { gameLength } = gameFlow.game
  const content = gameLength ? `${gameLength} min` : 'relaxed'
  return <span className="bg-slate-100 px-2 py-1 rounded">{content}</span>
}
import classNames from 'classnames'
import { Guess } from 'src/core'
import { Notes } from 'src/models'


//
// guesses collection
// ==================


type CollectionProps = {
  guesses: Guess[],
  notes: Notes | undefined
}

export function GuessResults({ guesses, notes }: CollectionProps) {
  if (guesses.length === 0) {
    return (
      <div className="p-5 bg-slate-100 rounded text-center text-slate-400">
        You made no guesses yet
      </div>
    )
  }

  return (
    <ol className="list-decimal flex flex-col items-center text-slate-300" reversed>
      {guesses.slice().reverse().map(guess =>
        <li key={guess.id} className="pl-3 mb-2">
          {guessResultItem(guess, notes)}
        </li>
      )}
    </ol>
  )
}


//
// guess item
// ==========


function guessResultItem(guess: Guess, notes: Notes | undefined) {
  const letters = Array.from(guess.word)

  const charBlocks = letters.map((char, i) =>
    <div key={i} className={charBlockClasses(i, notes?.inWord(char))}>
      {char}
    </div>
  )

  return (
    <div className={containerClasses}>
      {charBlocks}
      <div className={commonBlockClasses(guess)}>
        {guess.common}
      </div>
    </div>
  )
}


//
// styling
// =======


const containerClasses = 'inline-flex rounded space-x-1'
const baseCharBlockClasses = 'py-2 uppercase text-center transition-colors delay-300'


function charBlockClasses(index: number, inWord: boolean | undefined): string {
  return classNames(
    baseCharBlockClasses, 'w-8 rounded',
    {
      'bg-emerald-400 text-white': inWord === true,
      'bg-slate-400 text-white': inWord === false,
      'bg-slate-200 text-slate-600': inWord === undefined
    }
  )
}

function commonBlockClasses({ common }: Guess): string {
  return classNames(
    baseCharBlockClasses,
    'w-14 rounded text-slate-600',
    {
      'bg-slate-200 animate-pulse': common === undefined,
      'bg-red-200': common === 0 || common === 1,
      'bg-amber-200': common === 2 || common === 3,
      'bg-emerald-200': common === 4 || common === 5,
    }
  )
}
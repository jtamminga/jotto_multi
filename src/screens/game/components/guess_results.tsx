import classNames from 'classnames'
import { GuessResult } from 'src/core'


//
// guesses collection
// ==================


type CollectionProps = {
  guesses: GuessResult[]
}

export function GuessResults({ guesses }: CollectionProps) {
  return (
    <ol className="list-decimal pl-3 flex flex-col items-center text-slate-300" reversed>
      {guesses.slice().reverse().map(guess =>
        <li key={guess.id} className="pl-3">
          <GuessResultItem guess={guess} />
        </li>
      )}
    </ol>
  )
}


//
// guess item
// ==========


type ItemProps = {
  guess: GuessResult
}

export function GuessResultItem({ guess }: ItemProps) {
  const letters = Array.from(guess.word)

  const charBlocks = letters.map((char, i) =>
    <div key={i} className={charBlockClasses(i)}>
      {char}
    </div>  
  )

  return (
    <div className={containerClasses(guess)}>
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


const baseCharBlockClasses = 'py-2 uppercase text-center text-slate-800'

function containerClasses({ won }: GuessResult): string {
  return classNames(
    'inline-flex rounded mb-2',
    {
      'bg-emerald-100': won,
      'bg-slate-100': !won
    }
  )
}

function charBlockClasses(index: number): string {
  return classNames(
    baseCharBlockClasses, 'w-6',
    { 'rounded-l ml-3': index == 0 },
    { 'mr-3': index === 4 }
  )
}

function commonBlockClasses({ common, won }: GuessResult): string {
  if (common === undefined) return ''

  if (won) {
    return classNames(
      baseCharBlockClasses,
      'w-14 rounded-r bg-emerald-200'
    )
  }

  return classNames(
    baseCharBlockClasses,
    'w-14 rounded-r',
    {
      'bg-red-200': common === 0 || common === 1,
      'bg-amber-200': common === 2 || common === 3,
      'bg-emerald-200': common === 4 || common === 5,
    }
  )
}
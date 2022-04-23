import classNames from 'classnames'

type Props = {
  word: string,
  highlight: string
}

export function Word({ word, highlight }: Props) {
  return (
    <div className="flex gap-x-3">
      {Array.from(word).map((char, i) =>
        <div key={i} className={charStyle(char, highlight)}>
          {char}
        </div>
      )}
    </div>
  )
}

function charStyle(char: string, highlight: string): string {
  return classNames(
    'uppercase w-12 h-14 flex items-center justify-center border border-1 rounded',
    {
      'ring ring-emerald-100 border-emerald-400': char === highlight,
      'bg-slate-100 border-slate-200': char !== highlight
    }
  )
}
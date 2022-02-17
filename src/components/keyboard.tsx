import classNames from 'classnames'
import { eventBus } from 'src/core/di'
import { createKeypress } from 'src/core/events'
import { useMe } from 'src/core/hooks'
import { GuessResultStats as Stats, resultStats } from 'src/core/stats'

type Props = {
  
}

export function Keyboard() {
  const { me } = useMe()
  const stats = resultStats(me.guessResults)

  return (
    <div className="w-full px-1 pb-2">
      {firstRow(stats)}
      {secondRow(stats)}
      {thirdRow(stats)}
    </div>
  )
}


function firstRow(stats: Stats) {
  const row = Array.from('qwertyuiop')

  return (
    <div className={rowStyle}>
      {renderKeys(row, stats)}
    </div>
  )
}

function secondRow(stats: Stats) {
  const row = Array.from('asdfghjkl')

  return (
    <div className={rowStyle}>
      <div className={spacerStyle}></div>
      {renderKeys(row, stats)}
      <div className={spacerStyle}></div>
    </div>
  )
}

function thirdRow(stats: Stats) {
  const row = Array.from('zxcvbnm')

  return (
    <div className={rowStyle}>
      <button
        className={enterStyle}
        onClick={() => onClick('clear')}
      >clear</button>
      {renderKeys(row, stats)}
      <button
        className={enterStyle}
        onClick={() => onClick('backspace')}
      >del</button>
    </div>
  )
}


//
// helpers
// =======


function renderKeys(keys: string[], stats: Stats) {
  return (
    <>
      {keys.map(key =>
        <button
          key={`key-${key}`}
          className={buttonStyle(key, stats)}
          onClick={() => onClick(key)}
        >{key}</button>
      )}
    </>
  )
}

function onClick(key: string) {
  eventBus.publish(createKeypress(key))
}


//
// styles
// ======


const rowStyle = 'flex mb-1'

const spacerStyle = 'flex-[0.5]'

// original height: h-14 (maybe for desktop)
const buttonBase =
  'h-12 flex items-center justify-center bg-slate-200 uppercase rounded ' +
  'mr-1 last-of-type:mr-0 select-none text-slate-600'

const enterStyle = classNames(buttonBase, 'flex-[1.5] text-xs')

function buttonStyle(key: string, stats: Stats) {
  return classNames(
    buttonBase, 'flex-1',
    {
      'bg-emerald-200': stats.inWord.includes(key),
      'bg-slate-400': stats.notInWord.includes(key)
    }
  )
}
import classNames from 'classnames'
import { ReactNode } from 'react'
import { eventBus } from 'src/core/di'
import { createKeypress } from 'src/core/events'
import { useKeyboard, useNotes } from 'src/core/hooks'
import { Notes } from 'src/models'

export function Keyboard() {
  const { notes } = useNotes()
  useKeyboard()
  
  // first
  function firstRow() {
    const row = Array.from('qwertyuiop')
  
    return (
      <div className={rowStyle}>
        {renderKeys(row)}
      </div>
    )
  }
  
  // second
  function secondRow() {
    const row = Array.from('asdfghjkl')
  
    return (
      <div className={rowStyle}>
        <div className={spacerStyle}></div>
        {renderKeys(row)}
        <div className={spacerStyle}></div>
      </div>
    )
  }
  
  // third
  function thirdRow() {
    const row = Array.from('zxcvbnm')

    let button: ReactNode
    if (notes === undefined) {
      button = (
        <button
          className={largeButtonStyle}
          onClick={() => onClick('clear')}
        >clear</button>
      )
    } else {
      button = (
        <button
          className={markingStyle(notes.isMarking)}
          onClick={() => notes.setMarking(!notes.isMarking)}
        >{notes.isMarking ? 'done' : 'mark'}</button>
      )
    }
  
    return (
      <div className={rowStyle}>
        {button}
        {renderKeys(row)}
        <button
          className={largeButtonStyle}
          onClick={() => onClick('backspace')}
        >del</button>
      </div>
    )
  }


  //
  // helpers
  // =======


  function renderKeys(keys: string[]) {
    return (
      <>
        {keys.map(key =>
          <button
            key={`key-${key}`}
            className={buttonStyle(key, notes)}
            onClick={() => onClick(key)}
          >{key}</button>
        )}
      </>
    )
  }

  function onClick(key: string) {
    eventBus.publish(createKeypress(key, notes?.isMarking ?? false))
  }


  //
  // render
  // ======


  return (
    <div className="w-full px-1 pb-2">
      { notes?.isMarking &&
        <div className="text-slate-400 text-sm text-center py-1">
          tap on letters to note for yourself if in word or not
        </div>
      }

      {firstRow()}
      {secondRow()}
      {thirdRow()}
    </div>
  )
}


//
// styles
// ======


const rowStyle = 'flex mb-1'

const spacerStyle = 'flex-[0.5]'

// original height: h-14 (maybe for desktop)
const buttonBase =
  'h-12 flex items-center justify-center uppercase rounded ' +
  'mr-1 last-of-type:mr-0 select-none text-slate-600'

const largeButtonBase = classNames(buttonBase, 'flex-[1.5] text-xs')

const largeButtonStyle = classNames(largeButtonBase, 'bg-slate-200 flex-[1.5] text-xs')

function markingStyle(isMarking: boolean): string {
  return classNames(
    largeButtonBase,
    {
      'bg-blue-100 shadow-inner': isMarking,
      'bg-blue-100': !isMarking
    }
  )
}

function buttonStyle(key: string, notes: Notes | undefined): string {
  const inWord = notes?.letters.get(key)?.inWord
  
  return classNames(
    buttonBase, 'flex-1',
    {
      'bg-slate-200': inWord === undefined,
      'bg-emerald-200': inWord === true,
      'bg-slate-400': inWord === false
    }
  )
}
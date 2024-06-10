import classNames from 'classnames'
import { ReactNode, useRef, useState } from 'react'
import { eventBus, menu, gameFlow } from 'src/core/di'
import { createKeypress } from 'src/core/events'
import { useKeyboard, useNotes } from 'src/core/hooks'
import { Notes } from 'src/models'
import { NoteSelect } from './note_select'


export function Keyboard() {

  const { notes } = useNotes()
  const timerRef = useRef<number>()
  const [heldLetter, setHeldLetter] = useState<string>()
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
    if (gameFlow.state === 'playing') {
      button = (
        <button
          className={classNames(largeButtonBase, "bg-blue-100")}
          onClick={() => menu.show()}
        >menu</button>
      )
    } else {
      button = (
        <button
          className={largeButtonStyle}
          onClick={() => publishKeyEvent('clear')}
        >clear</button>
      )
    }
  
    return (
      <div className={rowStyle}>
        {button}
        {renderKeys(row)}
        <button
          className={largeButtonStyle}
          onClick={() => publishKeyEvent('backspace')}
        >del</button>
      </div>
    )
  }


  //
  // helpers
  // =======


  function renderKey(key: string) {
    const letterCount = getLetterCount(key)

    return (
      <button
        key={`key-${key}`}
        className={buttonStyle(key, notes)}
        onTouchStart={() => { onKeyDown(key) }}
        onTouchEnd={() => { onKeyUp(key) }}
      >
        {letterCount &&
          <div className="absolute left-1 top-1 text-xs opacity-50">
            {letterCount}
          </div>
        }

        {key}

        {notes?.letters.get(key)?.confidence === 'known' &&
          <div className={knownMarkerStyle}></div>
        }
      </button>
    )
  }

  function renderKeys(keys: string[]) {
    return keys.map(key => renderKey(key))
  }

  function onKeyDown(key: string) {
    console.debug(`[keyboard] onKeyDown: ${key} (heldLetter: ${heldLetter})`)

    // only if able to take notes
    if (!notes) {
      return
    }

    timerRef.current = window.setTimeout(() => {
      setHeldLetter(key)
    }, 500)
  }

  function onKeyUp(key: string) {
    console.debug(`[keyboard] onKeyUp: ${key} (heldLetter: ${heldLetter})`)
    clearTimeout(timerRef.current)

    if (heldLetter === undefined) {
      publishKeyEvent(key)
    }
  }

  function publishKeyEvent(key: string) {
    console.debug(`[keypress] ${key}`)
    eventBus.publish(createKeypress(key))
  }

  function getLetterCount(key: string): number | undefined {
    if (!notes) {
      return undefined
    }

    if (notes.hasZeroGuess) {
      return undefined
    }

    return notes.letterCounts.get(key)
  }


  //
  // render
  // ======


  return (
    <div className="w-full px-1 pb-2">

      {firstRow()}
      {secondRow()}
      {thirdRow()}

      { heldLetter &&
        <NoteSelect
          visible={heldLetter !== undefined}
          letter={heldLetter}
          onClose={(isMarking, inWord) => {
            if (isMarking) notes?.maybe(heldLetter, inWord)
            setHeldLetter(undefined)
          }}
        />
      }
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
  'mr-1 last-of-type:mr-0 select-none relative'

const largeButtonBase = classNames(buttonBase, 'flex-[1.5] text-xs')

const largeButtonStyle = classNames(largeButtonBase, 'bg-slate-200 flex-[1.5] text-xs')

const knownMarkerStyle = 'absolute bottom-1.5 w-3 m-auto bg-black opacity-20 h-1 rounded-full'

function buttonStyle(key: string, notes: Notes | undefined): string {
  const letterNote = notes?.letters.get(key)
  const inWord = letterNote?.inWord
  
  return classNames(
    buttonBase, 'flex-1 transition-colors duration-300',
    {
      'bg-slate-200 text-slate-600 active:bg-slate-300': inWord === undefined,
      'bg-emerald-400 text-white active:bg-emerald-500': inWord === true,
      'bg-slate-400 text-white active:bg-slate-500': inWord === false
    }
  )
}
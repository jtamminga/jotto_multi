import classNames from 'classnames'
import { ReactNode, useEffect, useRef, useState } from 'react'
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

  useEffect(() => {
    const listener = () => {
      clearTimeout(timerRef.current)
    }

    window.addEventListener('mouseup', listener)
    window.addEventListener('touchend', listener)

    return () => {
      window.removeEventListener('mouseup', listener)
      window.removeEventListener('touchend', listener)
    }
  })
  
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
          onClick={() => onClick('clear')}
        >clear</button>
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
            onMouseDown={() => onLongPress(key)}
            onTouchStart={() => onLongPress(key)}
          >
            {key}

            { notes?.letters.get(key)?.confidence === 'known' &&
              <div className={knownMarkerStyle}></div>
            }
          </button>
        )}
      </>
    )
  }

  function onLongPress(key: string) {
    // only if able to take notes
    if (!notes) {
      return
    }

    timerRef.current = window.setTimeout(() => {
      setHeldLetter(key)
    }, 500)
  }

  function onClick(key: string) {
    eventBus.publish(createKeypress(key, notes?.isMarking ?? false))
  }


  //
  // render
  // ======


  return (
    <div className="w-full pt-1 px-1 pb-2">
      { notes?.isMarking &&
        <div className="text-slate-400 text-sm text-center py-1">
          tap on letters to note for yourself if in word or not
        </div>
      }

      {firstRow()}
      {secondRow()}
      {thirdRow()}

      { heldLetter &&
        <NoteSelect
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
  const isMarking = notes?.isMarking ?? false
  const known = letterNote?.confidence === 'known'
  
  return classNames(
    buttonBase, 'flex-1',
    {
      'bg-slate-200 text-slate-600': inWord === undefined,
      'bg-emerald-400 text-white': inWord === true,
      'bg-slate-400 text-white': inWord === false,
      'opacity-50': known && isMarking
    }
  )
}
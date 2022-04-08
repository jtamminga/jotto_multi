import classnames from 'classnames'
import { MouseEvent, TouchEvent } from 'react'
import { Button } from './button'
import { Header } from './header'

type Props = {
  letter: string,
  onClose: (isMarking: boolean, inWord?: boolean) => void
}

export function NoteSelect({ letter, onClose }: Props) {

  function onRelease(e: MouseEvent | TouchEvent, inWord: boolean | undefined) {
    e.stopPropagation()
    onClose(true, inWord)
  }

  return (
    <div
      className="fixed inset-0 z-10 bg-slate-100/[.8] flex flex-col justify-center items-center p-3"
      onClick={() => onClose(false)}
    >

      <div className="max-w-screen-sm w-full bg-white p-3 rounded drop-shadow-2xl">
        <Header>Is {letter} in the word?</Header>

        <div className="flex space-x-3 mb-3">

          <div
            className={classnames(yesStyle, 'row-start-1')}
            onClick={e => onRelease(e, true)}
          >
            Yes
          </div>

          <div
            className={classnames(noStyle, 'row-start-1')}
            onClick={e => onRelease(e, false)}
          >
            No
          </div>
        </div>

        <div
            className={classnames(itemStyle, 'row-start-2 col-span-2')}
            onClick={e => onRelease(e, undefined)}
          >
            Clear
        </div>
      </div>
    </div>
  )
}

const itemStyle =
  "bg-slate-300 rounded flex items-center justify-center h-12"

const yesStyle =
  "bg-emerald-400 text-white rounded flex items-center justify-center h-24 grow"

const noStyle =
  "bg-slate-400 text-white rounded flex items-center justify-center h-24 grow"

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
      className="fixed inset-0 z-10 bg-white p-3"
    >
      <Header>Is {letter} in the word?</Header>

      <div className="grid grid-cols-2 grid-rows-5 h-full gap-3">

        <div
          className={classnames(itemStyle, 'row-start-1 row-span-2')}
          onClick={e => onRelease(e, true)}
        >
          Yes
        </div>

        <div
          className={classnames(itemStyle, 'row-start-1 row-span-2')}
          onClick={e => onRelease(e, false)}
        >
          No
        </div>

        <div
          className={classnames(itemStyle, 'row-start-3 col-span-2')}
          onClick={e => onRelease(e, undefined)}
        >
          Clear
        </div>

        <Button
          className="row-start-4 col-span-2"
          type="secondary"
          text="Go back"
          onClick={() => onClose(false)}
        />
      </div>
    </div>
  )
}

const itemStyle =
  "bg-slate-300 rounded flex items-center justify-center"
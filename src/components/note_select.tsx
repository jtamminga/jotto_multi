import classnames from 'classnames'
import { MouseEvent, TouchEvent } from 'react'
import { Header } from './header'
import { Modal } from './modal'

type Props = {
  letter: string,
  onClose: (isMarking: boolean, inWord?: boolean) => void
}

export function NoteSelect({ letter, onClose }: Props) {

  return (
    <Modal onClose={() => onClose(false)}>
    
      <Header>Is {letter} in the word?</Header>

      <div className="flex space-x-3 mb-3">

        <div
          className={classnames(yesStyle, 'row-start-1')}
          onClick={e => onClose(true, true)}
        >
          Yes
        </div>

        <div
          className={classnames(noStyle, 'row-start-1')}
          onClick={e => onClose(true, false)}
        >
          No
        </div>
      </div>

      <div
          className={classnames(itemStyle, 'row-start-2 col-span-2')}
          onClick={e => onClose(true, undefined)}
        >
          Clear
      </div>

    </Modal>
  )
}

const itemStyle =
  "bg-slate-300 rounded flex items-center justify-center h-12"

const yesStyle =
  "bg-emerald-400 text-white rounded flex items-center justify-center h-24 grow"

const noStyle =
  "bg-slate-400 text-white rounded flex items-center justify-center h-24 grow"

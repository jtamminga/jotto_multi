import classnames from 'classnames'
import { useRef } from 'react'
import { Header } from './header'
import { Modal } from './modal'

// letter should be required but needed to allow undefined for animations
type Props = {
  visible: boolean,
  letter: string | undefined,
  onClose: (isMarking: boolean, inWord?: boolean) => void
}

export function NoteSelect({ visible, letter, onClose }: Props) {

  // This is used to "save" the value of letter.
  // When the select closes the letter becomes undefined
  // but we want to still see the letter for a split second.
  const letterRef = useRef(letter)
  if (letter) {
    letterRef.current = letter
  }

  return (
    <Modal visible={visible} onClose={() => onClose(false)}>
    
      <Header className="mb-3">
        Is <span className="uppercase p-2 bg-slate-200 rounded">{letterRef.current}</span> in the word?
      </Header>

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

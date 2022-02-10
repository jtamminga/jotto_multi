import { Duration } from 'date-fns'

type Props = {
  duration: Duration,
  className?: string
}

export function Timer({ duration, className = defaultStyle }: Props) {
  const minutes = duration.minutes ? String(duration.minutes).padStart(2, '0') : '00'
  const seconds = duration.seconds ? String(duration.seconds).padStart(2, '0') : '00'

  return (
    <div className={className}>
      {minutes}:{seconds}
    </div>
  )
}

const defaultStyle =
  'bg-slate-100 py-1 w-16 text-center rounded inline-block'
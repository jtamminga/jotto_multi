import { Duration } from 'date-fns'

type Props = {
  duration: Duration,
  className?: string
}

export function Timer({ duration, className }: Props) {
  const minutes = duration.minutes ? String(duration.minutes).padStart(2, '0') : '00'
  const seconds = duration.seconds ? String(duration.seconds).padStart(2, '0') : '00'

  return (
    <div className={className}>
      {minutes}:{seconds}
    </div>
  )
}
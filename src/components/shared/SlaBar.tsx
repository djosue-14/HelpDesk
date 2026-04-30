import type { SlaState } from '@/data/types'

const FILL: Record<SlaState, string> = {
  green:  'bg-green-500',
  yellow: 'bg-amber-400',
  red:    'bg-red-500',
  paused: 'bg-slate-400',
}

interface SlaBarProps {
  pct: number
  state: SlaState
}

export default function SlaBar({ pct, state }: SlaBarProps) {
  return (
    <div className="w-full h-1.5 bg-surface-container-high dark:bg-dark-surface-container-high rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${FILL[state]}`}
        style={{ width: `${Math.min(100, pct)}%` }}
      />
    </div>
  )
}

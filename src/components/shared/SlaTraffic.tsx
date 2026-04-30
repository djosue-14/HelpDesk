import type { SlaState } from '@/data/types'

const DOT: Record<SlaState, string> = {
  green:  'bg-green-500',
  yellow: 'bg-amber-400',
  red:    'bg-red-500',
  paused: 'bg-slate-400',
}

const TEXT: Record<SlaState, string> = {
  green:  'text-green-700 dark:text-green-400',
  yellow: 'text-amber-700 dark:text-amber-400',
  red:    'text-red-700 dark:text-red-400',
  paused: 'text-slate-500 dark:text-slate-400',
}

interface SlaTrafficProps {
  state: SlaState
  label: string
}

export default function SlaTraffic({ state, label }: SlaTrafficProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${TEXT[state]}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${DOT[state]}`} />
      {label}
    </span>
  )
}

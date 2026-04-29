import type { ReactNode } from 'react'
import Icon from './Icon'

interface EmptyStateProps {
  icon?: string
  title: string
  hint?: string
  action?: ReactNode
}

export default function EmptyState({ icon = 'inbox', title, hint, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-3">
      <Icon name={icon} size={48} className="text-slate-300" />
      <p className="text-base font-semibold text-on-surface">{title}</p>
      {hint && <p className="text-sm text-on-surface-variant">{hint}</p>}
      {action}
    </div>
  )
}

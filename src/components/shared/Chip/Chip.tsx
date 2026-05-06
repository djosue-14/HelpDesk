import type { ReactNode } from 'react'
import Icon from '@components/shared/Icon'

export interface ChipProps {
  children: ReactNode
  selected?: boolean
  leading?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export default function Chip({ children, selected, leading, onClick, disabled, className = '' }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center h-8 px-3 gap-2 rounded-lg text-sm font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
        'disabled:opacity-[0.38] disabled:cursor-not-allowed',
        selected
          ? 'bg-primary-container text-on-primary-container hover:opacity-90'
          : 'bg-surface-container-low text-on-surface-variant border border-outline hover:bg-surface-container-high hover:shadow-sm',
        className,
      ].join(' ')}
    >
      {leading && <Icon name={leading} size={18} />}
      {children}
    </button>
  )
}

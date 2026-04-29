import type { ReactNode } from 'react'
import Icon from './Icon'

interface ChipProps {
  selected?: boolean
  leading?: string
  onClick?: () => void
  children: ReactNode
  className?: string
  dashed?: boolean
}

export default function Chip({ selected, leading, onClick, children, className = '', dashed }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
        dashed ? 'border border-dashed border-outline-variant text-on-surface-variant hover:bg-surface-container' : '',
        selected
          ? 'bg-primary text-white'
          : !dashed ? 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high' : '',
        className,
      ].join(' ')}
    >
      {leading && <Icon name={leading} size={15} />}
      {children}
    </button>
  )
}

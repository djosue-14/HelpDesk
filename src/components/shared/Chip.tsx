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
        dashed ? 'border border-dashed border-outline-variant dark:border-dark-outline-variant text-on-surface-variant dark:text-dark-on-surface-variant hover:bg-surface-container dark:hover:bg-dark-surface-container' : '',
        selected
          ? 'bg-primary dark:bg-dark-primary text-white dark:text-dark-on-primary'
          : !dashed ? 'bg-surface-container dark:bg-dark-surface-container text-on-surface-variant dark:text-dark-on-surface-variant hover:bg-surface-container-high dark:hover:bg-dark-surface-container-high' : '',
        className,
      ].join(' ')}
    >
      {leading && <Icon name={leading} size={15} />}
      {children}
    </button>
  )
}

import type { ReactNode, CSSProperties } from 'react'

type Variant = 'outlined' | 'filled'

interface CardProps {
  variant?: Variant
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

const VARIANTS: Record<Variant, string> = {
  outlined: 'bg-white dark:bg-dark-surface-container border border-slate-200 dark:border-dark-outline-variant rounded-xl p-5',
  filled:   'bg-surface-container rounded-xl p-5',
}

export default function Card({ variant = 'outlined', children, className = '', style, onClick }: CardProps) {
  return (
    <div
      className={`${VARIANTS[variant]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

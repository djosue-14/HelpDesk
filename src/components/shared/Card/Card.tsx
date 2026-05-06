import type { ReactNode, CSSProperties } from 'react'

type Variant = 'outlined' | 'filled' | 'elevated'

export interface CardProps {
  variant?: Variant
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

const VARIANTS: Record<Variant, string> = {
  outlined: 'bg-surface-container-lowest dark:bg-dark-surface-container border border-outline-variant dark:border-dark-outline-variant rounded-xl p-5',
  filled:   'bg-surface-container-highest dark:bg-dark-surface-container-high rounded-xl p-5',
  elevated: 'bg-surface-container-lowest dark:bg-dark-surface-container rounded-xl p-5 shadow-[0px_1px_3px_1px_rgba(0,0,0,0.15),0px_1px_2px_0px_rgba(0,0,0,0.30)] hover:shadow-[0px_2px_6px_2px_rgba(0,0,0,0.15),0px_1px_2px_0px_rgba(0,0,0,0.30)]',
}

export default function Card({ variant = 'outlined', children, className = '', style, onClick }: CardProps) {
  return (
    <div
      className={`transition-all ${VARIANTS[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

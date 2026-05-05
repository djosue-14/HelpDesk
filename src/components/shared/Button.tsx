import type { ReactNode } from 'react'
import Icon from './Icon'

type Variant = 'filled' | 'outlined' | 'text' | 'tonal'

interface ButtonProps {
  variant?: Variant
  leading?: string
  trailing?: string
  size?: 'sm' | 'md'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  children?: ReactNode
  className?: string
}

const BASE = 'inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'

const VARIANTS: Record<Variant, string> = {
  filled:   'bg-primary text-white dark:text-dark-on-primary hover:opacity-90 px-4 py-2 text-sm',
  outlined: 'border border-primary text-primary hover:bg-primary/5 px-4 py-2 text-sm',
  text:     'text-primary hover:bg-primary/5 px-3 py-2 text-sm',
  tonal:    'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 px-4 py-2 text-sm',
}

const SM: Record<Variant, string> = {
  filled:   'px-3 py-1.5 text-xs',
  outlined: 'px-3 py-1.5 text-xs',
  text:     'px-2 py-1.5 text-xs',
  tonal:    'px-3 py-1.5 text-xs',
}

export default function Button({
  variant = 'filled',
  leading,
  trailing,
  size = 'md',
  disabled,
  type = 'button',
  onClick,
  children,
  className = '',
}: ButtonProps) {
  const iconSize = size === 'sm' ? 16 : 18
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${BASE} ${VARIANTS[variant]} ${size === 'sm' ? SM[variant] : ''} ${className}`}
    >
      {leading  && <Icon name={leading}  size={iconSize} />}
      {children}
      {trailing && <Icon name={trailing} size={iconSize} />}
    </button>
  )
}

import { useState } from 'react'
import Icon from './Icon'

interface StarsProps {
  value: number
  size?: number
  dim?: boolean
}

export function Stars({ value, size = 18, dim }: StarsProps) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${dim ? 'opacity-40' : ''}`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Icon key={i} name="star" size={size} fill={i <= value ? 1 : 0}
          className={i <= value ? 'text-amber-400' : 'text-slate-300 dark:text-dark-on-surface-variant/40'} />
      ))}
    </span>
  )
}

interface StarsInputProps {
  value: number
  onChange: (v: number) => void
}

export function StarsInput({ value, onChange }: StarsInputProps) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i} type="button"
          className="transition-transform hover:scale-110"
          onMouseEnter={() => setHover(i)}
          onClick={() => onChange(i)}
        >
          <Icon name="star" size={36} fill={i <= (hover || value) ? 1 : 0}
            className={i <= (hover || value) ? 'text-amber-400' : 'text-slate-300 dark:text-dark-on-surface-variant/40'} />
        </button>
      ))}
    </div>
  )
}

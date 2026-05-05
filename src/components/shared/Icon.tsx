import type { CSSProperties } from 'react'

interface IconProps {
  name: string
  size?: number
  fill?: 0 | 1
  weight?: number
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

export default function Icon({ name, size = 24, fill = 0, weight = 400, className = '', style, onClick }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
        ...style,
      }}
      onClick={onClick}
    >
      {name}
    </span>
  )
}

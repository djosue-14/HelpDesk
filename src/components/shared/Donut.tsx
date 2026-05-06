interface DonutSlice {
  count: number
  color: string
}

interface DonutProps {
  data: DonutSlice[]
  size?: number
  thickness?: number
  total?: number
}

export default function Donut({ data, size = 160, thickness = 22, total }: DonutProps) {
  const sum = total ?? data.reduce((a, d) => a + d.count, 0)
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  let acc = 0

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        className="stroke-surface-container-high dark:stroke-dark-surface-container-high"
        strokeWidth={thickness}
      />
      {sum > 0 && data.map((d, i) => {
        const len = (d.count / sum) * c
        const dasharray = `${len} ${c - len}`
        const offset = c - acc
        acc += len
        return (
          <circle key={i}
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={d.color} strokeWidth={thickness}
            strokeDasharray={dasharray} strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            strokeLinecap="butt"
          />
        )
      })}
      <text x={size / 2} y={size / 2 - 4} textAnchor="middle"
        fontSize="22" fontWeight="500" fontFamily="Inter"
        className="fill-on-surface dark:fill-dark-on-surface">{sum}</text>
      <text x={size / 2} y={size / 2 + 18} textAnchor="middle"
        fontSize="11" fontFamily="Inter"
        className="fill-on-surface-variant dark:fill-dark-on-surface-variant"
        style={{ textTransform: 'uppercase', letterSpacing: 1 }}>tickets</text>
    </svg>
  )
}

export function heatColor(count: number, max: number): string {
  if (count === 0) return 'transparent'
  const t = Math.min(1, count / max)
  return `color-mix(in oklab, var(--color-primary) ${Math.round(15 + t * 65)}%, var(--color-surface))`
}

export function heatTextColor(count: number, max: number): string {
  if (count === 0) return 'var(--color-outline)'
  const t = count / max
  return t > 0.55 ? 'white' : 'var(--color-on-surface)'
}

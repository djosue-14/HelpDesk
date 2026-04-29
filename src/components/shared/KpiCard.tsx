import Icon from './Icon'

interface KpiCardProps {
  icon: string
  label: string
  value: string | number
  delta?: string
  deltaTone?: 'up' | 'down'
  hint?: string
  iconBg?: string
  iconColor?: string
}

export default function KpiCard({ icon, label, value, delta, deltaTone, hint, iconBg, iconColor }: KpiCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-[2px_2px_8px_rgba(42,99,138,0.05)] hover:border-primary/20 transition-all">
      <div className="flex items-start justify-between mb-3">
        <span
          className="p-2 rounded-lg flex items-center justify-center"
          style={{
            background: iconBg ?? 'var(--color-primary-container)',
            color: iconColor ?? 'var(--color-on-primary-container)',
          }}
        >
          <Icon name={icon} size={22} fill={1} />
        </span>
        {delta && (
          <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded ${
            deltaTone === 'up' ? 'text-green-700 bg-green-50' : deltaTone === 'down' ? 'text-red-700 bg-red-50' : 'text-slate-600 bg-slate-100'
          }`}>
            {deltaTone === 'up'   && <Icon name="trending_up"   size={13} />}
            {deltaTone === 'down' && <Icon name="trending_down" size={13} />}
            {delta}
          </span>
        )}
      </div>
      <p className="text-xs font-medium text-secondary mb-1">{label}</p>
      <p className="text-[26px] leading-8 font-semibold text-on-surface">{value}</p>
      {hint && <p className="text-xs text-on-surface-variant mt-1">{hint}</p>}
    </div>
  )
}

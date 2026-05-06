import Icon from '@components/shared/Icon'

export interface TabItem {
  id: string
  label: string
  icon?: string
  badge?: string | number
  disabled?: boolean
}

export interface TabsProps {
  tabs: TabItem[]
  value: string
  onChange: (id: string) => void
  variant?: 'primary' | 'secondary'
  className?: string
}

const ITEM_BASE =
  'relative flex items-center justify-center gap-1.5 px-4 h-12 text-sm font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none'

export default function Tabs({ tabs, value, onChange, variant = 'primary', className = '' }: TabsProps) {
  return (
    <div className={`flex border-b border-outline-variant dark:border-dark-outline-variant ${className}`}>
      {tabs.map(tab => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={[
              ITEM_BASE,
              active
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-t-lg',
            ].join(' ')}
          >
            {variant === 'primary' && tab.icon && (
              <Icon name={tab.icon} size={16} fill={active ? 1 : 0} />
            )}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="text-xs opacity-60">({tab.badge})</span>
            )}
            {active && (
              <span
                className={[
                  'absolute bottom-0 left-0 w-full bg-primary',
                  variant === 'primary' ? 'h-[3px] rounded-t' : 'h-[2px]',
                ].join(' ')}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

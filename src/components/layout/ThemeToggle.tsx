import type { ThemeMode } from '@hooks/useTheme'
import Icon from '@components/shared/Icon'

interface ThemeToggleProps {
  theme: ThemeMode
  onThemeChange: (theme: ThemeMode) => void
}

const OPTIONS: { value: ThemeMode; icon: string; label: string }[] = [
  { value: 'light',  icon: 'light_mode',         label: 'Claro'   },
  { value: 'dark',   icon: 'dark_mode',           label: 'Oscuro'  },
  { value: 'system', icon: 'settings_brightness', label: 'Sistema' },
]

export default function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  return (
    <div className="flex items-center justify-center gap-1 p-1 bg-slate-100 dark:bg-dark-surface-container-high rounded-xl">
      {OPTIONS.map(opt => {
        const active = theme === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onThemeChange(opt.value)}
            title={opt.label}
            aria-label={opt.label}
            className={[
              'flex-1 flex items-center justify-center p-2 rounded-lg transition-all duration-200',
              active
                ? 'bg-white dark:bg-dark-secondary-container shadow-sm text-primary dark:text-dark-on-secondary-container'
                : 'text-slate-400 dark:text-dark-on-surface-variant hover:bg-white/60 dark:hover:bg-dark-surface-container-highest hover:text-slate-600',
            ].join(' ')}
          >
            <Icon name={opt.icon} size={18} />
          </button>
        )
      })}
    </div>
  )
}

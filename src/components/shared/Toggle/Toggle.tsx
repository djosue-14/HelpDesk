import { Switch } from '@headlessui/react'
import type { ReactNode } from 'react'
import Icon from '@components/shared/Icon'

export interface ToggleProps {
  checked: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  withIcon?: boolean
  label?: ReactNode
  description?: string
  className?: string
}

export default function Toggle({
  checked,
  onChange,
  disabled = false,
  withIcon = false,
  label,
  description,
  className = '',
}: ToggleProps) {
  const sw = (
    <Switch
      checked={checked}
      onChange={onChange ?? (() => {})}
      disabled={disabled || !onChange}
      className={[
        'group relative inline-flex shrink-0 items-center cursor-pointer',
        // Track: 52×32px per MD3 spec
        'w-[52px] h-8 rounded-full',
        'transition-all duration-[200ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]',
        'focus:outline-none',
        'disabled:opacity-[0.38] disabled:cursor-not-allowed',
        checked
          ? 'bg-primary-container dark:bg-dark-primary-container'
          : 'bg-surface-variant dark:bg-dark-surface-variant border-2 border-outline dark:border-dark-outline',
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className={[
          'absolute rounded-full flex items-center justify-center',
          'transition-all duration-[200ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]',
          // Hover ripple usando token del tema
          'group-hover:ring-[10px] group-hover:ring-primary-container/[0.08]',
          // Rest: 24×24px handle — focus: grows to 28×28px and repositions
          checked
            ? [
                'left-[24px] w-6 h-6',
                'bg-white dark:bg-dark-on-primary-container',
                'group-focus-visible:left-[22px] group-focus-visible:w-7 group-focus-visible:h-7',
              ].join(' ')
            : [
                'left-[4px] w-6 h-6',
                'bg-outline dark:bg-dark-outline',
                'group-focus-visible:left-[2px] group-focus-visible:w-7 group-focus-visible:h-7',
              ].join(' '),
        ].join(' ')}
      >
        {withIcon && checked && (
          <Icon name="check" size={14} className="text-primary-container dark:text-dark-primary-container" />
        )}
      </span>
    </Switch>
  )

  if (!label && !description) {
    return <span className={className}>{sw}</span>
  }

  return (
    <label
      className={[
        'flex items-start gap-3',
        !disabled && onChange ? 'cursor-pointer' : '',
        className,
      ].join(' ')}
    >
      <span className="mt-0.5 shrink-0">{sw}</span>
      <span>
        {label && <span className="block text-sm font-semibold text-on-surface">{label}</span>}
        {description && <span className="block text-xs text-on-surface-variant mt-0.5">{description}</span>}
      </span>
    </label>
  )
}

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import Icon from '@components/shared/Icon'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectProps {
  variant?: 'outlined' | 'filled'
  size?: 'sm' | 'md'
  label?: string
  placeholder?: string
  options: SelectOption[]
  value?: string | number
  onChange?: (value: string | number) => void
  required?: boolean
  disabled?: boolean
  error?: boolean
  helperText?: string
  name?: string
  id?: string
  className?: string
}

export default function Select({
  variant = 'outlined',
  size = 'md',
  label,
  placeholder,
  options,
  value,
  onChange,
  required,
  disabled,
  error,
  helperText,
  name,
  id,
  className = '',
}: SelectProps) {
  const isOutlined = variant === 'outlined'
  const isMd = size === 'md'
  const hasValue = value !== undefined && value !== null && value !== ''
  const selectedOption = options.find(o => String(o.value) === String(value))

  return (
    <div className={`w-full ${className}`}>
      <Listbox
        value={value ?? ''}
        onChange={(v: unknown) => onChange?.(v as string | number)}
        disabled={disabled}
        name={name}
      >
        {({ open }: { open: boolean }) => {
          const isFloated = open || hasValue

          /* ── sm variant ── */
          const smBtnCls = [
            'h-9 w-full px-3 rounded-lg flex items-center justify-between gap-2',
            'text-sm text-left outline-none cursor-pointer',
            'bg-surface-container-low border',
            'transition-colors duration-100',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            error
              ? open ? 'border-2 border-error' : 'border border-error'
              : open ? 'border-primary' : 'border-outline-variant hover:border-outline',
          ].join(' ')

          /* ── md outlined variant ── */
          const mdOutlinedBtnCls = [
            'h-14 w-full rounded px-4 flex items-center justify-between',
            'text-sm text-left outline-none cursor-pointer',
            'transition-[border-color,border-width] duration-100',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            error
              ? open ? 'border-2 border-error' : 'border border-error'
              : open ? 'border-2 border-primary' : 'border border-outline hover:border-on-surface',
          ].join(' ')

          /* ── md filled variant ── */
          const mdFilledBtnCls = [
            'h-14 w-full bg-surface-container rounded-t px-4',
            'flex items-center justify-between',
            'text-sm text-left outline-none cursor-pointer',
            'transition-[border-color,border-width] duration-100',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            error
              ? open ? 'border-b-2 border-error' : 'border-b border-error'
              : open ? 'border-b-2 border-primary' : 'border-b border-outline',
          ].join(' ')

          const btnCls = !isMd ? smBtnCls : isOutlined ? mdOutlinedBtnCls : mdFilledBtnCls

          /* ── Label classes (outlined + md only) ── */
          const labelColor = error ? 'text-error' : open ? 'text-primary' : 'text-on-surface-variant'
          const labelPos = isFloated
            ? 'top-0 -translate-y-1/2 text-xs font-medium'
            : 'top-1/2 -translate-y-1/2 text-sm'
          const labelBg = isFloated && isOutlined
            ? 'bg-white dark:bg-surface-container px-1'
            : ''

          /* ── Display content ── */
          const displayText = selectedOption?.label
            ?? (isMd && label ? (open && placeholder ? placeholder : '') : (placeholder ?? ''))
          const displayCls = selectedOption ? 'text-on-surface truncate' : 'text-on-surface-variant truncate'

          const arrowCls = [
            'shrink-0 transition-transform duration-150',
            open ? 'rotate-180' : '',
            error ? 'text-error' : 'text-on-surface-variant',
          ].join(' ')

          return (
            <>
              <div className={`relative ${isMd ? 'h-14' : 'h-9'}`}>

                {/* Filled md: stacked label + value inside button */}
                {isMd && !isOutlined ? (
                  <ListboxButton id={id} className={btnCls}>
                    <div className="flex flex-col min-w-0 flex-1">
                      {label && (
                        <span className={`text-xs font-medium leading-none mb-1 ${labelColor}`}>
                          {label}{required && <span className="text-error ml-0.5">*</span>}
                        </span>
                      )}
                      <span className={displayCls}>{displayText || '\u00A0'}</span>
                    </div>
                    <Icon name="arrow_drop_down" size={20} className={arrowCls} />
                  </ListboxButton>
                ) : (
                  /* Outlined md or sm: value in button, label floats outside */
                  <ListboxButton id={id} className={btnCls}>
                    <span className={displayCls}>{displayText || (isMd && label ? '\u00A0' : '')}</span>
                    <Icon name="arrow_drop_down" size={20} className={arrowCls} />
                  </ListboxButton>
                )}

                {/* Floating label — outlined md only */}
                {isMd && isOutlined && label && (
                  <label
                    htmlFor={id}
                    className={[
                      'absolute left-4 pointer-events-none select-none leading-none',
                      labelPos,
                      labelColor,
                      labelBg,
                      'transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
                    ].join(' ')}
                  >
                    {label}
                    {required && <span className="text-error ml-0.5">*</span>}
                  </label>
                )}

                {/* Dropdown panel */}
                <ListboxOptions
                  anchor="bottom start"
                  className={[
                    'z-50 w-[var(--button-width)] min-w-max',
                    'bg-white dark:bg-surface-container',
                    'rounded-lg py-2',
                    'shadow-lg border border-outline-variant/20',
                    'focus:outline-none',
                    '[--anchor-gap:4px]',
                    'transition origin-top',
                    'data-closed:opacity-0 data-closed:scale-95',
                    'data-enter:duration-150 data-enter:ease-out',
                    'data-leave:duration-75 data-leave:ease-in',
                  ].join(' ')}
                >
                  {options.map(opt => (
                    <ListboxOption
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled}
                      className="h-12 px-3 flex items-center justify-between gap-3 text-sm cursor-pointer select-none data-focus:bg-surface-container-highest data-selected:bg-secondary-container/30 data-selected:text-primary data-disabled:opacity-40 data-disabled:cursor-not-allowed"
                    >
                      {({ selected }: { selected: boolean }) => (
                        <>
                          <span className={selected ? 'font-semibold' : ''}>{opt.label}</span>
                          {selected && <Icon name="check" size={18} className="text-primary shrink-0" />}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>

              {helperText && (
                <p className={`flex items-center gap-1 text-xs mt-1 px-1 ${error ? 'text-error' : 'text-on-surface-variant'}`}>
                  {error && <Icon name="error" size={14} className="shrink-0" />}
                  {helperText}
                </p>
              )}
            </>
          )
        }}
      </Listbox>
    </div>
  )
}

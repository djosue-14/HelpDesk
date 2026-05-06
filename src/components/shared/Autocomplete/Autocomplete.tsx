import { useState, useRef, forwardRef, type ReactNode } from 'react'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import Icon from '@components/shared/Icon'

export interface AutocompleteOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}

export interface AutocompleteProps {
  variant?: 'outlined' | 'filled'
  size?: 'sm' | 'md'
  label?: string
  placeholder?: string
  options: AutocompleteOption[]
  value?: string | number | null
  defaultValue?: string | number | null
  onChange?: (value: string | number | null) => void
  onQuery?: (query: string) => void
  displayValue?: (value: string | number | null) => string
  filterFunction?: (options: AutocompleteOption[], query: string) => AutocompleteOption[]
  required?: boolean
  disabled?: boolean
  error?: boolean
  errorText?: string
  helperText?: string
  leadingIcon?: ReactNode
  loading?: boolean
  clearable?: boolean
  nullable?: boolean
  onClear?: () => void
  name?: string
  id?: string
  'aria-label'?: string
  className?: string
}

const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  function Autocomplete(
    {
      variant = 'outlined',
      size = 'md',
      label,
      placeholder,
      options,
      value,
      onChange,
      onQuery,
      displayValue: displayValueProp,
      filterFunction,
      required,
      disabled,
      error,
      errorText,
      helperText,
      leadingIcon,
      loading = false,
      clearable = true,
      nullable = true,
      onClear,
      name,
      id,
      'aria-label': ariaLabel,
      className = '',
    },
    ref,
  ) {
    const [query, setQuery] = useState('')
    const comboButtonRef = useRef<HTMLButtonElement>(null)

    const isOutlined = variant === 'outlined'
    const isMd = size === 'md'
    const hasValue = value !== undefined && value !== null && value !== ''
    const showClear = clearable && nullable && !loading && !disabled && (hasValue || query !== '')

    /* ── Filtering ── */
    const defaultFilter = (opts: AutocompleteOption[], q: string) =>
      q.trim() === ''
        ? opts
        : opts.filter(
            o =>
              o.label.toLowerCase().includes(q.toLowerCase()) ||
              o.description?.toLowerCase().includes(q.toLowerCase()),
          )

    const filteredOptions = (filterFunction ?? defaultFilter)(options, query)

    /* ── Display value ── */
    const defaultDisplayValue = (v: string | number | null) =>
      options.find(o => String(o.value) === String(v))?.label ?? ''

    const resolveDisplay = displayValueProp ?? defaultDisplayValue

    /* ── Handlers ── */
    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault()
      setQuery('')
      onChange?.(null)
      onClear?.()
    }

    /* ── Padding accounts for leading icon ── */
    const pl = leadingIcon ? 'pl-12' : 'pl-4'

    /* ── Input classes ── */
    const base = [
      'peer w-full text-sm text-on-surface outline-none',
      'transition-[border-color,border-width] duration-100',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      pl,
      'pr-10',
    ].join(' ')

    const mdOutlinedInputCls = [
      base,
      'h-14 rounded bg-transparent',
      'placeholder:text-transparent focus:placeholder:text-on-surface-variant/60',
      error
        ? 'border border-error focus:border-2 focus:border-error'
        : 'border border-outline focus:border-2 focus:border-primary hover:border-on-surface',
    ].join(' ')

    const mdFilledInputCls = [
      base,
      'h-14 rounded-t bg-surface-container',
      label ? 'pt-6 pb-2' : 'py-4',
      'placeholder:text-transparent focus:placeholder:text-on-surface-variant/60',
      error
        ? 'border-b border-error focus:border-b-2 focus:border-error'
        : 'border-b border-outline focus:border-b-2 focus:border-primary',
    ].join(' ')

    const smInputCls = [
      base,
      'h-9 rounded-lg bg-surface-container-low border',
      error
        ? 'border-error focus:border-2 focus:border-error'
        : 'border-outline-variant focus:border-primary hover:border-outline',
    ].join(' ')

    const inputCls = !isMd ? smInputCls : isOutlined ? mdOutlinedInputCls : mdFilledInputCls

    /* ── Label — floating (outlined md) identical to TextField peer trick ── */
    const labelLeft = leadingIcon
      ? 'left-12 peer-focus:left-4 peer-[&:not(:placeholder-shown)]:left-4'
      : 'left-4'

    const labelColor = error
      ? 'text-error peer-focus:text-error peer-[&:not(:placeholder-shown)]:text-error'
      : [
          'text-on-surface-variant',
          'peer-focus:text-primary',
          'peer-[&:not(:placeholder-shown)]:text-on-surface-variant',
        ].join(' ')

    const labelBg = [
      'peer-focus:bg-white peer-focus:dark:bg-surface-container peer-focus:px-1',
      'peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:dark:bg-surface-container peer-[&:not(:placeholder-shown)]:px-1',
    ].join(' ')

    const labelFloat = [
      'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium',
      'peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:-translate-y-1/2',
      'peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:font-medium',
    ].join(' ')

    const iconCls = error ? 'text-error' : 'text-on-surface-variant'
    const supportingText = error && errorText ? errorText : helperText

    return (
      /*
       * The outer div is `relative` so that ComboboxOptions with `absolute z-50 w-full`
       * anchors to the full component width — not to an inner sub-container.
       */
      <div className={`w-full relative ${className}`}>
        <Combobox
          value={value != null ? String(value) : ''}
          onChange={(v: unknown) => {
            setQuery('')
            onChange?.(v as string | number)
          }}
          disabled={disabled}
          name={name}
        >
          {({ open }: { open: boolean }) => (
            <>
              {/* ── Trigger row ── */}
              <div className={`relative ${isMd ? 'h-14' : 'h-9'}`}>

                {/* Leading icon */}
                {leadingIcon && (
                  <div
                    className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none ${iconCls}`}
                  >
                    {leadingIcon}
                  </div>
                )}

                {/* Input */}
                <ComboboxInput
                  ref={ref}
                  id={id}
                  aria-label={ariaLabel}
                  className={inputCls}
                  displayValue={(v: unknown) =>
                    resolveDisplay(v as string | number | null)
                  }
                  onChange={e => {
                    setQuery(e.target.value)
                    onQuery?.(e.target.value)
                  }}
                  onClick={() => { if (!open) comboButtonRef.current?.click() }}
                  placeholder={placeholder ?? (isMd && label ? ' ' : '')}
                />

                {/* Floating label — outlined md */}
                {isMd && isOutlined && label && (
                  <label
                    htmlFor={id}
                    className={[
                      'absolute pointer-events-none select-none leading-none',
                      'top-1/2 -translate-y-1/2 text-sm',
                      labelLeft,
                      labelColor,
                      labelBg,
                      labelFloat,
                      'transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
                    ].join(' ')}
                  >
                    {label}
                    {required && <span className="text-error ml-0.5">*</span>}
                  </label>
                )}

                {/* Static label — filled md, always small at top */}
                {isMd && !isOutlined && label && (
                  <label
                    htmlFor={id}
                    className={[
                      'absolute top-2 pointer-events-none select-none leading-none',
                      leadingIcon ? 'left-12' : 'left-4',
                      'text-xs font-medium',
                      error
                        ? 'text-error'
                        : 'text-on-surface-variant peer-focus:text-primary',
                    ].join(' ')}
                  >
                    {label}
                    {required && <span className="text-error ml-0.5">*</span>}
                  </label>
                )}

                {/* Loading spinner — replaces trailing controls */}
                {loading && (
                  <span
                    className={`absolute right-2 top-1/2 -translate-y-1/2 ${iconCls}`}
                  >
                    <Icon name="progress_activity" size={18} className="animate-spin" />
                  </span>
                )}

                {/* Arrow — always mounted for keyboard access, invisible when clear is shown */}
                {!loading && (
                  <ComboboxButton
                    ref={comboButtonRef}
                    className={[
                      'absolute right-1 top-1/2 -translate-y-1/2',
                      'p-1.5 rounded-full transition-colors hover:bg-on-surface/8',
                      showClear ? 'invisible pointer-events-none' : '',
                    ].join(' ')}
                  >
                    <Icon
                      name="arrow_drop_down"
                      size={20}
                      className={`transition-transform duration-150 ${open ? 'rotate-180' : ''} ${iconCls}`}
                    />
                  </ComboboxButton>
                )}

                {/* Clear — overlays the arrow at the same position */}
                {showClear && (
                  <button
                    type="button"
                    onMouseDown={handleClear}
                    tabIndex={-1}
                    className={[
                      'absolute right-1 top-1/2 -translate-y-1/2',
                      'p-1.5 rounded-full transition-colors hover:bg-on-surface/8',
                      iconCls,
                    ].join(' ')}
                  >
                    <Icon name="close" size={16} />
                  </button>
                )}
              </div>

              {/* ── Dropdown — portal via anchor, never clipped by parent overflow ── */}
              <ComboboxOptions
                anchor="bottom"
                className={[
                  'z-50 w-[var(--input-width)]',
                  '[--anchor-gap:4px]',
                  'max-h-60 overflow-y-auto',
                  'bg-white dark:bg-surface-container text-on-surface',
                  'rounded-lg py-2',
                  'shadow-lg border border-outline-variant/20',
                  'focus:outline-none',
                  'transition origin-top',
                  'data-closed:opacity-0 data-closed:scale-95',
                  'data-enter:duration-150 data-enter:ease-out',
                  'data-leave:duration-75 data-leave:ease-in',
                ].join(' ')}
              >
                {filteredOptions.length === 0 ? (
                  <div className="py-3 px-4 text-sm text-on-surface-variant italic select-none">
                    {query ? `Sin resultados para "${query}"` : 'Sin opciones disponibles'}
                  </div>
                ) : (
                  filteredOptions.map(opt => (
                    <ComboboxOption
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled}
                      className="px-3 flex items-center justify-between gap-3 text-sm cursor-pointer select-none data-focus:bg-surface-container-highest data-selected:bg-secondary-container/30 data-selected:text-primary data-disabled:opacity-40 data-disabled:cursor-not-allowed"
                    >
                      {({ selected }: { selected: boolean }) => (
                        <>
                          <div
                            className={`flex flex-col min-w-0 ${opt.description ? 'py-2.5' : 'h-12 justify-center'}`}
                          >
                            <span className={`truncate ${selected ? 'font-semibold' : ''}`}>
                              {opt.label}
                            </span>
                            {opt.description && (
                              <span className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                                {opt.description}
                              </span>
                            )}
                          </div>
                          {selected && (
                            <Icon name="check" size={18} className="text-primary shrink-0" />
                          )}
                        </>
                      )}
                    </ComboboxOption>
                  ))
                )}
              </ComboboxOptions>

              {/* ── Supporting text ── */}
              {supportingText && (
                <p
                  className={`flex items-center gap-1 text-xs mt-1 px-1 ${
                    error && errorText ? 'text-error' : 'text-on-surface-variant'
                  }`}
                >
                  {error && errorText && (
                    <Icon name="error" size={14} className="shrink-0" />
                  )}
                  {supportingText}
                </p>
              )}
            </>
          )}
        </Combobox>
      </div>
    )
  },
)

Autocomplete.displayName = 'Autocomplete'

export default Autocomplete

import { Field, Input, Textarea, Label } from '@headlessui/react'
import Icon from '@components/shared/Icon'

export interface TextFieldProps {
  variant?: 'outlined' | 'filled'
  label?: string
  type?: string
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  error?: boolean
  helperText?: string
  maxLength?: number
  leadingIcon?: string
  trailingIcon?: string
  onTrailingIconClick?: () => void
  multiline?: boolean
  rows?: number
  name?: string
  id?: string
  autoFocus?: boolean
  className?: string
}

export default function TextField({
  variant = 'outlined',
  label,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  required,
  disabled,
  readOnly,
  error,
  helperText,
  maxLength,
  leadingIcon,
  trailingIcon,
  onTrailingIconClick,
  multiline,
  rows = 3,
  name,
  id,
  autoFocus,
  className = '',
}: TextFieldProps) {
  const isOutlined = variant === 'outlined'
  const hasLabel = Boolean(label)
  const pl = leadingIcon ? 'pl-12' : 'pl-4'
  const pr = trailingIcon ? 'pr-12' : 'pr-4'

  /* ── input / textarea classes ── */
  const base = [
    'peer w-full text-sm text-on-surface outline-none bg-transparent',
    'transition-[border-color,border-width] duration-100',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    'placeholder:text-transparent focus:placeholder:text-on-surface-variant/60',
    pl, pr,
  ].join(' ')

  const outlinedCls = [
    base,
    hasLabel ? (multiline ? 'pt-6 pb-2' : 'py-4') : 'py-3.5',
    'rounded',
    error
      ? 'border border-error focus:border-2 focus:border-error'
      : 'border border-outline focus:border-2 focus:border-primary',
  ].join(' ')

  const filledCls = [
    base,
    'bg-surface-container rounded-t',
    hasLabel ? 'pt-6 pb-2' : 'py-4',
    error
      ? 'border-b border-error focus:border-b-2 focus:border-error'
      : 'border-b border-outline focus:border-b-2 focus:border-primary',
  ].join(' ')

  const inputCls = isOutlined ? outlinedCls : filledCls

  /* ── label classes ── */
  const labelColor = error
    ? 'text-error peer-focus:text-error peer-[&:not(:placeholder-shown)]:text-error'
    : [
        'text-on-surface-variant',
        'peer-focus:text-primary',
        'peer-[&:not(:placeholder-shown)]:text-on-surface-variant',
      ].join(' ')

  const labelBg = isOutlined
    ? [
        'peer-focus:bg-white peer-focus:dark:bg-surface-container peer-focus:px-1',
        'peer-[&:not(:placeholder-shown)]:bg-white peer-[&:not(:placeholder-shown)]:dark:bg-surface-container peer-[&:not(:placeholder-shown)]:px-1',
      ].join(' ')
    : ''

  const labelLeft = leadingIcon
    ? 'left-12 peer-focus:left-4 peer-[&:not(:placeholder-shown)]:left-4'
    : 'left-4'

  const labelRest = multiline ? 'top-4 translate-y-0' : 'top-1/2 -translate-y-1/2'

  const labelFloat = [
    'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium',
    'peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:-translate-y-1/2',
    'peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:font-medium',
  ].join(' ')

  const iconTopCls = multiline ? 'top-4' : 'top-1/2 -translate-y-1/2'

  return (
    <div className={`w-full ${className}`}>
      <Field
        className={`relative w-full ${!multiline ? 'h-14' : ''}`}
        disabled={disabled}
      >
        {leadingIcon && (
          <Icon
            name={leadingIcon}
            size={20}
            className={`absolute left-3 z-10 text-on-surface-variant ${iconTopCls}`}
          />
        )}

        {multiline ? (
          <Textarea
            name={name}
            id={id}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            onBlur={onBlur as React.FocusEventHandler<HTMLTextAreaElement>}
            rows={rows}
            maxLength={maxLength}
            readOnly={readOnly}
            autoFocus={autoFocus}
            placeholder={placeholder ?? ' '}
            className={`${inputCls} resize-none`}
          />
        ) : (
          <Input
            type={type}
            name={name}
            id={id}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
            maxLength={maxLength}
            readOnly={readOnly}
            autoFocus={autoFocus}
            placeholder={placeholder ?? ' '}
            className={inputCls}
          />
        )}

        {hasLabel && (
          <Label className={[
            'absolute pointer-events-none select-none leading-none',
            labelRest,
            labelLeft,
            labelColor,
            labelBg,
            labelFloat,
            'transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
          ].join(' ')}>
            {label}
            {required && <span className="text-error ml-0.5">*</span>}
          </Label>
        )}

        {trailingIcon && (
          <Icon
            name={trailingIcon}
            size={20}
            className={[
              'absolute right-3',
              iconTopCls,
              error ? 'text-error' : 'text-on-surface-variant',
              onTrailingIconClick ? 'cursor-pointer hover:text-on-surface' : '',
            ].join(' ')}
            onClick={onTrailingIconClick}
          />
        )}
      </Field>

      {helperText && (
        <p className={`text-xs mt-1 px-1 ${error ? 'text-error' : 'text-on-surface-variant'}`}>
          {helperText}
        </p>
      )}
    </div>
  )
}

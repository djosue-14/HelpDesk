import { Dialog as HuiDialog, DialogPanel } from '@headlessui/react'
import type { ReactNode } from 'react'
import Icon from '@components/shared/Icon'

/* ── Sub-components ── */

export function DialogHead({
  icon,
  title,
  onClose,
}: {
  icon: string
  title: string
  onClose: () => void
}) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-dark-outline-variant shrink-0">
      <Icon name={icon} size={22} className="text-primary" />
      <h3 className="flex-1 text-base font-semibold text-on-surface">{title}</h3>
      <button
        type="button"
        onClick={onClose}
        className="p-1 text-slate-400 dark:text-dark-on-surface-variant hover:text-on-surface rounded transition-colors"
      >
        <Icon name="close" size={20} />
      </button>
    </div>
  )
}

export function DialogBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
      {children}
    </div>
  )
}

export function DialogFoot({ children }: { children: ReactNode }) {
  return (
    <div className="shrink-0 flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 dark:border-dark-outline-variant">
      {children}
    </div>
  )
}

export function DialogField({
  label,
  required,
  helper,
  children,
}: {
  label: string
  required?: boolean
  helper?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-on-surface-variant">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {children}
      {helper && <span className="text-xs text-on-surface-variant">{helper}</span>}
    </div>
  )
}

/* ── Dialog shell ── */

export interface DialogProps {
  open?: boolean
  onClose: () => void
  wide?: boolean
  children: ReactNode
}

export default function Dialog({ open = true, onClose, wide = false, children }: DialogProps) {
  return (
    <HuiDialog open={open} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Centering container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className={[
            'flex flex-col max-h-[90vh] overflow-hidden',
            'bg-white dark:bg-dark-surface-container',
            'rounded-[28px] shadow-2xl',
            wide ? 'w-[720px]' : 'w-[480px]',
          ].join(' ')}
        >
          {children}
        </DialogPanel>
      </div>
    </HuiDialog>
  )
}

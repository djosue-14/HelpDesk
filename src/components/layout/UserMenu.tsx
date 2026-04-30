import { useState, useRef, useEffect } from 'react'
import Icon from '@components/shared/Icon'
import { useAuthContext } from '@hooks/useAuthContext'

export default function UserMenu() {
  const { user, logout } = useAuthContext()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const name = user?.name ?? user?.username ?? 'Usuario'
  const role = user?.role ?? ''
  const initial = name.charAt(0).toUpperCase()

  const roleLabel: Record<string, string> = {
    requester:   'Solicitante',
    agent:       'Agente',
    coordinator: 'Coordinador',
    admin:       'Administrador',
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-surface-container-highest transition-colors"
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0"
          style={{ background: 'var(--color-primary)' }}
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-on-surface dark:text-dark-on-surface truncate">{name}</p>
          <p className="text-xs text-slate-500 dark:text-dark-on-surface-variant capitalize">
            {roleLabel[role] ?? role}
          </p>
        </div>
        <Icon
          name={open ? 'expand_less' : 'expand_more'}
          size={18}
          className="text-slate-400 dark:text-dark-on-surface-variant shrink-0"
        />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-dark-surface-container rounded-xl shadow-lg border border-slate-100 dark:border-dark-outline-variant overflow-hidden z-50">
          <button
            onClick={() => { void logout(); setOpen(false) }}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-dark-error-container text-red-600 dark:text-dark-error transition-colors"
          >
            <Icon name="logout" size={18} />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  )
}

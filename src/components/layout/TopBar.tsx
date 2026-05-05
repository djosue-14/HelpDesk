import { useState } from 'react'
import Icon from '@/components/shared/Icon'
import Avatar from '@/components/shared/Avatar'
import { HD_ROLES, HD_NOTIFICATIONS } from '@/data/seed'
import type { Role } from '@/data/types'

interface TopBarProps {
  role: Role
  onRoleChange: (r: Role) => void
  onCreateTicket: () => void
}

export default function TopBar({ role, onRoleChange, onCreateTicket }: TopBarProps) {
  const [showNotif, setShowNotif] = useState(false)
  const [showRole, setShowRole] = useState(false)

  return (
    <header className="sticky top-0 flex items-center gap-4 px-8 h-14 bg-white/90 dark:bg-dark-surface-container/90 backdrop-blur-md z-30 border-b border-slate-100 dark:border-dark-outline-variant">
      {/* Search */}
      <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-full flex-1 max-w-md border border-outline-variant/30 gap-2"> <Icon name="search" size={18} className="text-slate-400 dark:text-dark-on-surface-variant shrink-0" /> <input type="text" placeholder="Buscar tickets, usuarios o departamentos…" className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 dark:placeholder:text-dark-on-surface-variant outline-none text-on-surface" /> <span className="text-[11px] bg-surface dark:bg-dark-surface-container text-slate-400 dark:text-dark-on-surface-variant font-mono px-1.5 py-0.5 rounded border border-slate-200 dark:border-dark-outline-variant shrink-0">⌘K</span> </div> <div className="flex-1" />

      {/* New ticket */}
      <button
        onClick={onCreateTicket}
        className="flex items-center gap-1.5 bg-primary text-white dark:text-dark-on-primary px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity" > <Icon name="add" size={18} />
        Nuevo ticket
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setShowNotif(s => !s); setShowRole(false) }}
          className="p-2 text-slate-500 dark:text-dark-on-surface-variant hover:bg-slate-100 dark:hover:bg-dark-surface-container-high rounded-full transition-colors relative" > <Icon name="notifications" size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-white dark:border-dark-surface-container" />
        </button>

        {showNotif && (
          <div
            className="absolute top-12 right-0 w-80 bg-surface-container-high rounded-xl shadow-xl z-50 border border-slate-200 dark:border-dark-outline-variant overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-slate-200 dark:border-dark-outline-variant"> <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Notificaciones</p>
            </div>
            {HD_NOTIFICATIONS.map(n => (
              <div key={n.id} className="flex gap-3 px-4 py-3 hover:bg-surface-container transition-colors cursor-pointer">
                <Icon name={n.icon} size={18} className="text-primary mt-0.5 shrink-0" /> <div> <p className="text-sm text-on-surface">{n.text}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{n.when}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Role switcher */}
      <div className="relative">
        <button
          onClick={() => { setShowRole(s => !s); setShowNotif(false) }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-dark-outline-variant hover:bg-slate-50 dark:hover:bg-dark-surface-container-high transition-colors text-sm"
        >
          <Avatar user={role.user} size="sm" />
          <span className="font-medium text-on-surface">
            {role.user.name.split(' ')[0]} · {role.name}
          </span>
          <Icon name="expand_more" size={18} className="text-slate-400 dark:text-dark-on-surface-variant" />
        </button>

        {showRole && (
          <div
            className="absolute top-12 right-0 w-72 bg-surface-container-high rounded-xl shadow-xl z-50 border border-slate-200 dark:border-dark-outline-variant overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-slate-200 dark:border-dark-outline-variant"> <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Cambiar de rol (demo)</p>
            </div>
            {HD_ROLES.map(r => (
              <button
                key={r.id}
                onClick={() => { onRoleChange(r); setShowRole(false) }}
                className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors hover:bg-surface-container ${
                  role.id === r.id ? 'bg-secondary-container/50' : ''
                }`}
              >
                <Avatar user={r.user} size="sm" />
                <div className="flex-1 min-w-0"> <p className="text-sm font-medium text-on-surface">{r.user.name}</p>
                  <p className="text-xs text-on-surface-variant">{r.name}</p>
                </div>
                {role.id === r.id && <Icon name="check" size={18} className="text-primary" />} </button> ))} </div> )}
      </div>

      {/* Click outside overlay */}
      {(showNotif || showRole) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowNotif(false); setShowRole(false) }}
        />
      )}
    </header>
  )
}

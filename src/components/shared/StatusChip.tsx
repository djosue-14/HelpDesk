import Icon from './Icon'

const CONFIG: Record<string, { label: string; icon: string; cls: string }> = {
  // API values (TicketStatus)
  Open:       { label: 'Abierto',         icon: 'radio_button_unchecked', cls: 'bg-blue-100 text-blue-700' },
  InProgress: { label: 'En proceso',      icon: 'pending',                cls: 'bg-violet-100 text-violet-700' },
  Paused:     { label: 'Esperando info.', icon: 'hourglass_empty',        cls: 'bg-amber-100 text-amber-700' },
  Closed:     { label: 'Cerrado',         icon: 'check_circle',           cls: 'bg-slate-100 text-slate-600' },
  // Legacy seed values
  open:       { label: 'Abierto',         icon: 'radio_button_unchecked', cls: 'bg-blue-100 text-blue-700' },
  progress:   { label: 'En proceso',      icon: 'pending',                cls: 'bg-violet-100 text-violet-700' },
  waiting:    { label: 'Esperando info.', icon: 'hourglass_empty',        cls: 'bg-amber-100 text-amber-700' },
  closed:     { label: 'Cerrado',         icon: 'check_circle',           cls: 'bg-slate-100 text-slate-600' },
  reopened:   { label: 'Reabierto',       icon: 'restart_alt',            cls: 'bg-red-100 text-red-700' },
}

export default function StatusChip({ id }: { id: string | null | undefined }) {
  if (!id) return null
  const c = CONFIG[id]
  if (!c) return null
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${c.cls}`}>
      <Icon name={c.icon} size={13} />
      {c.label}
    </span>
  )
}

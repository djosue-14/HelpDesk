const CONFIG: Record<string, { label: string; cls: string }> = {
  // API values (TicketPriority)
  Critical: { label: 'Crítica', cls: 'bg-red-100 text-red-700' },
  High:     { label: 'Alta',    cls: 'bg-orange-100 text-orange-700' },
  Medium:   { label: 'Media',   cls: 'bg-blue-100 text-blue-700' },
  Low:      { label: 'Baja',    cls: 'bg-slate-100 text-slate-600' },
  // Legacy seed values
  critical: { label: 'Crítica', cls: 'bg-red-100 text-red-700' },
  high:     { label: 'Alta',    cls: 'bg-orange-100 text-orange-700' },
  medium:   { label: 'Media',   cls: 'bg-blue-100 text-blue-700' },
  low:      { label: 'Baja',    cls: 'bg-slate-100 text-slate-600' },
}

export default function PriorityChip({ id }: { id: string | null | undefined }) {
  if (!id) return null
  const c = CONFIG[id]
  if (!c) return null
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${c.cls}`}>
      {c.label}
    </span>
  )
}

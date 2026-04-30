const CONFIG: Record<string, { label: string; cls: string }> = {
  // API values (TicketPriority)
  Critical: { label: 'Crítica', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  High:     { label: 'Alta',    cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  Medium:   { label: 'Media',   cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  Low:      { label: 'Baja',    cls: 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400' },
  // Legacy seed values
  critical: { label: 'Crítica', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  high:     { label: 'Alta',    cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  medium:   { label: 'Media',   cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  low:      { label: 'Baja',    cls: 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400' },
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

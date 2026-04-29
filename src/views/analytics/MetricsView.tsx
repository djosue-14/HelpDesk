import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@api/services'
import { ticketService } from '@api/services'
import Button from '@/components/shared/Button'
import Card from '@/components/shared/Card'
import KpiCard from '@/components/shared/KpiCard'
import Donut from '@/components/shared/Donut'
import type { TicketStatus, TicketPriority } from '@t/enums'

const STATUS_CONFIG: { id: TicketStatus; label: string; color: string }[] = [
  { id: 'Open',       label: 'Abiertos',    color: '#4285F4' },
  { id: 'InProgress', label: 'En proceso',  color: '#7C4DFF' },
  { id: 'Paused',     label: 'Esperando',   color: '#FB8C00' },
  { id: 'Closed',     label: 'Cerrados',    color: '#9E9E9E' },
]

const PRIORITY_COLORS: Record<TicketPriority, string> = {
  Critical: '#93000A', High: '#E2622A', Medium: '#4285F4', Low: '#9E9E9E',
}

const PRIORITY_LABELS: Record<TicketPriority, string> = {
  Critical: 'Crítica', High: 'Alta', Medium: 'Media', Low: 'Baja',
}

export default function MetricsView() {
  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => dashboardService.getMetrics().then(r => r.data),
  })

  const { data: tickets = [] } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketService.getAll().then(r => r.data ?? []),
  })

  const trend = metrics?.dailyTrend ?? []
  const maxVol = trend.length ? Math.max(...trend.map(d => Math.max(d.created, d.closed)), 1) : 1

  const statusCounts = STATUS_CONFIG.map(s => ({
    ...s,
    count: tickets.filter(t => t.status === s.id).length,
  }))

  const slaByPriority = metrics?.slaByPriority ?? {}
  const priorityEntries = (['Critical', 'High', 'Medium', 'Low'] as TicketPriority[])
    .filter(p => p in slaByPriority)
    .map(p => ({ id: p, label: PRIORITY_LABELS[p], color: PRIORITY_COLORS[p], count: Math.round(slaByPriority[p]) }))

  const trendLabels = trend.map(d =>
    new Date(d.date).toLocaleDateString('es-GT', { month: 'short', day: 'numeric' })
  )

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Métricas operativas</p>
          <h1 className="text-[32px] leading-10 font-semibold text-on-surface">Métricas de la mesa de servicio</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outlined" leading="calendar_today">Últimos 30 días</Button>
          <Button variant="outlined" leading="download">Exportar CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <KpiCard icon="speed" label="Cumplimiento SLA" value={metrics ? `${metrics.slaCompliancePct.toFixed(1)}%` : '—'}
          iconBg="#D5F5DD" iconColor="#0E5C25" />
        <KpiCard icon="schedule" label="Tiempo medio resol." value={metrics ? `${metrics.avgResolutionHours.toFixed(1)} h` : '—'} />
        <KpiCard icon="timer" label="Primera respuesta" value={metrics ? `${metrics.avgFirstResponseHours.toFixed(1)} h` : '—'} />
        <KpiCard icon="restart_alt" label="Tasa de reapertura" value={metrics ? `${metrics.reopenRatePct.toFixed(1)}%` : '—'} />
      </div>

      {/* Donut charts */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-semibold text-on-surface mb-4">Distribución por estado</h3>
          <div className="flex items-center gap-6">
            <Donut data={statusCounts.map(s => ({ count: s.count, color: s.color }))} size={170} thickness={26} />
            <div className="space-y-2 flex-1">
              {statusCounts.map(s => (
                <div key={s.id} className="flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
                  <span className="flex-1 text-on-surface-variant">{s.label}</span>
                  <span className="font-semibold text-on-surface">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-on-surface mb-4">Cumplimiento SLA por prioridad</h3>
          <div className="flex items-center gap-6">
            <Donut data={priorityEntries.map(p => ({ count: p.count, color: p.color }))} size={170} thickness={26} />
            <div className="space-y-2 flex-1">
              {priorityEntries.map(p => (
                <div key={p.id} className="flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: p.color }} />
                  <span className="flex-1 text-on-surface-variant">{p.label}</span>
                  <span className="font-semibold text-on-surface">{p.count}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Volume chart */}
      <Card>
        <h3 className="text-base font-semibold text-on-surface mb-5">Volumen — últimas semanas</h3>
        {trend.length > 0 ? (
          <>
            <div className="flex items-end gap-0.5"
              style={{ height: 200, display: 'grid', gridTemplateColumns: `repeat(${trend.length}, 1fr)` }}>
              {trend.map((d, i) => (
                <div key={i} className="flex items-end gap-[2px] h-full">
                  <div className="flex-1 bg-primary rounded-t-sm hover:opacity-80 transition-opacity"
                    style={{ height: `${(d.created / maxVol) * 100}%` }} title={`Creados: ${d.created}`} />
                  <div className="flex-1 bg-tertiary rounded-t-sm hover:opacity-80 transition-opacity"
                    style={{ height: `${(d.closed / maxVol) * 100}%` }} title={`Cerrados: ${d.closed}`} />
                </div>
              ))}
            </div>
            <div className="grid mt-2 text-[10px] text-slate-400 font-bold"
              style={{ gridTemplateColumns: `repeat(${trend.length}, 1fr)` }}>
              {trendLabels.map((l, i) => (
                <span key={i} className="text-center truncate">{i % 2 === 0 ? l : ''}</span>
              ))}
            </div>
          </>
        ) : (
          <div className="h-48 flex items-center justify-center text-sm text-on-surface-variant">Sin datos de tendencia.</div>
        )}
        <div className="flex gap-5 mt-3 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-primary inline-block" />Creados</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-tertiary inline-block" />Cerrados</span>
        </div>
      </Card>
    </div>
  )
}

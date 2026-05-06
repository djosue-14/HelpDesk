import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@api/services'
import { hdGetPersonByUsername } from '@data/seed'
import KpiCard from '@/components/shared/KpiCard'
import Button from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import Avatar from '@/components/shared/Avatar'
import { PageHeader } from '@components/shared/PageHeader'
import { StatusChip, PriorityChip } from '@components/shared/Chip'
import SlaTraffic from '@/components/shared/SlaTraffic'
import SlaBar from '@/components/shared/SlaBar'
import Donut from '@/components/shared/Donut'
import type { Role } from '@/data/types'
import type { TicketSummaryDto } from '@t/dtos'
import type { TicketStatus } from '@t/enums'
import type { SlaState } from '@/data/types'

function getSlaState(remainingPct: number, status?: TicketStatus | null): SlaState {
  if (status === 'WaitingForInfo') return 'paused'
  if (remainingPct > 50) return 'green'
  if (remainingPct > 25) return 'yellow'
  return 'red'
}

function formatSlaLabel(deadline: string, status: TicketStatus | null | undefined): string {
  if (status === 'WaitingForInfo') return 'Pausado'
  const ms = new Date(deadline).getTime() - Date.now()
  if (ms <= 0) return 'Vencido'
  const hours = Math.floor(ms / 3600000)
  if (hours < 24) return `${hours}h restantes`
  return `${Math.floor(hours / 24)}d restantes`
}

interface Props {
  role: Role
  isAdmin?: boolean
}

function TicketRow({ t }: { t: TicketSummaryDto }) {
  const navigate = useNavigate()
  const slaState = getSlaState(t.remainingSlaPct, t.status)
  const slaLabel = formatSlaLabel(t.deadline, t.status)
  return (
    <div
      onClick={() => navigate(`/tickets/${t.ticketId}`)}
      className="grid gap-4 items-center p-4 bg-white dark:bg-dark-surface-container border border-slate-200 dark:border-dark-outline-variant rounded-xl cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all"
      style={{ gridTemplateColumns: '130px 1fr auto auto' }}
    >
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs font-bold text-primary">HD-{t.ticketNumber}</span>
        <StatusChip id={t.status} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-on-surface truncate">{t.subject}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">{t.departmentName} · {t.supportTypeName}</p>
      </div>
      <PriorityChip id={t.priority} />
      <SlaTraffic state={slaState} label={slaLabel} />
    </div>
  )
}

const STATUS_COLORS: Record<string, string> = {
  Open: '#4285F4', InProgress: '#7C4DFF', WaitingForInfo: '#FB8C00', Closed: '#9E9E9E',
}

export default function DashCoord({ isAdmin }: Props) {
  const navigate = useNavigate()

  const { data: coordDash } = useQuery({
    queryKey: ['coord-dashboard'],
    queryFn: () => dashboardService.getCoordinatorDashboard(),
    select: (res) => res.data,
    enabled: !isAdmin,
  })

  const { data: adminDash } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardService.getAdminDashboard(),
    select: (res) => res.data,
    enabled: isAdmin,
  })

  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => dashboardService.getMetrics().then(r => r.data),
  })

  const breaching = isAdmin ? [] : (coordDash?.escalatedTickets ?? [])

  const trend = metrics?.dailyTrend ?? []
  const maxVol = trend.length
    ? Math.max(...trend.map(d => Math.max(d.created, d.closed)), 1)
    : 1

  const trendLabels = trend.map(d => {
    const date = new Date(d.date)
    return date.toLocaleDateString('es-GT', { month: 'short', day: 'numeric' })
  })

  // Status donut from metrics or coordDash counts
  const statusGroups = [
    { id: 'Open',          label: 'Abiertos',   color: '#4285F4' },
    { id: 'InProgress',    label: 'En proceso',  color: '#7C4DFF' },
    { id: 'WaitingForInfo',label: 'Esperando',   color: '#FB8C00' },
    { id: 'Closed',        label: 'Cerrados',    color: '#9E9E9E' },
  ]

  const priorityEntries = isAdmin && adminDash
    ? Object.entries(adminDash.countByPriority ?? {})
    : []
  const deptEntries = isAdmin && adminDash
    ? Object.entries(adminDash.countByDepartment ?? {})
    : []

  return (
    <div className="space-y-8">
      <PageHeader
        label={isAdmin ? 'Vista de administración' : 'Vista de coordinación'}
        title="Operación HelpDesk"
        description={isAdmin
          ? 'Resumen global de la mesa de servicio.'
          : `Departamento: ${coordDash?.departmentName ?? '…'}`}
        actions={
          <>
            <Button variant="outlined" leading="download">Exportar</Button>
            <Button variant="tonal" leading="grid_on" onClick={() => navigate('/heatmap')}>Mapa de calor</Button>
            <Button leading="monitoring" onClick={() => navigate('/metrics')}>Métricas</Button>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-5">
        {isAdmin ? (
          <>
            <KpiCard icon="inbox"        label="Tickets activos"   value={adminDash?.totalActiveAllDepartments ?? 0} />
            <KpiCard icon="percent"      label="Cumpl. SLA hoy"    value={adminDash ? `${(adminDash.slaDailyCompliancePct ?? 0).toFixed(1)}%` : '—'}
              iconBg="#D5F5DD" iconColor="#0E5C25" />
            <KpiCard icon="check_circle" label="Cerrados"          value={metrics?.totalClosed ?? '—'} />
            <KpiCard icon="restart_alt"  label="Tasa reapertura"   value={metrics ? `${(metrics.reopenRatePct ?? 0).toFixed(1)}%` : '—'} />
          </>
        ) : (
          <>
            <KpiCard icon="inbox"   label="Tickets activos"    value={coordDash?.totalActive ?? 0} />
            <KpiCard icon="warning" label="Incumpl. SLA"       value={coordDash?.slaBreachedCount ?? 0}
              iconBg="#FFDAD6" iconColor="#93000A" />
            <KpiCard icon="percent" label="Cumpl. SLA"         value={metrics ? `${(metrics.slaCompliancePct ?? 0).toFixed(1)}%` : '—'}
              iconBg="#D5F5DD" iconColor="#0E5C25" />
            <KpiCard icon="schedule" label="Tiempo prom. cierre" value={metrics ? `${(metrics.avgResolutionHours ?? 0).toFixed(1)}h` : '—'} />
          </>
        )}
      </div>

      {/* Team workload — coordinator only */}
      {!isAdmin && (coordDash?.teamWorkload ?? []).length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-on-surface mb-4">Carga del equipo</h2>
          <div className="grid grid-cols-3 gap-4">
            {coordDash!.teamWorkload.map(w => {
              const person = hdGetPersonByUsername(w.userId)
              return (
                <Card key={w.userId}>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar user={person} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{person?.name ?? w.userId}</p>
                      <p className="text-xs text-on-surface-variant">{w.assignedCount} asignados · {w.overdueCount} vencidos</p>
                    </div>
                  </div>
                  <SlaBar pct={w.overdueCount > 0 ? 20 : 80} state={w.overdueCount > 0 ? 'red' : 'green'} />
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* Charts */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        {/* Volume trend */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-on-surface">Volumen — últimas semanas</h3>
            <span className="text-xs text-on-surface-variant">Creados vs. cerrados</span>
          </div>
          {trend.length > 0 ? (
            <>
              <div
                className="flex items-end gap-0.5"
                style={{ height: 120, display: 'grid', gridTemplateColumns: `repeat(${trend.length}, 1fr)` }}
              >
                {trend.map((d, i) => (
                  <div key={i} className="flex items-end gap-[2px] h-full">
                    <div className="flex-1 bg-primary rounded-t-sm hover:opacity-80 transition-opacity"
                      style={{ height: `${(d.created / maxVol) * 100}%` }} title={`Creados: ${d.created}`} />
                    <div className="flex-1 bg-tertiary rounded-t-sm hover:opacity-80 transition-opacity"
                      style={{ height: `${(d.closed / maxVol) * 100}%` }} title={`Cerrados: ${d.closed}`} />
                  </div>
                ))}
              </div>
              <div className="grid mt-2 text-[10px] text-slate-400 dark:text-dark-on-surface-variant font-bold uppercase"
                style={{ gridTemplateColumns: `repeat(${trend.length}, 1fr)` }}>
                {trendLabels.map((l, i) => (
                  <span key={i} className="text-center truncate">{i % 2 === 0 ? l : ''}</span>
                ))}
              </div>
            </>
          ) : (
            <div className="h-32 flex items-center justify-center text-sm text-on-surface-variant">Sin datos de tendencia.</div>
          )}
          <div className="flex gap-4 mt-3 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-primary inline-block" />Creados</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-tertiary inline-block" />Cerrados</span>
          </div>
        </Card>

        {/* Donut — status (coord) or priority (admin) */}
        <Card>
          <h3 className="text-base font-semibold text-on-surface mb-4">
            {isAdmin ? 'Por prioridad' : 'Distribución por estado'}
          </h3>
          {isAdmin ? (
            priorityEntries.length > 0 ? (
              <div className="space-y-2">
                {priorityEntries.map(([p, count]) => (
                  <div key={p} className="flex items-center gap-2 text-sm">
                    <span className="flex-1 text-on-surface-variant">{p}</span>
                    <span className="font-semibold text-on-surface">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-sm text-on-surface-variant">Sin datos.</div>
            )
          ) : (
            <div className="flex items-center gap-6">
              <Donut data={statusGroups.map(s => ({ count: 0, color: STATUS_COLORS[s.id] ?? '#9E9E9E' }))} size={160} thickness={24} />
              <div className="space-y-2 flex-1">
                {statusGroups.map(s => (
                  <div key={s.id} className="flex items-center gap-2 text-sm">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
                    <span className="flex-1 text-on-surface-variant">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* By department — admin only */}
      {isAdmin && deptEntries.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-on-surface mb-4">Por departamento</h2>
          <div className="grid grid-cols-3 gap-3">
            {deptEntries.map(([dept, count]) => (
              <Card key={dept}>
                <p className="text-xs text-on-surface-variant mb-1">{dept}</p>
                <p className="text-2xl font-bold text-on-surface">{count}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* SLA breach tickets — coordinator only */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Tickets en riesgo SLA</h2>
          <Button variant="text" trailing="arrow_forward" onClick={() => navigate('/tickets')}>Ver todos</Button>
        </div>
        <div className="space-y-3">
          {breaching.map(t => <TicketRow key={t.ticketId} t={t} />)}
          {breaching.length === 0 && (
            <Card><p className="text-sm text-center text-on-surface-variant py-4">
              {isAdmin ? 'Vista global — revisa métricas para detalle.' : 'No hay tickets en riesgo de SLA. ✓'}
            </p></Card>
          )}
        </div>
      </section>
    </div>
  )
}

import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuthContext } from '@hooks/useAuthContext'
import { ticketService } from '@api/services'
import { dashboardService } from '@api/services'
import KpiCard from '@/components/shared/KpiCard'
import Button from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import Avatar from '@/components/shared/Avatar'
import { PriorityChip } from '@components/shared/Chip'
import SlaTraffic from '@/components/shared/SlaTraffic'
import SlaBar from '@/components/shared/SlaBar'
import EmptyState from '@/components/shared/EmptyState'
import { PageHeader } from '@components/shared/PageHeader'
import { hdGetPersonByUsername } from '@data/seed'
import type { Role } from '@/data/types'
import type { TicketSummaryDto } from '@t/dtos'
import type { TicketStatus } from '@t/enums'
import type { SlaState } from '@/data/types'

function getSlaState(remainingPct: number, status?: TicketStatus | null): SlaState {
  if (status === 'Paused') return 'paused'
  if (remainingPct > 50) return 'green'
  if (remainingPct > 25) return 'yellow'
  return 'red'
}

function formatSlaLabel(deadline: string, status: TicketStatus | null | undefined): string {
  if (status === 'Paused') return 'Pausado'
  const ms = new Date(deadline).getTime() - Date.now()
  if (ms <= 0) return 'Vencido'
  const hours = Math.floor(ms / 3600000)
  if (hours < 24) return `${hours}h restantes`
  return `${Math.floor(hours / 24)}d restantes`
}

interface Props {
  role: Role
}

function AgentTicketCard({ t }: { t: TicketSummaryDto }) {
  const navigate = useNavigate()
  const requester = hdGetPersonByUsername(t.createdBy)
  const slaState = getSlaState(t.remainingSlaPct, t.status)
  const slaLabel = formatSlaLabel(t.deadline, t.status)
  return (
    <Card onClick={() => navigate(`/tickets/${t.ticketId}`)} className="hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-xs font-bold text-primary">HD-{t.ticketNumber}</span>
        <PriorityChip id={t.priority} />
        <span className="flex-1" />
        <SlaTraffic state={slaState} label={slaLabel} />
      </div>
      <p className="text-sm font-semibold text-on-surface mb-2 line-clamp-2">{t.subject}</p>
      <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-3">
        {requester && <Avatar user={requester} size="sm" />}
        <span>{requester?.name ?? t.createdBy} · {t.departmentName} / {t.supportTypeName}</span>
      </div>
      <SlaBar pct={t.remainingSlaPct} state={slaState} />
    </Card>
  )
}

export default function DashAgent({ role }: Props) {
  const navigate = useNavigate()
  const { user } = useAuthContext()

  const { data: allTickets = [] } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketService.getAll().then(r => r.data ?? []),
  })

  const { data: perf } = useQuery({
    queryKey: ['agentPerf', user?.sub],
    queryFn: () => dashboardService.getAgentPerformance(user!.sub).then(r => r.data),
    enabled: !!user?.sub,
  })

  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => dashboardService.getLeaderboard().then(r => r.data),
  })

  const mine = allTickets.filter(t => t.assignedAgentUsername === user?.username)
  const active = mine.filter(t => t.status !== 'Closed')
  const breaching = mine.filter(t =>
    t.status !== 'Paused' && t.status !== 'Closed' && t.remainingSlaPct < 25
  )

  const myRank = leaderboard?.top10?.find(e => e.userId === user?.username)
  const rank = myRank?.rank ?? '—'
  const avgRating = myRank?.ratingRatePct != null ? (myRank.ratingRatePct / 20).toFixed(1) : '—'

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <PageHeader
        label="Bandeja de agente"
        title={`Buen día, ${role.user.name.split(' ')[0]}`}
        description={`${mine.length} ticket${mine.length === 1 ? '' : 's'} asignado${mine.length === 1 ? '' : 's'} · ${breaching.length} en riesgo de SLA.`}
        actions={
          <>
            <Button variant="outlined" leading="filter_list" onClick={() => navigate('/queue')}>Cola del depto.</Button>
            <Button variant="tonal" leading="leaderboard" onClick={() => navigate('/leaderboard')}>Mi ranking</Button>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-5">
        <KpiCard icon="inbox" label="Asignados" value={mine.length} hint={`${active.length} activos`} />
        <KpiCard icon="warning" label="En riesgo SLA" value={breaching.length}
          hint="Atender en las próximas horas" iconBg="#FFDAD6" iconColor="#93000A" />
        <KpiCard icon="check_circle" label="Cerrados (mes)" value={perf?.totalClosed ?? '—'} />
        <KpiCard icon="workspace_premium" label="Cumpl. SLA" value={perf ? `${perf.slaCompliancePct.toFixed(1)}%` : '—'}
          hint={rank !== '—' ? `Posición #${rank} · ⭐ ${avgRating}` : undefined}
          iconBg="#EDE8F5" iconColor="#6750A4" />
      </div>

      {/* SLA breach */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-on-surface">SLA en riesgo</h2>
          <span className="text-xs text-on-surface-variant">Ordenado por tiempo restante</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {breaching.map(t => <AgentTicketCard key={t.ticketId} t={t} />)}
          {breaching.length === 0 && (
            <div className="col-span-2">
              <Card><EmptyState icon="task_alt" title="Todos tus SLAs están en verde" hint="Buen trabajo." /></Card>
            </div>
          )}
        </div>
      </section>

      {/* Active tickets */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Mis tickets activos</h2>
          <Button variant="text" trailing="arrow_forward" onClick={() => navigate('/tickets')}>Ver todos</Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {active.map(t => <AgentTicketCard key={t.ticketId} t={t} />)}
          {active.length === 0 && (
            <div className="col-span-2">
              <Card><EmptyState icon="task_alt" title="Sin tickets activos" hint="La bandeja está limpia." /></Card>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

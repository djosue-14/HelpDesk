import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuthContext } from '@hooks/useAuthContext'
import { ticketService } from '@api/services'
import { scoreService } from '@api/services'
import KpiCard from '@/components/shared/KpiCard'
import Button from '@/components/shared/Button'
import Card from '@/components/shared/Card'
import Icon from '@/components/shared/Icon'
import EmptyState from '@/components/shared/EmptyState'
import StatusChip from '@/components/shared/StatusChip'
import PriorityChip from '@/components/shared/PriorityChip'
import SlaTraffic from '@/components/shared/SlaTraffic'
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
  onCreate: () => void
}

function MyTicketRow({ t }: { t: TicketSummaryDto }) {
  const navigate = useNavigate()
  const slaState = getSlaState(t.remainingSlaPct, t.status)
  const slaLabel = formatSlaLabel(t.deadline, t.status)
  return (
    <div
      onClick={() => navigate(`/tickets/${t.ticketId}`)}
      className="grid gap-4 items-center p-4 bg-white dark:bg-dark-surface-container border border-slate-200 dark:border-dark-outline-variant rounded-xl cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all"
      style={{ gridTemplateColumns: '130px 1fr auto auto' }}
    >
      <div className="flex flex-col gap-1"> <span className="font-mono text-xs font-bold text-primary">HD-{t.ticketNumber}</span>
        <StatusChip id={t.status} />
      </div>
      <div className="min-w-0"> <p className="text-sm font-semibold text-on-surface truncate">{t.subject}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">{t.departmentName} · {t.supportTypeName}</p>
      </div>
      <PriorityChip id={t.priority} />
      <SlaTraffic state={slaState} label={slaLabel} />
    </div>
  )
}

export default function DashRequester({ role, onCreate }: Props) {
  const navigate = useNavigate()
  const { user } = useAuthContext()

  const { data: allTickets = [] } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketService.getAll().then(r => r.data ?? []),
  })

  const { data: score } = useQuery({
    queryKey: ['score', user?.sub],
    queryFn: () => scoreService.getUserScore(user!.sub).then(r => r.data),
    enabled: !!user?.sub,
  })

  const myTickets = allTickets.filter(t => t.createdBy === user?.username)
  const open = myTickets.filter(t => t.status !== 'Closed')
  const closed = myTickets.filter(t => t.status === 'Closed')

  const points = score?.currentPoints ?? 0
  const level = score?.level ?? '—'

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between"> <div> <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Mi panel</p> <h1 className="text-[32px] leading-10 font-semibold text-on-surface">Hola, {role.user.name.split(' ')[0]}</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Tienes {open.length} ticket{open.length === 1 ? '' : 's'} en seguimiento.
          </p>
        </div>
        <div className="flex items-center gap-3"> <Button variant="outlined" leading="history" onClick={() => navigate('/tickets')}>Ver historial</Button>
          <Button leading="add" onClick={onCreate}>Nuevo ticket</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-5"> <KpiCard icon="confirmation_number" label="En seguimiento" value={open.length}
          hint={`${open.filter(t => t.status === 'Open').length} abiertos · ${open.filter(t => t.status === 'Paused').length} esperando info.`} />
        <KpiCard icon="check_circle" label="Cerrados" value={closed.length} />
        <KpiCard icon="workspace_premium" label="Mis puntos" value={points.toLocaleString('es')}
          hint={`Nivel ${level}`}
          iconBg="#EDE8F5" iconColor="#6750A4" />
      </div>

      {/* Rate banner for recently closed tickets */}
      {closed.length > 0 && (
        <div className="flex items-center gap-4 p-5 rounded-xl bg-tertiary-container/20 border border-tertiary-container/30"> <Icon name="reviews" size={28} fill={1} className="text-tertiary shrink-0" /> <div className="flex-1"> <p className="text-sm font-semibold text-on-surface">
              Tienes {closed.length} ticket{closed.length > 1 ? 's' : ''} cerrado{closed.length > 1 ? 's' : ''} — ¿ya los calificaste?
            </p>
            <p className="text-xs text-on-surface-variant">Califica para sumar puntos y ayudar al equipo de soporte.</p>
          </div>
          <Button onClick={() => navigate(`/tickets/${closed[0].ticketId}`)}>Calificar ahora</Button>
        </div>
      )}

      {/* Active tickets */}
      <section>
        <div className="flex items-center justify-between mb-4"> <h2 className="text-lg font-semibold text-on-surface">Mis tickets activos</h2> <Button variant="text" trailing="arrow_forward" onClick={() => navigate('/tickets')}>Ver todos</Button>
        </div>
        <div className="space-y-3">
          {open.map(t => <MyTicketRow key={t.ticketId} t={t} />)}
          {open.length === 0 && (
            <Card>
              <EmptyState icon="task_alt" title="Sin tickets activos" hint="Crea uno cuando lo necesites."
                action={<Button leading="add" onClick={onCreate}>Nuevo ticket</Button>} />
            </Card>
          )}
        </div>
      </section>

      {/* Score + Guide */}
      <div className="grid grid-cols-2 gap-6"> <Card> <div className="flex items-center gap-3 mb-4"> <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300"> <Icon name="workspace_premium" size={22} fill={1} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary">Reputación</p> <p className="text-lg font-semibold text-on-surface">Nivel {level}</p>
              <p className="text-xs text-on-surface-variant">{points.toLocaleString('es')} puntos acumulados</p>
            </div>
          </div>
          <div className="space-y-2">
            {(score?.scoreTransactions ?? []).slice(0, 3).map(tx => (
              <div key={tx.scoreTransactionId} className="flex items-center gap-2 text-xs"> <span className="text-green-600 dark:text-green-400 font-bold shrink-0">+{tx.points}</span>
                <span className="flex-1 text-on-surface-variant truncate">{tx.reason}</span>
              </div>
            ))}
            {!score?.scoreTransactions?.length && (
              <p className="text-xs text-on-surface-variant">Sin transacciones recientes.</p> )} </div> </Card> <Card> <h3 className="text-base font-semibold text-on-surface mb-4">Cómo ganar más puntos</h3> <ul className="space-y-3">
            {[
              { i: 'edit_document', t: 'Describir bien tu problema',  s: '+10 pts cuando tu ticket no requiere repreguntar.' },
              { i: 'reviews',       t: 'Calificar tickets cerrados',   s: '+15 pts por cada calificación con comentario.'    },
              { i: 'attach_file',   t: 'Adjuntar evidencia',           s: '+5 pts cuando incluyes capturas o archivos.'      },
              { i: 'timer',         t: 'Responder a tiempo',           s: '+10 pts si respondes en menos de 4 h.'           },
            ].map((r, i) => (
              <li key={i} className="flex items-start gap-3">
                <Icon name={r.i} size={18} className="text-primary mt-0.5 shrink-0" /> <div> <p className="text-sm font-semibold text-on-surface">{r.t}</p>
                  <p className="text-xs text-on-surface-variant">{r.s}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

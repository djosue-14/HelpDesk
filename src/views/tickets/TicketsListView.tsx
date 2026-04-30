import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuthContext } from '@hooks/useAuthContext'
import { ticketService } from '@api/services'
import { hdGetPersonByUsername } from '@data/seed'
import Avatar from '@/components/shared/Avatar'
import StatusChip from '@/components/shared/StatusChip'
import PriorityChip from '@/components/shared/PriorityChip'
import SlaTraffic from '@/components/shared/SlaTraffic'
import SlaBar from '@/components/shared/SlaBar'
import Chip from '@/components/shared/Chip'
import EmptyState from '@/components/shared/EmptyState'
import type { Role } from '@/data/types'
import type { TicketStatus, TicketPriority } from '@t/enums'
import type { SlaState } from '@/data/types'

type SortKey = 'updated' | 'sla' | 'priority'

const STATUSES: { id: TicketStatus; name: string; icon: string }[] = [
  { id: 'Open',       name: 'Abierto',         icon: 'radio_button_unchecked' },
  { id: 'InProgress', name: 'En proceso',      icon: 'pending' },
  { id: 'Paused',     name: 'Esperando info.', icon: 'hourglass_empty' },
  { id: 'Closed',     name: 'Cerrado',         icon: 'check_circle' },
]

const PRIORITIES: { id: TicketPriority; name: string }[] = [
  { id: 'Critical', name: 'Crítica' },
  { id: 'High',     name: 'Alta' },
  { id: 'Medium',   name: 'Media' },
  { id: 'Low',      name: 'Baja' },
]

const PRIORITY_ORDER: Record<TicketPriority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 }

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
  if (hours < 1) return `${Math.floor(ms / 60000)}m restantes`
  if (hours < 24) return `${hours}h restantes`
  return `${Math.floor(hours / 24)}d restantes`
}

interface Props {
  role: Role
  query?: string
  scope?: 'all' | 'queue'
}

export default function Tickets({ role, query = '', scope = 'all' }: Props) {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const [statusF, setStatusF] = useState<TicketStatus | 'all'>('all')
  const [prioF, setPrioF] = useState<TicketPriority | 'all'>('all')
  const [deptF, setDeptF] = useState('all')
  const [slaF, setSlaF] = useState('all')
  const [sort, setSort] = useState<SortKey>('updated')

  const { data: allTickets = [], isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketService.getAll().then(r => r.data ?? []),
  })

  const depts = useMemo(() => {
    const names = new Set(allTickets.map(t => t.departmentName).filter(Boolean) as string[])
    return Array.from(names).sort()
  }, [allTickets])

  const tickets = useMemo(() => {
    let list = [...allTickets]
    if (role.id === 'requester') list = list.filter(t => t.createdBy === user?.username)
    if (role.id === 'agent' && scope !== 'queue') {
      list = list.filter(t => t.assignedAgentUsername === user?.username)
    }
    if (statusF !== 'all') list = list.filter(t => t.status === statusF)
    if (prioF !== 'all')   list = list.filter(t => t.priority === prioF)
    if (deptF !== 'all')   list = list.filter(t => t.departmentName === deptF)
    if (slaF !== 'all') {
      list = list.filter(t => getSlaState(t.remainingSlaPct, t.status) === slaF)
    }
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(t =>
        `${t.subject} HD-${t.ticketNumber} ${t.departmentName}`.toLowerCase().includes(q))
    }
    if (sort === 'sla') list.sort((a, b) => a.remainingSlaPct - b.remainingSlaPct)
    else if (sort === 'priority') {
      list.sort((a, b) =>
        (PRIORITY_ORDER[a.priority ?? 'Low'] ?? 3) - (PRIORITY_ORDER[b.priority ?? 'Low'] ?? 3))
    }
    return list
  }, [allTickets, statusF, prioF, deptF, slaF, sort, role.id, scope, query, user?.username])

  const counts = useMemo(() => {
    const base = role.id === 'requester'
      ? allTickets.filter(t => t.createdBy === user?.username)
      : role.id === 'agent' && scope !== 'queue'
        ? allTickets.filter(t => t.assignedAgentUsername === user?.username)
        : allTickets
    const r: Record<string, number> = { all: base.length }
    STATUSES.forEach(s => { r[s.id] = base.filter(t => t.status === s.id).length })
    return r
  }, [allTickets, role.id, scope, user?.username])

  const title = role.id === 'requester' ? 'Mis tickets'
    : role.id === 'agent' && scope === 'queue' ? 'Cola del departamento'
    : role.id === 'agent' ? 'Asignados a mí'
    : 'Todos los tickets'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-on-surface-variant text-sm">
        Cargando tickets…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Bandeja</p>
          <h1 className="text-[32px] leading-10 font-semibold text-on-surface">{title}</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Mostrando {tickets.length} de {counts.all} tickets.
          </p>
        </div>
        <div className="flex items-center rounded-lg border border-slate-200 dark:border-dark-outline-variant overflow-hidden text-sm bg-white dark:bg-dark-surface-container">
          {([['updated','Más recientes'],['sla','SLA crítico'],['priority','Prioridad']] as [SortKey, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setSort(key)}
              className={`px-4 py-2 font-medium transition-colors ${
                sort === key ? 'bg-primary dark:bg-dark-primary text-white dark:text-dark-on-primary' : 'text-slate-600 dark:text-dark-on-surface-variant hover:bg-slate-50 dark:hover:bg-dark-surface-container-high'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-dark-surface-container rounded-xl border border-slate-100 dark:border-dark-outline-variant shadow-sm p-4 flex flex-wrap items-center gap-2">
        <Chip selected={statusF === 'all'} onClick={() => setStatusF('all')}>
          Todos · {counts.all}
        </Chip>
        {STATUSES.map(s => (
          <Chip key={s.id} selected={statusF === s.id} leading={s.icon} onClick={() => setStatusF(s.id)}>
            {s.name} · {counts[s.id] ?? 0}
          </Chip>
        ))}
        <span className="flex-1" />
        <select
          className="text-sm border border-slate-200 dark:border-dark-outline-variant rounded-lg px-3 py-1.5 bg-white dark:bg-dark-surface-container-low text-on-surface dark:text-dark-on-surface focus:outline-none focus:border-primary dark:focus:border-dark-primary"
          value={deptF} onChange={e => setDeptF(e.target.value)}>
          <option value="all">Todos los departamentos</option>
          {depts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          className="text-sm border border-slate-200 dark:border-dark-outline-variant rounded-lg px-3 py-1.5 bg-white dark:bg-dark-surface-container-low text-on-surface dark:text-dark-on-surface focus:outline-none focus:border-primary dark:focus:border-dark-primary"
          value={prioF} onChange={e => setPrioF(e.target.value as TicketPriority | 'all')}>
          <option value="all">Todas las prioridades</option>
          {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select
          className="text-sm border border-slate-200 dark:border-dark-outline-variant rounded-lg px-3 py-1.5 bg-white dark:bg-dark-surface-container-low text-on-surface dark:text-dark-on-surface focus:outline-none focus:border-primary dark:focus:border-dark-primary"
          value={slaF} onChange={e => setSlaF(e.target.value)}>
          <option value="all">SLA — Cualquiera</option>
          <option value="green">Verde</option>
          <option value="yellow">Ámbar</option>
          <option value="red">Rojo</option>
          <option value="paused">Pausado</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-surface-container rounded-xl border border-slate-100 dark:border-dark-outline-variant shadow-sm overflow-hidden">
        {tickets.length === 0 ? (
          <EmptyState icon="search_off" title="Sin resultados" hint="Ajusta los filtros para ver más tickets." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-dark-outline-variant bg-surface-container-low dark:bg-dark-surface-container-low">
                {['ID', 'Asunto', 'Estado', 'Prioridad', 'Solicitante', 'Asignado a', 'SLA', 'Vence'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-dark-on-surface-variant uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-dark-outline-variant/30">
              {tickets.map(t => {
                const req = hdGetPersonByUsername(t.createdBy)
                const ass = hdGetPersonByUsername(t.assignedAgentUsername)
                const slaState = getSlaState(t.remainingSlaPct, t.status)
                const slaLabel = formatSlaLabel(t.deadline, t.status)
                return (
                  <tr key={t.ticketId}
                    className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                    onClick={() => navigate(`/tickets/${t.ticketId}`)}>
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs font-bold text-primary">HD-{t.ticketNumber}</p>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-1">{t.subject}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{t.departmentName} · {t.supportTypeName}</p>
                    </td>
                    <td className="px-5 py-4"><StatusChip id={t.status} /></td>
                    <td className="px-5 py-4"><PriorityChip id={t.priority} /></td>
                    <td className="px-5 py-4">
                      {req ? (
                        <div className="flex items-center gap-2">
                          <Avatar user={req} size="sm" />
                          <span className="text-xs text-on-surface">{req.name.split(' ')[0]}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-on-surface-variant">{t.createdBy ?? '—'}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {ass ? (
                        <div className="flex items-center gap-2">
                          <Avatar user={ass} size="sm" />
                          <span className="text-xs text-on-surface">{ass.name.split(' ')[0]}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-on-surface-variant italic">— sin asignar —</span>
                      )}
                    </td>
                    <td className="px-5 py-4 min-w-[160px]">
                      <div className="flex flex-col gap-1">
                        <SlaTraffic state={slaState} label={slaLabel} />
                        <SlaBar pct={t.remainingSlaPct} state={slaState} />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-on-surface-variant whitespace-nowrap">
                      {new Date(t.deadline).toLocaleDateString('es-GT', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

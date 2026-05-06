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
import { Table } from '@components/shared/Table'
import type { ColumnDef } from '@components/shared/Table'
import { Select } from '@components/shared/Select'
import { Autocomplete } from '@components/shared/Autocomplete'
import type { Role } from '@/data/types'
import type { TicketStatus, TicketPriority } from '@t/enums'
import type { SlaState } from '@/data/types'
import type { TicketSummaryDto } from '@t/dtos'

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

const columns: ColumnDef<TicketSummaryDto>[] = [
  {
    accessorKey: 'ticketNumber',
    header: 'ID',
    size: 80,
    cell: ({ getValue }) => (
      <span className="font-mono text-xs font-bold text-primary">HD-{getValue<number>()}</span>
    ),
  },
  {
    id: 'subject',
    header: 'Asunto',
    accessorKey: 'subject',
    cell: ({ row }) => (
      <div className="max-w-xs"> <p className="font-semibold text-on-surface line-clamp-1">{row.original.subject}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">
          {row.original.departmentName} · {row.original.supportTypeName}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    enableSorting: false,
    cell: ({ getValue }) => <StatusChip id={getValue<TicketStatus | null>()} />,
  },
  {
    accessorKey: 'priority',
    header: 'Prioridad',
    enableSorting: false,
    cell: ({ getValue }) => <PriorityChip id={getValue<TicketPriority | null>()} />,
  },
  {
    accessorKey: 'createdBy',
    header: 'Solicitante',
    enableSorting: false,
    cell: ({ getValue }) => {
      const username = getValue<string | null>()
      const person = hdGetPersonByUsername(username)
      return person ? (
        <div className="flex items-center gap-2">
          <Avatar user={person} size="sm" />
          <span className="text-xs text-on-surface">{person.name.split(' ')[0]}</span>
        </div>
      ) : (
        <span className="text-xs text-on-surface-variant">{username ?? '—'}</span>
      )
    },
  },
  {
    accessorKey: 'assignedAgentUsername',
    header: 'Asignado a',
    enableSorting: false,
    cell: ({ getValue }) => {
      const username = getValue<string | null>()
      const person = hdGetPersonByUsername(username)
      return person ? (
        <div className="flex items-center gap-2">
          <Avatar user={person} size="sm" />
          <span className="text-xs text-on-surface">{person.name.split(' ')[0]}</span>
        </div>
      ) : (
        <span className="text-xs text-on-surface-variant italic">— sin asignar —</span> ) },},
  {
    id: 'sla',
    header: 'SLA',
    enableSorting: false,
    cell: ({ row }) => {
      const slaState = getSlaState(row.original.remainingSlaPct, row.original.status)
      const slaLabel = formatSlaLabel(row.original.deadline, row.original.status)
      return (
        <div className="flex flex-col gap-1 min-w-[160px]">
          <SlaTraffic state={slaState} label={slaLabel} />
          <SlaBar pct={row.original.remainingSlaPct} state={slaState} />
        </div>
      )
    },
  },
  {
    accessorKey: 'deadline',
    header: 'Vence',
    cell: ({ getValue }) => (
      <span className="text-xs text-on-surface-variant whitespace-nowrap">
        {new Date(getValue<string>()).toLocaleDateString('es-GT', { day: '2-digit', month: 'short' })}
      </span>
    ),
  },
]

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
      <div className="flex items-center justify-center py-24 text-on-surface-variant text-sm"> Cargando tickets… </div> ) } return ( <div className="space-y-6"> <div className="flex items-start justify-between"> <div> <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Bandeja</p> <h1 className="text-[32px] leading-10 font-semibold text-on-surface">{title}</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Mostrando {tickets.length} de {counts.all} tickets.
          </p>
        </div>
        <div className="flex items-center rounded-lg border border-slate-200 dark:border-dark-outline-variant overflow-hidden text-sm bg-white dark:bg-dark-surface-container">
          {([['updated','Más recientes'],['sla','SLA crítico'],['priority','Prioridad']] as [SortKey, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setSort(key)}
              className={`px-4 py-2 font-medium transition-colors ${
                sort === key ? 'bg-primary text-white' : 'text-slate-600 dark:text-dark-on-surface-variant hover:bg-slate-50 dark:hover:bg-dark-surface-container-high'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

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
        <Autocomplete
          size="sm"
          placeholder="Departamento"
          value={deptF === 'all' ? null : deptF}
          onChange={(v) => setDeptF(v !== null ? String(v) : 'all')}
          options={depts.map(d => ({ value: d, label: d }))}
          className="w-52"
        />
        <Select
          size="sm"
          placeholder="Todas las prioridades"
          value={prioF}
          onChange={(v) => setPrioF(v as TicketPriority | 'all')}
          options={[
            { value: 'all', label: 'Todas las prioridades' },
            ...PRIORITIES.map(p => ({ value: p.id, label: p.name })),
          ]}
        />
        <Select
          size="sm"
          placeholder="SLA — Cualquiera"
          value={slaF}
          onChange={(v) => setSlaF(String(v))}
          options={[
            { value: 'all', label: 'SLA — Cualquiera' },
            { value: 'green', label: 'Verde' },
            { value: 'yellow', label: 'Ámbar' },
            { value: 'red', label: 'Rojo' },
            { value: 'paused', label: 'Pausado' },
          ]}
        />
      </div>

      <Table<TicketSummaryDto>
        data={tickets}
        columns={columns}
        emptyMessage="Sin resultados. Ajusta los filtros."
        onRowClick={(ticket) => navigate(`/tickets/${ticket.ticketId}`)}
      />
    </div>
  )
}

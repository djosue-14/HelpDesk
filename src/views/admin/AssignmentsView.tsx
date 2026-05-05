import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { departmentService, supportTypeService } from '@api/services'
import { HD_PEOPLE } from '@/data/seed'
import Button from '@/components/shared/Button'
import Avatar from '@/components/shared/Avatar'
import SlaBar from '@/components/shared/SlaBar'
import { Table } from '@components/shared/Table'
import type { ColumnDef } from '@components/shared/Table'
import type { SupportTypeDto } from '@t/dtos'

const AGENTS = ['alvaro', 'lucia', 'diego', 'carola', 'hector', 'ana']
const LOADS  = [60, 50, 78, 42, 55, 38]

interface AgentRow {
  personKey: string
  name: string
  username: string
  dept: string
  types: SupportTypeDto[]
  load: number
}

export default function AssignmentsView() {
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getAll().then(r => r.data ?? []),
  })
  const { data: allTypes = [] } = useQuery({
    queryKey: ['supportTypes'],
    queryFn: () => supportTypeService.getAll().then(r => r.data ?? []),
  })

  const rows = useMemo<AgentRow[]>(() =>
    AGENTS.flatMap((k, idx) => {
      const u = HD_PEOPLE[k]
      if (!u) return []
      const dept = departments.find(d => d.name === u.dept || d.departmentId === idx + 1)
      const types = allTypes.filter(t => t.departmentId === dept?.departmentId).slice(0, 3)
      return [{
        personKey: k,
        name: u.name,
        username: u.username,
        dept: dept?.name ?? u.dept,
        types,
        load: LOADS[idx],
      }]
    }),
  [departments, allTypes])

  const columns = useMemo<ColumnDef<AgentRow>[]>(() => [
    {
      id: 'agent',
      header: 'Agente',
      cell: ({ row }) => {
        const u = HD_PEOPLE[row.original.personKey] ?? HD_PEOPLE['alvaro']
        return (
          <div className="flex items-center gap-3">
            <Avatar user={u} size="md" />
            <div>
              <p className="font-semibold text-on-surface">{row.original.name}</p>
              <p className="text-xs text-on-surface-variant">@{row.original.username}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'dept',
      header: 'Departamento',
      cell: ({ getValue }) => (
        <span className="text-on-surface-variant">{getValue<string>()}</span>
      ),
    },
    {
      id: 'types',
      header: 'Tipos de soporte',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1.5">
          {row.original.types.map(t => (
            <span key={t.supportTypeId} className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary text-white">
              {t.name}
            </span>
          ))}
          <button className="px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors">
            + Añadir
          </button>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Estado',
      enableSorting: false,
      cell: () => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
          Disponible
        </span>
      ),
    },
    {
      accessorKey: 'load',
      header: 'Capacidad',
      cell: ({ getValue }) => {
        const load = getValue<number>()
        return (
          <div className="min-w-[140px]">
            <p className="text-xs text-on-surface-variant mb-1">Carga {load}%</p>
            <SlaBar pct={load} state="green" />
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: '',
      size: 100,
      enableSorting: false,
      cell: () => (
        <Button variant="text" size="sm" leading="edit">Editar</Button>
      ),
    },
  ], [])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Equipo</p>
          <h1 className="text-[32px] leading-10 font-semibold text-on-surface">Asignación de agentes</h1>
          <p className="text-sm text-on-surface-variant mt-1">Define a qué departamentos y tipos de soporte puede atender cada agente.</p>
        </div>
        <Button leading="person_add">Asignar agente</Button>
      </div>

      <Table<AgentRow>
        data={rows}
        columns={columns}
        emptyMessage="No hay agentes asignados"
        searchable
        searchPlaceholder="Buscar agente..."
      />
    </div>
  )
}

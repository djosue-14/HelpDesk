import { useState, useEffect, useMemo } from 'react'
import { useQuery, useQueries } from '@tanstack/react-query'
import { departmentService, supportTypeService, supportTypeAgentService } from '@api/services'
import { hdGetPersonByUsername } from '@data/seed'
import Button from '@/components/shared/Button'
import Avatar from '@/components/shared/Avatar'
import { Table } from '@components/shared/Table'
import type { ColumnDef } from '@components/shared/Table'

interface AssignmentRow {
  supportTypeId: number
  supportTypeName: string | null
  agentUserId: string | null
  assignedSince: string | null
  isLoading: boolean
}

export default function AssignmentsView() {
  const [deptId, setDeptId] = useState<number | null>(null)

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getAll().then(r => r.data ?? []),
  })

  const { data: allTypes = [] } = useQuery({
    queryKey: ['supportTypes'],
    queryFn: () => supportTypeService.getAll().then(r => r.data ?? []),
  })

  useEffect(() => {
    if (departments.length > 0 && deptId === null) setDeptId(departments[0].departmentId)
  }, [departments, deptId])

  const deptTypes = allTypes.filter(t => t.departmentId === deptId)

  const agentQueries = useQueries({
    queries: deptTypes.map(type => ({
      queryKey: ['activeAgent', type.supportTypeId],
      queryFn: () =>
        supportTypeAgentService.getActive(type.supportTypeId)
          .then(r => r.data ?? null)
          .catch(() => null),
    })),
  })

  const rows = useMemo<AssignmentRow[]>(() =>
    deptTypes.map((type, i) => ({
      supportTypeId: type.supportTypeId,
      supportTypeName: type.name,
      agentUserId: agentQueries[i]?.data?.userId ?? null,
      assignedSince: agentQueries[i]?.data?.createdAt ?? null,
      isLoading: agentQueries[i]?.isLoading ?? false,
    })),
  [deptTypes, agentQueries])

  const columns = useMemo<ColumnDef<AssignmentRow>[]>(() => [
    {
      accessorKey: 'supportTypeName',
      header: 'Tipo de soporte',
      cell: ({ getValue }) => (
        <span className="font-semibold text-on-surface">{getValue<string | null>()}</span>
      ),
    },
    {
      id: 'agent',
      header: 'Agente asignado',
      enableSorting: false,
      cell: ({ row }) => {
        if (row.original.isLoading) {
          return <span className="text-xs text-on-surface-variant">Cargando…</span>
        }
        const person = hdGetPersonByUsername(row.original.agentUserId)
        if (!person) {
          return <span className="text-xs text-on-surface-variant italic">— Sin asignar —</span>
        }
        return (
          <div className="flex items-center gap-2">
            <Avatar user={person} size="sm" />
            <div>
              <p className="text-sm text-on-surface">{person.name}</p>
              <p className="text-xs text-on-surface-variant">@{person.username}</p>
            </div>
          </div>
        )
      },
    },
    {
      id: 'since',
      header: 'Asignado desde',
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-xs text-on-surface-variant">
          {row.original.assignedSince
            ? new Date(row.original.assignedSince).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—'}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Estado',
      enableSorting: false,
      cell: ({ row }) => row.original.agentUserId
        ? <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">Asignado</span>
        : <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-container text-on-surface-variant">Vacante</span>,
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
          <p className="text-sm text-on-surface-variant mt-1">Agente activo por tipo de soporte en el departamento seleccionado.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {departments.map(d => (
          <button
            key={d.departmentId}
            onClick={() => setDeptId(d.departmentId)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              deptId === d.departmentId
                ? 'bg-primary text-white'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <Table<AssignmentRow>
        data={rows}
        columns={columns}
        emptyMessage="Sin tipos de soporte para este departamento"
      />
    </div>
  )
}

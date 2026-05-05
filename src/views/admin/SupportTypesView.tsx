import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { departmentService, supportTypeService } from '@api/services'
import Button from '@/components/shared/Button'
import { Table } from '@components/shared/Table'
import type { ColumnDef } from '@components/shared/Table'
import type { SupportTypeDto } from '@t/dtos'

export default function CatalogTypes() {
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null)

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getAll().then(r => r.data ?? []),
  })

  const { data: allTypes = [] } = useQuery({
    queryKey: ['supportTypes'],
    queryFn: () => supportTypeService.getAll().then(r => r.data ?? []),
  })

  const activeDeptId = selectedDeptId ?? departments[0]?.departmentId ?? null
  const types = activeDeptId != null ? allTypes.filter(t => t.departmentId === activeDeptId) : []

  const columns = useMemo<ColumnDef<SupportTypeDto>[]>(() => [
    {
      accessorKey: 'supportTypeId',
      header: 'ID',
      size: 80,
      cell: ({ getValue }) => (
        <span className="font-mono text-xs font-bold text-primary">
          T{String(getValue<number>()).padStart(3, '0')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ getValue }) => (
        <span className="font-semibold text-on-surface">{getValue<string | null>()}</span>
      ),
    },
    {
      accessorKey: 'isEnabled',
      header: 'Estado',
      enableSorting: false,
      cell: ({ getValue }) => {
        const active = getValue<boolean>()
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
            active
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-surface-container-high text-on-surface-variant'
          }`}>
            {active ? 'Activo' : 'Inactivo'}
          </span>
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
          <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Catálogo</p>
          <h1 className="text-[32px] leading-10 font-semibold text-on-surface">Tipos de soporte</h1>
          <p className="text-sm text-on-surface-variant mt-1">Cada tipo define la prioridad sugerida y el SLA por defecto.</p>
        </div>
        <Button leading="add">Nuevo tipo</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {departments.map(d => (
          <button
            key={d.departmentId}
            onClick={() => setSelectedDeptId(d.departmentId)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeDeptId === d.departmentId
                ? 'bg-primary text-white'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <Table<SupportTypeDto>
        data={types}
        columns={columns}
        emptyMessage="Sin tipos para este departamento"
        searchable
        searchPlaceholder="Buscar tipo de soporte..."
      />
    </div>
  )
}

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { departmentService, supportTypeService } from '@api/services'
import { HD_DEPARTMENTS } from '@data/seed'
import Button from '@/components/shared/Button'
import Icon from '@/components/shared/Icon'
import { PageHeader } from '@components/shared/PageHeader'
import { Table } from '@components/shared/Table'
import type { ColumnDef } from '@components/shared/Table'
import { Toggle } from '@components/shared/Toggle'
import type { DepartmentDto } from '@t/dtos'

export default function CatalogDepartments() {
  const { data: departments = [], isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getAll().then(r => r.data ?? []),
  })

  const { data: supportTypes = [] } = useQuery({
    queryKey: ['supportTypes'],
    queryFn: () => supportTypeService.getAll().then(r => r.data ?? []),
  })

  function getSeedVisuals(name: string | null) {
    const seed = HD_DEPARTMENTS.find(d => d.name === name)
    return { color: seed?.color ?? '#6750A4', icon: seed?.icon ?? 'business' }
  }

  function countTypes(deptId: number) {
    return supportTypes.filter(t => t.departmentId === deptId).length
  }

  const columns = useMemo<ColumnDef<DepartmentDto>[]>(() => [
    {
      accessorKey: 'departmentId',
      header: 'ID',
      size: 70,
      cell: ({ getValue }) => (
        <span className="font-mono text-xs font-bold text-primary">
          D{String(getValue<number>()).padStart(2, '0')}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => {
        const { color, icon } = getSeedVisuals(row.original.name)
        return (
          <div className="flex items-center gap-3">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
              style={{ background: color }}
            >
              <Icon name={icon} size={16} fill={1} />
            </span>
            <span className="font-semibold text-on-surface">{row.original.name}</span>
          </div>
        )
      },
    },
    {
      id: 'supportTypes',
      header: 'Tipos de soporte',
      cell: ({ row }) => (
        <span className="text-on-surface-variant">
          {countTypes(row.original.departmentId)} tipos
        </span>
      ),
    },
    {
      accessorKey: 'coordinatorUserId',
      header: 'Coordinador',
      cell: ({ getValue }) => (
        <span className="text-on-surface-variant">{getValue<string | null>() ?? '—'}</span>
      ),
    },
    {
      accessorKey: 'isEnabled',
      header: 'Estado',
      enableSorting: false,
      cell: ({ getValue }) => (
        <Toggle checked={getValue<boolean>()} />
      ),
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
  ], [supportTypes])

  return (
    <div className="space-y-6">
      <PageHeader
        label="Catálogo"
        title="Departamentos"
        actions={<Button leading="add">Nuevo departamento</Button>}
      />

      <Table<DepartmentDto>
        data={isLoading ? [] : departments}
        columns={columns}
        emptyMessage={isLoading ? 'Cargando...' : 'No hay departamentos registrados'}
        searchable
        searchPlaceholder="Buscar departamento..."
      />
    </div>
  )
}

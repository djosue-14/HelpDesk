import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { departmentService, supportTypeService } from '@api/services'
import { HD_DEPARTMENTS } from '@data/seed'
import Button from '@/components/shared/Button'
import Icon from '@/components/shared/Icon'
import { PageHeader } from '@components/shared/PageHeader'
import { Table } from '@components/shared/Table'
import type { ColumnDef } from '@components/shared/Table'
import { Toggle } from '@components/shared/Toggle'
import { TextField } from '@components/shared/TextField'
import { Dialog, DialogHead, DialogBody, DialogFoot } from '@components/shared/Dialog'
import { ConfirmDialog } from '@/components/dialogs/TicketDialogs'
import type { DepartmentDto } from '@t/dtos'

export default function CatalogDepartments() {
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [coordId, setCoordId] = useState('')

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getAll().then(r => r.data ?? []),
  })

  const { data: supportTypes = [] } = useQuery({
    queryKey: ['supportTypes'],
    queryFn: () => supportTypeService.getAll().then(r => r.data ?? []),
  })

  const createMutation = useMutation({
    mutationFn: () => departmentService.create({ name: name.trim(), coordinatorUserId: coordId.trim() || null }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['departments'] })
      setShowCreate(false); setName(''); setCoordId('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => departmentService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
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
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: color }}>
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
        <span className="text-on-surface-variant">{countTypes(row.original.departmentId)} tipos</span>
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
      cell: ({ getValue }) => <Toggle checked={getValue<boolean>()} />,
    },
    {
      id: 'actions',
      header: '',
      size: 140,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="text" size="sm" leading="edit">Editar</Button>
          <Button variant="text" size="sm" leading="delete"
            onClick={() => setDeleteId(row.original.departmentId)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ], [supportTypes])

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          label="Catálogo"
          title="Departamentos"
          actions={<Button leading="add" onClick={() => setShowCreate(true)}>Nuevo departamento</Button>}
        />

        <Table<DepartmentDto>
          data={isLoading ? [] : departments}
          columns={columns}
          emptyMessage={isLoading ? 'Cargando...' : 'No hay departamentos registrados'}
          searchable
          searchPlaceholder="Buscar departamento..."
        />
      </div>

      {showCreate && (
        <Dialog onClose={() => setShowCreate(false)}>
          <DialogHead icon="add_circle" title="Nuevo departamento" onClose={() => setShowCreate(false)} />
          <DialogBody>
            <TextField label="Nombre" required value={name} onChange={e => setName(e.target.value)} />
            <TextField
              label="Username del coordinador (opcional)" value={coordId}
              onChange={e => setCoordId(e.target.value)} placeholder="ej. rocio.zavala"
            />
          </DialogBody>
          <DialogFoot>
            <Button variant="text" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button
              disabled={name.trim().length < 3 || createMutation.isPending}
              onClick={() => createMutation.mutate()}>
              {createMutation.isPending ? 'Creando…' : 'Crear'}
            </Button>
          </DialogFoot>
        </Dialog>
      )}

      {deleteId !== null && (
        <ConfirmDialog
          icon="delete" title="Eliminar departamento"
          body="Esta acción desactivará el departamento y sus tipos de soporte."
          confirmLabel="Eliminar" confirmVariant="outlined"
          onClose={() => setDeleteId(null)}
          onConfirm={() => { deleteMutation.mutate(deleteId!); setDeleteId(null) }}
        />
      )}
    </>
  )
}

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { departmentService, supportTypeService } from '@api/services'
import Button from '@/components/shared/Button'
import { Table } from '@components/shared/Table'
import type { ColumnDef } from '@components/shared/Table'
import { TextField } from '@components/shared/TextField'
import { Dialog, DialogHead, DialogBody, DialogFoot } from '@components/shared/Dialog'
import { ConfirmDialog } from '@/components/dialogs/TicketDialogs'
import type { SupportTypeDto } from '@t/dtos'

export default function CatalogTypes() {
  const qc = useQueryClient()
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [name, setName] = useState('')

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

  const createMutation = useMutation({
    mutationFn: () => supportTypeService.create({ departmentId: activeDeptId!, name: name.trim() }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['supportTypes'] })
      setShowCreate(false); setName('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => supportTypeService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['supportTypes'] }),
  })

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
      size: 140,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="text" size="sm" leading="edit">Editar</Button>
          <Button variant="text" size="sm" leading="delete"
            onClick={() => setDeleteId(row.original.supportTypeId)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ], [])

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Catálogo</p>
            <h1 className="text-[32px] leading-10 font-semibold text-on-surface">Tipos de soporte</h1>
            <p className="text-sm text-on-surface-variant mt-1">Cada tipo define la prioridad sugerida y el SLA por defecto.</p>
          </div>
          <Button leading="add" onClick={() => setShowCreate(true)}>Nuevo tipo</Button>
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

      {showCreate && (
        <Dialog onClose={() => setShowCreate(false)}>
          <DialogHead icon="add_circle" title="Nuevo tipo de soporte" onClose={() => setShowCreate(false)} />
          <DialogBody>
            <TextField label="Nombre" required value={name} onChange={e => setName(e.target.value)}
              helperText={`Departamento: ${departments.find(d => d.departmentId === activeDeptId)?.name ?? '—'}`}
            />
          </DialogBody>
          <DialogFoot>
            <Button variant="text" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button
              disabled={name.trim().length < 3 || !activeDeptId || createMutation.isPending}
              onClick={() => createMutation.mutate()}>
              {createMutation.isPending ? 'Creando…' : 'Crear'}
            </Button>
          </DialogFoot>
        </Dialog>
      )}

      {deleteId !== null && (
        <ConfirmDialog
          icon="delete" title="Eliminar tipo de soporte"
          body="Esta acción desactivará el tipo de soporte. Los tickets existentes no se verán afectados."
          confirmLabel="Eliminar" confirmVariant="outlined"
          onClose={() => setDeleteId(null)}
          onConfirm={() => { deleteMutation.mutate(deleteId!); setDeleteId(null) }}
        />
      )}
    </>
  )
}

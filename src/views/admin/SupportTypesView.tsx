import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { departmentService } from '@api/services'
import { supportTypeService } from '@api/services'
import Button from '@/components/shared/Button'

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
          <button key={d.departmentId}
            onClick={() => setSelectedDeptId(d.departmentId)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeDeptId === d.departmentId ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}>
            {d.name}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-surface-container-low">
              {['ID', 'Nombre', 'Estado', ''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {types.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-on-surface-variant">Sin tipos para este departamento.</td></tr>
            ) : types.map(t => (
              <tr key={t.supportTypeId} className="hover:bg-surface-container-low transition-colors">
                <td className="px-5 py-4 font-mono text-xs font-bold text-primary">T{String(t.supportTypeId).padStart(3, '0')}</td>
                <td className="px-5 py-4 font-semibold text-on-surface">{t.name}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    t.isEnabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {t.isEnabled ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-5 py-4"><Button variant="text" size="sm" leading="edit">Editar</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

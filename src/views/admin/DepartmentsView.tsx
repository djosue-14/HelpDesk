import { useQuery } from '@tanstack/react-query'
import { departmentService } from '@api/services'
import { supportTypeService } from '@api/services'
import { HD_DEPARTMENTS } from '@data/seed'
import Button from '@/components/shared/Button'
import Icon from '@/components/shared/Icon'

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

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Catálogo</p>
          <h1 className="text-[32px] leading-10 font-semibold text-on-surface">Departamentos</h1>
        </div>
        <Button leading="add">Nuevo departamento</Button>
      </div>

      <div className="bg-white dark:bg-dark-surface-container rounded-xl border border-slate-100 dark:border-dark-outline-variant shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-dark-outline-variant bg-surface-container-low dark:bg-dark-surface-container-low">
              {['ID', 'Nombre', 'Tipos de soporte', 'Coordinador', 'Estado', ''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-dark-on-surface-variant uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-dark-outline-variant/30">
            {isLoading ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-on-surface-variant">Cargando…</td></tr>
            ) : departments.map(d => {
              const { color, icon } = getSeedVisuals(d.name)
              return (
                <tr key={d.departmentId} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-primary">D{String(d.departmentId).padStart(2, '0')}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                        style={{ background: color }}>
                        <Icon name={icon} size={16} fill={1} />
                      </span>
                      <span className="font-semibold text-on-surface">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">{countTypes(d.departmentId)} tipos</td>
                  <td className="px-5 py-4 text-on-surface-variant">{d.coordinatorUserId ?? '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      d.isEnabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 dark:bg-dark-surface-container-high text-slate-600 dark:text-dark-on-surface-variant'
                    }`}>
                      {d.isEnabled ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Button variant="text" size="sm" leading="edit">Editar</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

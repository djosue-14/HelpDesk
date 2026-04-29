import { useQuery } from '@tanstack/react-query'
import { departmentService, supportTypeService } from '@api/services'
import { HD_PEOPLE } from '@/data/seed'
import Button from '@/components/shared/Button'
import Avatar from '@/components/shared/Avatar'
import SlaBar from '@/components/shared/SlaBar'

const AGENTS = ['alvaro', 'lucia', 'diego', 'carola', 'hector', 'ana']
const LOADS  = [60, 50, 78, 42, 55, 38]

export default function AssignmentsView() {
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getAll().then(r => r.data ?? []),
  })
  const { data: allTypes = [] } = useQuery({
    queryKey: ['supportTypes'],
    queryFn: () => supportTypeService.getAll().then(r => r.data ?? []),
  })

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

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-surface-container-low">
              {['Agente','Departamento','Tipos de soporte','Estado','Capacidad',''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {AGENTS.map((k, idx) => {
              const u = HD_PEOPLE[k]
              if (!u) return null
              const dept = departments.find(d => d.name === u.dept || d.departmentId === idx + 1)
              const deptTypes = allTypes.filter(t => t.departmentId === dept?.departmentId).slice(0, 3)
              const load = LOADS[idx]
              return (
                <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar user={u} size="md" />
                      <div>
                        <p className="font-semibold text-on-surface">{u.name}</p>
                        <p className="text-xs text-on-surface-variant">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">{dept?.name ?? u.dept}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {deptTypes.map(t => (
                        <span key={t.supportTypeId} className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary text-white">{t.name}</span>
                      ))}
                      <button className="px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-outline-variant text-on-surface-variant hover:bg-surface-container">+ Añadir</button>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">Disponible</span>
                  </td>
                  <td className="px-5 py-4 min-w-[140px]">
                    <p className="text-xs text-on-surface-variant mb-1">Carga {load}%</p>
                    <SlaBar pct={load} state="green" />
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

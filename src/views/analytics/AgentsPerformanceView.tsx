import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@api/services'
import { hdGetPersonByUsername, HD_DEPARTMENTS } from '@data/seed'
import Avatar from '@/components/shared/Avatar'
import SlaBar from '@/components/shared/SlaBar'
import { Stars } from '@/components/shared/Stars'

export default function AgentsPerformance() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => dashboardService.getLeaderboard().then(r => r.data),
  })

  const entries = leaderboard?.top10 ?? []

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Equipo</p>
        <h1 className="text-[32px] leading-10 font-semibold text-on-surface">Rendimiento de agentes</h1>
        <p className="text-sm text-on-surface-variant mt-1">Carga, productividad y satisfacción del equipo.</p>
      </div>

      <div className="bg-white dark:bg-dark-surface-container rounded-xl border border-slate-100 dark:border-dark-outline-variant shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-dark-outline-variant bg-surface-container-low">
              {['#', 'Agente', 'Departamento', 'Cerrados (mes)', 'Cumpl. SLA', '⭐ Promedio', 'Puntos'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-dark-on-surface-variant uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-dark-outline-variant/30">
            {isLoading ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-on-surface-variant">Cargando…</td></tr>
            ) : entries.map(entry => {
              const person = hdGetPersonByUsername(entry.userId)
              const dept = person ? HD_DEPARTMENTS.find(d => d.id === person.dept) : null
              const avgRating = entry.ratingRatePct / 20
              const slaState = entry.ratingRatePct > 80 ? 'green' as const : entry.ratingRatePct > 60 ? 'yellow' as const : 'red' as const

              return (
                <tr key={entry.rank} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-5 py-4 font-bold text-on-surface-variant">#{entry.rank}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar user={person ?? undefined} size="md" />
                      <div>
                        <p className="font-semibold text-on-surface">{person?.name ?? entry.userId}</p>
                        <p className="text-xs text-on-surface-variant">@{entry.userId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">{dept?.name ?? '—'}</td>
                  <td className="px-5 py-4 text-on-surface">{entry.pointsEarned > 0 ? Math.round(entry.pointsEarned / 50) : '—'}</td>
                  <td className="px-5 py-4 min-w-[140px]">
                    <p className="text-xs mb-1"><strong>{entry.ratingRatePct.toFixed(1)}%</strong> satisfacción</p>
                    <SlaBar pct={entry.ratingRatePct} state={slaState} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Stars value={Math.round(avgRating)} size={14} />
                      <span className="text-xs text-on-surface-variant">{avgRating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-primary">{entry.pointsEarned.toLocaleString('es')}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

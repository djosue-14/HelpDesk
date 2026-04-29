import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@api/services'
import { hdGetPersonByUsername } from '@data/seed'
import Card from '@/components/shared/Card'
import Avatar from '@/components/shared/Avatar'
import { Stars } from '@/components/shared/Stars'

const MEDAL = (r: number) =>
  r === 1 ? 'bg-amber-100 text-amber-600 border-amber-300' :
  r === 2 ? 'bg-slate-100 text-slate-500 border-slate-300' :
            'bg-orange-100 text-orange-600 border-orange-300'

const GRAD = (r: number) =>
  r === 1 ? 'from-amber-50 to-white' :
  r === 2 ? 'from-slate-50 to-white' :
            'from-orange-50 to-white'

export default function LeaderboardView() {
  const [period, setPeriod] = useState('month')

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => dashboardService.getLeaderboard().then(r => r.data),
  })

  const entries = leaderboard?.top10 ?? []
  const podium = entries.slice(0, 3)
  const rest = entries.slice(3)
  const podiumOrder = [podium[1], podium[0], podium[2]]

  const monthLabel = leaderboard
    ? new Date(leaderboard.year, leaderboard.month - 1).toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })
    : '—'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-on-surface-variant text-sm">Cargando ranking…</div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Ranking</p>
          <h1 className="text-[32px] leading-10 font-semibold text-on-surface capitalize">Top agentes — {monthLabel}</h1>
          <p className="text-sm text-on-surface-variant mt-1">Puntos = tickets cerrados · cumplimiento SLA · calificación promedio.</p>
        </div>
        <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden text-sm bg-white">
          {[['week','Semana'],['month','Mes'],['quarter','Trimestre']].map(([k,l]) => (
            <button key={k} onClick={() => setPeriod(k)}
              className={`px-4 py-2 font-medium transition-colors ${period === k ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 items-end">
        {podiumOrder.map((entry, i) => {
          if (!entry) return <div key={i} />
          const person = hdGetPersonByUsername(entry.userId)
          const isFirst = entry.rank === 1
          const avgRating = entry.ratingRatePct / 20
          return (
            <Card key={entry.rank}
              className={`bg-gradient-to-b ${GRAD(entry.rank)} text-center !p-6 ${isFirst ? 'ring-2 ring-amber-300' : ''}`}
              style={{ minHeight: isFirst ? 220 : 180 }}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg mx-auto mb-3 ${MEDAL(entry.rank)}`}>
                {entry.rank === 1 ? '🏆' : entry.rank}
              </div>
              <div className="flex justify-center mb-2"><Avatar user={person ?? undefined} size="lg" /></div>
              <p className="text-sm font-semibold text-on-surface mt-2">{person?.name ?? entry.userId}</p>
              <p className="text-xs text-on-surface-variant">@{entry.userId}</p>
              <p className="text-base font-bold text-primary mt-3">{entry.pointsEarned.toLocaleString('es')} pts</p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <Stars value={Math.round(avgRating)} size={14} />
                <span className="text-xs text-on-surface-variant">{avgRating.toFixed(1)}</span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Rest table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {rest.map(entry => {
          const person = hdGetPersonByUsername(entry.userId)
          const avgRating = entry.ratingRatePct / 20
          return (
            <div key={entry.rank} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-surface-container-low transition-colors">
              <span className="w-8 text-base font-bold text-slate-400 text-center">{entry.rank}</span>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar user={person ?? undefined} size="md" />
                <div>
                  <p className="text-sm font-semibold text-on-surface">{person?.name ?? entry.userId}</p>
                  <p className="text-xs text-on-surface-variant">@{entry.userId}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Stars value={Math.round(avgRating)} size={14} />
                <span className="text-xs text-on-surface-variant">{avgRating.toFixed(1)}</span>
              </div>
              <span className="text-base font-bold text-primary w-28 text-right">{entry.pointsEarned.toLocaleString('es')} pts</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

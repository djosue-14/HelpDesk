import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@api/services'
import Button from '@/components/shared/Button'
import Card from '@/components/shared/Card'
import Icon from '@/components/shared/Icon'
import { heatColor, heatTextColor } from '@/components/shared/Donut'

export default function HeatmapView() {
  const { data: heatmap, isLoading } = useQuery({
    queryKey: ['heatmap'],
    queryFn: () => dashboardService.getHeatmap().then(r => r.data),
  })

  const rows = heatmap?.rows ?? []
  const cols = rows[0]?.cells ?? []
  const colsTemplate = `200px ${'1fr '.repeat(cols.length)}`

  const max = rows.reduce((m, row) =>
    Math.max(m, ...(row.cells ?? []).map(c => c.ticketCount)), 1)

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Análisis</p>
          <h1 className="text-[32px] leading-10 font-semibold text-on-surface">Mapa de calor — Departamento × Tipo</h1>
          <p className="text-sm text-on-surface-variant mt-1">Distribución de tickets activos. Pasa el cursor para ver el detalle.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outlined" leading="calendar_today">Últimos 30 días</Button>
          <Button variant="outlined" leading="download">Exportar</Button>
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="py-16 text-center text-sm text-on-surface-variant">Cargando…</div>
        ) : (
          <>
            <div className="grid mb-1" style={{ gridTemplateColumns: colsTemplate }}>
              <div className="px-3 py-2 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Departamento</div>
              {cols.map((c, i) => (
                <div key={i} className="px-2 py-2 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">
                  {c.supportTypeName}
                </div>
              ))}
            </div>
            {rows.map((row, ri) => (
              <div key={ri} className="grid mb-1" style={{ gridTemplateColumns: colsTemplate }}>
                <div className="px-3 py-3 text-sm font-medium text-on-surface flex items-center">{row.departmentName}</div>
                {(row.cells ?? []).map((cell, ci) => (
                  <div key={ci}
                    className="mx-0.5 py-3 rounded-lg text-sm font-bold text-center transition-transform hover:scale-105 cursor-default"
                    style={{
                      background: heatColor(cell.ticketCount, max),
                      color: heatTextColor(cell.ticketCount, max),
                      minHeight: 44,
                    }}
                    title={`${row.departmentName} · ${cell.supportTypeName}: ${cell.ticketCount} ticket${cell.ticketCount === 1 ? '' : 's'}`}>
                    {cell.ticketCount || ''}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-on-surface mb-4">Insights rápidos</h3>
        <ul className="space-y-3">
          {[
            { icon: 'trending_up',  cls: 'text-green-700 dark:text-green-400', text: <span><strong>Tecnología · Soporte</strong> concentra el 22% de los tickets activos. Considera reforzar el equipo en horas pico.</span> },
            { icon: 'warning',      cls: 'text-red-700 dark:text-red-400',     text: <span><strong>Operaciones · Incidencias</strong> tiene 19 tickets críticos abiertos — segundo foco en volumen.</span> },
            { icon: 'auto_awesome', cls: 'text-primary',                        text: <span>Recursos Humanos atiende mayoría de <em>consultas</em>: candidato natural a base de conocimiento.</span> },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-on-surface">
              <Icon name={item.icon} size={18} className={`shrink-0 mt-0.5 ${item.cls}`} />
              {item.text}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

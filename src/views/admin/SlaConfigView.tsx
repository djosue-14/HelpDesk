import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { slaConfigurationService } from '@api/services'
import Button from '@/components/shared/Button'
import Card from '@/components/shared/Card'
import PriorityChip from '@/components/shared/PriorityChip'
import type { TicketPriority } from '@t/enums'

const INITIAL_RESP: Record<TicketPriority, string> = {
  Critical: '15 min', High: '1 h', Medium: '4 h', Low: '8 h',
}
const AMBER_THR: Record<TicketPriority, string> = {
  Critical: '60%', High: '70%', Medium: '70%', Low: '70%',
}

export default function SlaConfigView() {
  const [autoEsc, setAutoEsc] = useState(true)
  const [pauseWaiting, setPauseWaiting] = useState(true)
  const [bizOnly, setBizOnly] = useState(false)

  const { data: slaConfigs = [] } = useQuery({
    queryKey: ['slaConfigurations'],
    queryFn: () => slaConfigurationService.getAll().then(r => r.data ?? []),
  })

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Configuración</p>
          <h1 className="text-[32px] leading-10 font-semibold text-on-surface">SLA y reglas de operación</h1>
        </div>
        <Button leading="save">Guardar cambios</Button>
      </div>

      <Card>
        <h3 className="text-base font-semibold text-on-surface mb-5">Tiempos por prioridad</h3>
        <div className="grid grid-cols-4 gap-4">
          {slaConfigs.map(cfg => {
            const prio = cfg.priority as TicketPriority
            return (
              <div key={cfg.slaConfigurationId} className="bg-surface-container rounded-xl p-4 space-y-3">
                <PriorityChip id={prio} />
                {[
                  { label: 'Resp. inicial', value: INITIAL_RESP[prio] ?? '—' },
                  { label: 'Resolución',    value: `${cfg.hoursLimit} h`      },
                  { label: 'Umbral ámbar',  value: AMBER_THR[prio] ?? '70%'  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label className="text-xs font-medium text-on-surface-variant">{label}</label>
                    <input
                      className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:border-primary bg-white"
                      defaultValue={value}
                    />
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-on-surface mb-5">Reglas globales</h3>
        <div className="space-y-5">
          {[
            { checked: autoEsc, onChange: setAutoEsc,
              title: 'Escalación automática al 80% del SLA',
              desc: 'Notifica al coordinador del departamento cuando un ticket alcanza el umbral.' },
            { checked: pauseWaiting, onChange: setPauseWaiting,
              title: 'Pausar SLA cuando el ticket esté «Esperando información»',
              desc: 'El cronómetro se reanuda al recibir respuesta del solicitante.' },
            { checked: bizOnly, onChange: setBizOnly,
              title: 'Contar sólo horas hábiles (L–V, 9:00–18:00)',
              desc: 'Útil para departamentos no operativos 24/7.' },
          ].map(({ checked, onChange, title, desc }) => (
            <label key={title} className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={checked}
                onChange={e => onChange(e.target.checked)} className="mt-1 accent-primary" />
              <div>
                <p className="text-sm font-semibold text-on-surface">{title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-on-surface mb-4">Calendario de no-laborales</h3>
        <div className="flex flex-wrap gap-2">
          {['1 ene · Año Nuevo','21 mar · Benemérito Juárez','1 may · Trabajo','16 sep · Independencia','20 nov · Revolución','25 dic · Navidad'].map(d => (
            <span key={d} className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary text-white">{d}</span>
          ))}
          <button className="px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-outline-variant text-on-surface-variant hover:bg-surface-container">
            + Añadir fecha
          </button>
        </div>
      </Card>
    </div>
  )
}

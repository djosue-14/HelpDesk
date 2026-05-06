import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { slaConfigurationService } from '@api/services'
import Button from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { PageHeader } from '@components/shared/PageHeader'
import { Toggle } from '@/components/shared/Toggle'
import { PriorityChip } from '@components/shared/Chip'
import { TextField } from '@/components/shared/TextField'
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
      <PageHeader
        label="Configuración"
        title="SLA y reglas de operación"
        actions={<Button leading="save">Guardar cambios</Button>}
      />
      <Card> <h3 className="text-base font-semibold text-on-surface mb-5">Tiempos por prioridad</h3> <div className="grid grid-cols-4 gap-4">
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
                  <TextField
                    key={label}
                    label={label}
                    defaultValue={value}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-on-surface mb-5">Reglas globales</h3> <div className="space-y-5">
          {[
            { checked: autoEsc,      onChange: setAutoEsc,
              title: 'Escalación automática al 80% del SLA',
              desc:  'Notifica al coordinador del departamento cuando un ticket alcanza el umbral.' },
            { checked: pauseWaiting, onChange: setPauseWaiting,
              title: 'Pausar SLA cuando el ticket esté «Esperando información»',
              desc:  'El cronómetro se reanuda al recibir respuesta del solicitante.' },
            { checked: bizOnly,      onChange: setBizOnly,
              title: 'Contar sólo horas hábiles (L–V, 9:00–18:00)',
              desc:  'Útil para departamentos no operativos 24/7.' },
          ].map(({ checked, onChange, title, desc }) => (
            <Toggle key={title} checked={checked} onChange={onChange} label={title} description={desc} />
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-on-surface mb-4">Calendario de no-laborales</h3> <div className="flex flex-wrap gap-2">
          {['1 ene · Año Nuevo','21 mar · Benemérito Juárez','1 may · Trabajo','16 sep · Independencia','20 nov · Revolución','25 dic · Navidad'].map(d => (
            <span key={d} className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary text-white">{d}</span>
          ))}
          <button className="px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-outline-variant text-on-surface-variant hover:bg-surface-container"> + Añadir fecha </button> </div> </Card> </div> )}

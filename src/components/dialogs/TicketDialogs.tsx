import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { departmentService, supportTypeService, ticketService } from '@api/services'
import Button from '@/components/shared/Button'
import Icon from '@/components/shared/Icon'
import { StarsInput } from '@/components/shared/Stars'
import { TextField } from '@/components/shared/TextField'
import type { TicketPriority } from '@t/enums'

const PRIORITIES: { id: TicketPriority; name: string; sla: string }[] = [
  { id: 'Critical', name: 'Crítica', sla: '2 h'  },
  { id: 'High',     name: 'Alta',    sla: '8 h'  },
  { id: 'Medium',   name: 'Media',   sla: '24 h' },
  { id: 'Low',      name: 'Baja',    sla: '72 h' },
]

/* ── Scrim / shell ── */
function Scrim({ onClose, children, wide }: { onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className={`relative bg-white dark:bg-dark-surface-container rounded-2xl shadow-2xl flex flex-col overflow-hidden ${wide ? 'w-[720px]' : 'w-[480px]'} max-h-[90vh]`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

function DialogHead({ icon, title, onClose }: { icon: string; title: string; onClose: () => void }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-dark-outline-variant">
      <Icon name={icon} size={22} className="text-primary" /> <h3 className="text-base font-semibold text-on-surface flex-1">{title}</h3>
      <button onClick={onClose} className="p-1 text-slate-400 dark:text-dark-on-surface-variant hover:text-on-surface rounded transition-colors"> <Icon name="close" size={20} />
      </button>
    </div>
  )
}

function DialogBody({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-5 flex-1 overflow-y-auto flex flex-col gap-4">{children}</div>
}

function DialogFoot({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 dark:border-dark-outline-variant">{children}</div>
}

function Field({ label, required, helper, children }: { label: string; required?: boolean; helper?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1"> <label className="text-xs font-semibold text-on-surface-variant">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {children}
      {helper && <span className="text-xs text-on-surface-variant">{helper}</span>}
    </div>
  )
}

const selectCls = 'w-full border border-slate-200 dark:border-dark-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary bg-surface-container-low'

/* ── Create ticket ── */
export function CreateTicketDialog({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const qc = useQueryClient()
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getAll().then(r => r.data ?? []),
  })
  const { data: allTypes = [] } = useQuery({
    queryKey: ['supportTypes'],
    queryFn: () => supportTypeService.getAll().then(r => r.data ?? []),
  })

  const [deptId, setDeptId] = useState<number | null>(null)
  const [typeId, setTypeId] = useState<number | null>(null)
  const [subject, setSubject] = useState('')
  const [desc, setDesc] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('Medium')

  useEffect(() => {
    if (departments.length && deptId === null) {
      const first = departments[0]
      setDeptId(first.departmentId)
      const firstType = allTypes.find(t => t.departmentId === first.departmentId)
      if (firstType) setTypeId(firstType.supportTypeId)
    }
  }, [departments, allTypes, deptId])

  const types = allTypes.filter(t => t.departmentId === deptId)
  const valid = subject.length >= 8 && desc.length >= 12 && deptId !== null && typeId !== null

  const pickDept = (id: number) => {
    setDeptId(id)
    const firstType = allTypes.find(t => t.departmentId === id)
    setTypeId(firstType?.supportTypeId ?? null)
  }

  const createMutation = useMutation({
    mutationFn: () => ticketService.create({
      departmentId: deptId!,
      supportTypeId: typeId!,
      priority,
      subject,
      description: desc,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tickets'] })
      onCreated()
    },
  })

  return (
    <Scrim onClose={onClose} wide>
      <DialogHead icon="add_circle" title="Crear nuevo ticket" onClose={onClose} />
      <DialogBody>
        <div className="grid grid-cols-2 gap-4"> <Field label="Departamento" required helper="A quién va dirigida la solicitud.">
            <select className={selectCls} value={deptId ?? ''} onChange={e => pickDept(Number(e.target.value))}>
              {departments.map(d => <option key={d.departmentId} value={d.departmentId}>{d.name}</option>)}
            </select>
          </Field>
          <Field label="Tipo de soporte" required helper="Define la prioridad sugerida y el SLA.">
            <select className={selectCls} value={typeId ?? ''} onChange={e => setTypeId(Number(e.target.value))}>
              {types.map(t => <option key={t.supportTypeId} value={t.supportTypeId}>{t.name}</option>)}
            </select>
          </Field>
        </div>

        <TextField
          label="Asunto" required
          placeholder="Resume el problema en una línea"
          value={subject} onChange={e => setSubject(e.target.value)} maxLength={120}
          helperText={`${subject.length}/120 caracteres`}
        />

        <TextField
          label="Descripción" required multiline rows={4}
          placeholder="Cuéntanos qué pasó, desde cuándo, qué intentaste y cualquier detalle útil."
          value={desc} onChange={e => setDesc(e.target.value)}
        />

        <Field label="Prioridad" helper="El coordinador puede ajustar la prioridad después.">
          <div className="grid grid-cols-4 gap-2">
            {PRIORITIES.map(p => (
              <button key={p.id} type="button"
                onClick={() => setPriority(p.id)}
                className={`flex flex-col items-center gap-0.5 p-3 rounded-xl border-2 text-xs font-semibold transition-colors ${
                  priority === p.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-dark-outline-variant text-on-surface-variant hover:border-slate-300 dark:hover:border-dark-outline-variant'
                }`}>
                <span>{p.name}</span>
                <span className="font-normal opacity-70">SLA {p.sla}</span>
              </button>
            ))}
          </div>
        </Field>

        <Field label="Archivos adjuntos">
          <div className="border-2 border-dashed border-slate-200 dark:border-dark-outline-variant rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer"> <Icon name="cloud_upload" size={28} className="text-slate-400 mx-auto mb-2" /> <p className="text-sm text-on-surface"> <span className="text-primary font-semibold">Selecciona</span> o arrastra archivos aquí </p> <p className="text-xs text-on-surface-variant mt-1">PNG, JPG, PDF, ZIP · Hasta 10 MB cada uno</p> </div> </Field> </DialogBody> <DialogFoot> <Button variant="text" onClick={onClose}>Cancelar</Button>
        <Button variant="outlined" leading="save">Guardar borrador</Button>
        <Button leading="send" disabled={!valid || createMutation.isPending}
          onClick={() => createMutation.mutate()}>
          {createMutation.isPending ? 'Enviando…' : 'Enviar ticket'}
        </Button>
      </DialogFoot>
    </Scrim>
  )
}

/* ── Confirm dialog (generic) ── */
export function ConfirmDialog({
  icon, title, body, confirmLabel, confirmVariant = 'filled', onClose, onConfirm,
}: {
  icon?: string; title: string; body: string;
  confirmLabel: string; confirmVariant?: 'filled' | 'outlined'
  onClose: () => void; onConfirm: () => void
}) {
  return (
    <Scrim onClose={onClose}>
      <DialogHead icon={icon ?? 'help'} title={title} onClose={onClose} />
      <DialogBody><p className="text-sm text-on-surface-variant">{body}</p></DialogBody>
      <DialogFoot>
        <Button variant="text" onClick={onClose}>Cancelar</Button>
        <Button variant={confirmVariant} onClick={onConfirm}>{confirmLabel}</Button>
      </DialogFoot>
    </Scrim>
  )
}

/* ── Close ticket ── */
export function CloseTicketDialog({ ticketCode, onClose, onConfirm }: { ticketCode: string; onClose: () => void; onConfirm: (resolution: string) => void }) {
  const [resolution, setResolution] = useState('')
  return (
    <Scrim onClose={onClose}>
      <DialogHead icon="check_circle" title={`Cerrar ticket ${ticketCode}`} onClose={onClose} />
      <DialogBody>
        <p className="text-sm text-on-surface-variant"> Describe la solución para que el solicitante entienda cómo se resolvió. </p>
        <TextField
          label="Resolución" required multiline rows={4}
          value={resolution} onChange={e => setResolution(e.target.value)}
          placeholder="Ej. Se actualizó el firmware del dock WD19TBS a la versión 01.00.16; pantalla externa estable."
        />
        <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-container text-sm text-on-surface-variant"> <Icon name="info" size={16} className="text-primary shrink-0" /> El solicitante podrá calificar tu atención al cerrar. </div> </DialogBody> <DialogFoot> <Button variant="text" onClick={onClose}>Cancelar</Button>
        <Button leading="check_circle" disabled={resolution.length < 5} onClick={() => onConfirm(resolution)}>Cerrar ticket</Button>
      </DialogFoot>
    </Scrim>
  )
}

/* ── Redirect ticket ── */
export function RedirectDialog({ ticketCode, onClose, onConfirm }: { ticketCode: string; onClose: () => void; onConfirm: () => void }) {
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentService.getAll().then(r => r.data ?? []),
  })
  const { data: allTypes = [] } = useQuery({
    queryKey: ['supportTypes'],
    queryFn: () => supportTypeService.getAll().then(r => r.data ?? []),
  })

  const [deptId, setDeptId] = useState<number | null>(null)
  const [typeId, setTypeId] = useState<number | null>(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (departments.length && deptId === null) {
      const first = departments[0]
      setDeptId(first.departmentId)
      const firstType = allTypes.find(t => t.departmentId === first.departmentId)
      if (firstType) setTypeId(firstType.supportTypeId)
    }
  }, [departments, allTypes, deptId])

  const types = allTypes.filter(t => t.departmentId === deptId)

  return (
    <Scrim onClose={onClose}>
      <DialogHead icon="alt_route" title={`Redirigir ${ticketCode}`} onClose={onClose} />
      <DialogBody>
        <p className="text-sm text-on-surface-variant"> Reasigna este ticket a otro departamento. El SLA se reinicia al ser tomado. </p> <div className="grid grid-cols-2 gap-4"> <Field label="Departamento">
            <select className={selectCls} value={deptId ?? ''} onChange={e => {
              const id = Number(e.target.value)
              setDeptId(id)
              setTypeId(allTypes.find(t => t.departmentId === id)?.supportTypeId ?? null)
            }}>
              {departments.map(d => <option key={d.departmentId} value={d.departmentId}>{d.name}</option>)}
            </select>
          </Field>
          <Field label="Tipo de soporte">
            <select className={selectCls} value={typeId ?? ''} onChange={e => setTypeId(Number(e.target.value))}>
              {types.map(t => <option key={t.supportTypeId} value={t.supportTypeId}>{t.name}</option>)}
            </select>
          </Field>
        </div>
        <TextField
          label="Motivo" multiline rows={3}
          value={reason} onChange={e => setReason(e.target.value)}
          placeholder="Explica brevemente por qué se redirige."
        />
      </DialogBody>
      <DialogFoot>
        <Button variant="text" onClick={onClose}>Cancelar</Button>
        <Button leading="alt_route" onClick={onConfirm}>Redirigir</Button>
      </DialogFoot>
    </Scrim>
  )
}

/* ── Rate dialog ── */
export function RateDialog({ ticketCode, onClose, onConfirm }: { ticketCode: string; onClose: () => void; onConfirm: (stars: number, text: string, tags: string[]) => void }) {
  const [stars, setStars] = useState(0)
  const [text, setText] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const tags = ['Rapidez', 'Claridad', 'Amabilidad', 'Solución completa', 'Falta seguimiento']
  const tog = (t: string) => setPicked(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const STAR_LABELS = ['—', 'Muy insatisfecho', 'Insatisfecho', 'Neutral', 'Satisfecho', 'Muy satisfecho']

  return (
    <Scrim onClose={onClose}>
      <DialogHead icon="reviews" title={`Califica ${ticketCode}`} onClose={onClose} />
      <DialogBody>
        <p className="text-base font-medium text-on-surface text-center">¿Qué tan satisfecho estás con la atención?</p> <div className="flex justify-center py-2">
          <StarsInput value={stars} onChange={setStars} />
        </div>
        <p className="text-sm text-on-surface-variant text-center min-h-5">{STAR_LABELS[stars]}</p>

        <Field label="¿Qué destacas?">
          <div className="flex flex-wrap gap-2">
            {tags.map(t => (
              <button key={t} type="button"
                onClick={() => tog(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  picked.includes(t) ? 'bg-primary text-white dark:text-dark-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </Field>

        <TextField
          label="Comentario (opcional)" multiline rows={3}
          value={text} onChange={e => setText(e.target.value)}
          placeholder="Cuéntanos cómo fue tu experiencia."
        />
      </DialogBody>
      <DialogFoot>
        <Button variant="text" onClick={onClose}>Más tarde</Button>
        <Button leading="send" disabled={stars === 0} onClick={() => onConfirm(stars, text, picked)}>Enviar calificación</Button>
      </DialogFoot>
    </Scrim>
  )
}

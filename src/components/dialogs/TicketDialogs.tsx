import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { departmentService, supportTypeService, ticketService } from '@api/services'
import Button from '@/components/shared/Button'
import Icon from '@/components/shared/Icon'
import { StarsInput } from '@/components/shared/Stars'
import { TextField } from '@/components/shared/TextField'
import { Autocomplete } from '@/components/shared/Autocomplete'
import { Dialog, DialogHead, DialogBody, DialogFoot, DialogField } from '@/components/shared/Dialog'
import type { TicketPriority } from '@t/enums'

const PRIORITIES: { id: TicketPriority; name: string; sla: string }[] = [
  { id: 'Critical', name: 'Crítica', sla: '2 h'  },
  { id: 'High',     name: 'Alta',    sla: '8 h'  },
  { id: 'Medium',   name: 'Media',   sla: '24 h' },
  { id: 'Low',      name: 'Baja',    sla: '72 h' },
]

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
    <Dialog onClose={onClose} wide>
      <DialogHead icon="add_circle" title="Crear nuevo ticket" onClose={onClose} />
      <DialogBody>
        <div className="grid grid-cols-2 gap-4">
          <Autocomplete
            label="Departamento" required
            placeholder="Buscar departamento…"
            helperText="A quién va dirigida la solicitud."
            value={deptId}
            onChange={(v) => {
              if (v === null) { setDeptId(null); setTypeId(null) }
              else pickDept(Number(v))
            }}
            options={departments.map(d => ({ value: d.departmentId, label: d.name ?? '' }))}
          />
          <Autocomplete
            label="Tipo de soporte" required
            placeholder="Buscar tipo…"
            helperText="Define la prioridad sugerida y el SLA."
            value={typeId}
            onChange={(v) => setTypeId(v !== null ? Number(v) : null)}
            options={types.map(t => ({ value: t.supportTypeId, label: t.name ?? '' }))}
          />
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

        <DialogField label="Prioridad" helper="El coordinador puede ajustar la prioridad después.">
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
        </DialogField>

        <DialogField label="Archivos adjuntos">
          <div className="border-2 border-dashed border-slate-200 dark:border-dark-outline-variant rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
            <Icon name="cloud_upload" size={28} className="text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-on-surface">
              <span className="text-primary font-semibold">Selecciona</span> o arrastra archivos aquí
            </p>
            <p className="text-xs text-on-surface-variant mt-1">PNG, JPG, PDF, ZIP · Hasta 10 MB cada uno</p>
          </div>
        </DialogField>
      </DialogBody>
      <DialogFoot>
        <Button variant="text" onClick={onClose}>Cancelar</Button>
        <Button variant="outlined" leading="save">Guardar borrador</Button>
        <Button leading="send" disabled={!valid || createMutation.isPending}
          onClick={() => createMutation.mutate()}>
          {createMutation.isPending ? 'Enviando…' : 'Enviar ticket'}
        </Button>
      </DialogFoot>
    </Dialog>
  )
}

/* ── Confirm dialog (generic) ── */
export function ConfirmDialog({
  icon, title, body, confirmLabel, confirmVariant = 'filled', onClose, onConfirm,
}: {
  icon?: string; title: string; body: string
  confirmLabel: string; confirmVariant?: 'filled' | 'outlined'
  onClose: () => void; onConfirm: () => void
}) {
  return (
    <Dialog onClose={onClose}>
      <DialogHead icon={icon ?? 'help'} title={title} onClose={onClose} />
      <DialogBody>
        <p className="text-sm text-on-surface-variant">{body}</p>
      </DialogBody>
      <DialogFoot>
        <Button variant="text" onClick={onClose}>Cancelar</Button>
        <Button variant={confirmVariant} onClick={onConfirm}>{confirmLabel}</Button>
      </DialogFoot>
    </Dialog>
  )
}

/* ── Close ticket ── */
export function CloseTicketDialog({ ticketCode, onClose, onConfirm }: { ticketCode: string; onClose: () => void; onConfirm: (resolution: string) => void }) {
  const [resolution, setResolution] = useState('')
  return (
    <Dialog onClose={onClose}>
      <DialogHead icon="check_circle" title={`Cerrar ticket ${ticketCode}`} onClose={onClose} />
      <DialogBody>
        <p className="text-sm text-on-surface-variant">
          Describe la solución para que el solicitante entienda cómo se resolvió.
        </p>
        <TextField
          label="Resolución" required multiline rows={4}
          value={resolution} onChange={e => setResolution(e.target.value)}
          placeholder="Ej. Se actualizó el firmware del dock WD19TBS a la versión 01.00.16; pantalla externa estable."
        />
        <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-container text-sm text-on-surface-variant">
          <Icon name="info" size={16} className="text-primary shrink-0" />
          El solicitante podrá calificar tu atención al cerrar.
        </div>
      </DialogBody>
      <DialogFoot>
        <Button variant="text" onClick={onClose}>Cancelar</Button>
        <Button leading="check_circle" disabled={resolution.length < 5} onClick={() => onConfirm(resolution)}>
          Cerrar ticket
        </Button>
      </DialogFoot>
    </Dialog>
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
    <Dialog onClose={onClose}>
      <DialogHead icon="alt_route" title={`Redirigir ${ticketCode}`} onClose={onClose} />
      <DialogBody>
        <p className="text-sm text-on-surface-variant">
          Reasigna este ticket a otro departamento. El SLA se reinicia al ser tomado.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Autocomplete
            label="Departamento"
            placeholder="Buscar departamento…"
            value={deptId}
            onChange={(v) => {
              if (v === null) { setDeptId(null); setTypeId(null) }
              else {
                const id = Number(v)
                setDeptId(id)
                setTypeId(allTypes.find(t => t.departmentId === id)?.supportTypeId ?? null)
              }
            }}
            options={departments.map(d => ({ value: d.departmentId, label: d.name ?? '' }))}
          />
          <Autocomplete
            label="Tipo de soporte"
            placeholder="Buscar tipo…"
            value={typeId}
            onChange={(v) => setTypeId(v !== null ? Number(v) : null)}
            options={types.map(t => ({ value: t.supportTypeId, label: t.name ?? '' }))}
          />
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
    </Dialog>
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
    <Dialog onClose={onClose}>
      <DialogHead icon="reviews" title={`Califica ${ticketCode}`} onClose={onClose} />
      <DialogBody>
        <p className="text-base font-medium text-on-surface text-center">
          ¿Qué tan satisfecho estás con la atención?
        </p>
        <div className="flex justify-center py-2">
          <StarsInput value={stars} onChange={setStars} />
        </div>
        <p className="text-sm text-on-surface-variant text-center min-h-5">{STAR_LABELS[stars]}</p>

        <DialogField label="¿Qué destacas?">
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
        </DialogField>

        <TextField
          label="Comentario (opcional)" multiline rows={3}
          value={text} onChange={e => setText(e.target.value)}
          placeholder="Cuéntanos cómo fue tu experiencia."
        />
      </DialogBody>
      <DialogFoot>
        <Button variant="text" onClick={onClose}>Más tarde</Button>
        <Button leading="send" disabled={stars === 0} onClick={() => onConfirm(stars, text, picked)}>
          Enviar calificación
        </Button>
      </DialogFoot>
    </Dialog>
  )
}

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketService, ticketCommentService, scoreService } from '@api/services'
import { hdGetPersonByUsername, HD_HISTORY } from '@data/seed'
import Avatar from '@/components/shared/Avatar'
import Button from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import Icon from '@/components/shared/Icon'
import { StatusChip, PriorityChip } from '@components/shared/Chip'
import SlaTraffic from '@/components/shared/SlaTraffic'
import SlaBar from '@/components/shared/SlaBar'
import { Tabs } from '@/components/shared/Tabs'
import {
  CloseTicketDialog,
  RedirectDialog,
  RateDialog,
  ConfirmDialog,
} from '@/components/dialogs/TicketDialogs'
import { TextField } from '@/components/shared/TextField'
import type { Role } from '@/data/types'
import type { TicketStatus, TicketPriority } from '@t/enums'
import type { TicketCommentDto } from '@t/dtos'
import type { SlaState } from '@/data/types'

const PRIORITIES: { id: TicketPriority; name: string }[] = [
  { id: 'Critical', name: 'Crítica' },
  { id: 'High',     name: 'Alta'    },
  { id: 'Medium',   name: 'Media'   },
  { id: 'Low',      name: 'Baja'    },
]

type Tab = 'thread' | 'history' | 'attachments'
type DialogType = 'close' | 'redirect' | 'rate' | 'waiting' | 'cancel' | 'reopen' | null

interface Props {
  role: Role
}

function getSlaState(remainingPct: number, status?: TicketStatus | null): SlaState {
  if (status === 'WaitingForInfo') return 'paused'
  if (remainingPct > 50) return 'green'
  if (remainingPct > 25) return 'yellow'
  return 'red'
}

function formatSlaLabel(deadline: string, status: TicketStatus | null | undefined): string {
  if (status === 'WaitingForInfo') return 'Pausado'
  const ms = new Date(deadline).getTime() - Date.now()
  if (ms <= 0) return 'Vencido'
  const hours = Math.floor(ms / 3600000)
  if (hours < 1) return `${Math.floor(ms / 60000)}m restantes`
  if (hours < 24) return `${hours}h restantes`
  return `${Math.floor(hours / 24)}d restantes`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getFileIcon(ext: string | null): string {
  if (!ext) return 'attach_file'
  const e = ext.toLowerCase()
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(e)) return 'image'
  if (e === 'pdf') return 'picture_as_pdf'
  if (['zip', 'rar', '7z'].includes(e)) return 'folder_zip'
  return 'attach_file'
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function TicketDetail({ role }: Props) {
  const { id: idParam = '' } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<Tab>('thread')
  const [composer, setComposer] = useState('')
  const [internal, setInternal] = useState(false)
  const [dialog, setDialog] = useState<DialogType>(null)
  const [localComments, setLocalComments] = useState<TicketCommentDto[]>([])

  // Support both old 'TK-2284' and new numeric string '2284'
  const numericId = idParam.startsWith('TK-')
    ? parseInt(idParam.replace('TK-', ''), 10)
    : parseInt(idParam, 10)

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', numericId],
    queryFn: () => ticketService.getById(numericId).then(r => r.data),
    enabled: !isNaN(numericId),
  })

  const addCommentMutation = useMutation({
    mutationFn: (content: string) =>
      ticketCommentService.add(numericId, {
        content,
        visibility: internal ? 'Internal' : 'Public',
      }),
    onSuccess: (res) => {
      if (res.data) setLocalComments(prev => [...prev, res.data!])
      queryClient.invalidateQueries({ queryKey: ['ticket', numericId] })
    },
  })

  const reopenMutation = useMutation({
    mutationFn: () => ticketService.reopen(numericId, { reason: '' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', numericId] })
      queryClient.invalidateQueries({ queryKey: ['requester-dashboard'] })
      setDialog(null)
    },
  })

  const rateMutation = useMutation({
    mutationFn: (hasComment: boolean) =>
      scoreService.rateTicket(numericId, { hasComment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', numericId] })
      setDialog(null)
    },
  })

  const closeMutation = useMutation({
    mutationFn: ({ resolutionCategory, closingComment }: { resolutionCategory: string; closingComment: string }) =>
      ticketService.close(numericId, { resolutionCategory, closingComment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', numericId] })
      queryClient.invalidateQueries({ queryKey: ['agent-dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      setDialog(null)
    },
  })

  const redirectMutation = useMutation({
    mutationFn: async ({ newSupportTypeId, reason }: { newSupportTypeId: number; reason: string }) => {
      const res = await ticketService.redirect(numericId, { newSupportTypeId })
      if (res.success && reason.trim())
        await ticketCommentService.add(numericId, { content: reason, visibility: 'Internal' })
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', numericId] })
      queryClient.invalidateQueries({ queryKey: ['agent-dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      setDialog(null)
    },
  })

  const waitingMutation = useMutation({
    mutationFn: () => ticketService.updateStatus(numericId, { newStatus: 'WaitingForInfo' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', numericId] })
      queryClient.invalidateQueries({ queryKey: ['agent-dashboard'] })
      setDialog(null)
    },
  })

  const isAgent = role.id === 'agent' || role.id === 'coordinator' || role.id === 'admin'
  const isRequester = role.id === 'requester'

  const send = () => {
    if (!composer.trim()) return
    addCommentMutation.mutate(composer)
    setComposer('')
    setInternal(false)
  }

  if (isLoading || !ticket) {
    return (
      <div className="flex items-center justify-center py-24 text-on-surface-variant text-sm">
        {isLoading ? 'Cargando ticket…' : 'Ticket no encontrado.'}
      </div>
    )
  }

  const ticketCode = `HD-${ticket.ticketNumber}`
  const requester = hdGetPersonByUsername(ticket.createdBy)
  const assignee = hdGetPersonByUsername(ticket.assignedAgentUsername)
  const slaState = getSlaState(ticket.remainingSlaPct, ticket.status)
  const slaLabel = formatSlaLabel(ticket.deadline, ticket.status)
  const slaConsumedPct = Math.round(100 - ticket.remainingSlaPct)

  const allComments = [...(ticket.comments ?? []), ...localComments]
  const legacyKey = `TK-${ticket.ticketNumber}`
  const history = HD_HISTORY[legacyKey] ?? HD_HISTORY['TK-2284'] ?? []

  return (
    <>
      <div className="space-y-4 max-w-[1400px]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <button onClick={() => navigate(-1)} className="hover:text-primary transition-colors">Tickets</button> <Icon name="chevron_right" size={16} />
          <span className="text-on-surface font-medium">{ticketCode}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-6"> <div className="min-w-0 flex-1"> <div className="flex items-center gap-2 flex-wrap mb-2"> <span className="font-mono text-sm font-bold text-primary">{ticketCode}</span>
              <StatusChip id={ticket.status} />
              <PriorityChip id={ticket.priority} />
              <SlaTraffic state={slaState} label={`SLA ${slaLabel}`} />
            </div>
            <h1 className="text-2xl font-semibold text-on-surface">{ticket.subject}</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              {ticket.departmentName} · {ticket.supportTypeName} · creado {formatDate(ticket.createdAt)} por {requester?.name ?? ticket.createdBy}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isAgent && ticket.status !== 'Closed' && (
              <>
                <Button variant="outlined" leading="hourglass_empty" size="sm" onClick={() => setDialog('waiting')}>Esperar info.</Button>
                <Button variant="outlined" leading="alt_route" size="sm" onClick={() => setDialog('redirect')}>Redirigir</Button>
                <Button leading="check_circle" size="sm" onClick={() => setDialog('close')}>Resolver y cerrar</Button>
              </>
            )}
            {isRequester && ticket.status === 'Closed' && (
              <>
                <Button variant="outlined" leading="restart_alt" size="sm" onClick={() => setDialog('reopen')}>Reabrir</Button>
                <Button leading="reviews" size="sm" onClick={() => setDialog('rate')}>Calificar</Button>
              </>
            )}
            {isRequester && ticket.status !== 'Closed' && (
              <Button variant="outlined" leading="cancel" size="sm" onClick={() => setDialog('cancel')}>Cancelar ticket</Button>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 300px' }}>
          {/* Left: tabs + content */}
          <div className="space-y-4">
            <Tabs
              value={tab}
              onChange={(id) => setTab(id as Tab)}
              tabs={[
                { id: 'thread',      icon: 'forum',       label: `Conversación (${allComments.length})` },
                { id: 'history',     icon: 'history',     label: 'Historial' },
                { id: 'attachments', icon: 'attach_file', label: `Adjuntos (${ticket.attachments?.length ?? 0})` },
              ]}
            />

            {/* Thread tab */}
            {tab === 'thread' && (
              <div className="space-y-4">
                {allComments.map(c => {
                  const author = hdGetPersonByUsername(c.authorId)
                  const isInternal = c.visibility === 'Internal'
                  return (
                    <div key={c.ticketCommentId} className={`flex gap-3 ${isInternal ? 'opacity-90' : ''}`}>
                      <Avatar user={author} size="md" />
                      <div className={`flex-1 min-w-0 rounded-xl p-4 ${
                        isInternal ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40' : 'bg-surface-container-low border border-slate-100 dark:border-dark-outline-variant/50'
                      }`}>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {isInternal && <Icon name="lock" size={14} className="text-amber-600 dark:text-amber-400" />} <span className="text-sm font-semibold text-on-surface">{author?.name ?? c.authorId}</span>
                          {isInternal && <span className="text-xs font-bold text-amber-700 dark:text-amber-400">· Nota interna</span>} <span className="ml-auto text-xs text-on-surface-variant">{formatDate(c.createdAt)}</span>
                        </div>
                        <p className="text-sm text-on-surface leading-relaxed">{c.content}</p>
                      </div>
                    </div>
                  )
                })}

                {allComments.length === 0 && (
                  <div className="text-sm text-center text-on-surface-variant py-8">Sin comentarios aún.</div> )}

                {/* Composer */}
                {ticket.status !== 'Closed' && (
                  <div className={`rounded-xl border p-4 ${internal ? 'border-amber-300 dark:border-amber-700/40 bg-amber-50 dark:bg-amber-900/20' : 'border-slate-200 dark:border-dark-outline-variant bg-white dark:bg-dark-surface-container'}`}>
                    <TextField
                      multiline
                      rows={3}
                      placeholder={internal ? 'Escribe una nota visible solo para agentes…' : 'Escribe una respuesta…'}
                      value={composer}
                      onChange={e => setComposer(e.target.value)}
                      className="[&_textarea]:border-none [&_textarea]:bg-transparent [&_textarea]:min-h-[80px]"
                    />
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-dark-outline-variant"> <button className="p-1.5 text-slate-400 dark:text-dark-on-surface-variant hover:text-primary rounded transition-colors" title="Adjuntar"> <Icon name="attach_file" size={18} />
                      </button>
                      {isAgent && (
                        <label className="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer ml-1"> <input type="checkbox" checked={internal} onChange={e => setInternal(e.target.checked)} />
                          Nota interna
                        </label>
                      )}
                      <span className="flex-1" /> <Button leading="send" size="sm" disabled={!composer.trim() || addCommentMutation.isPending} onClick={send}>
                        {addCommentMutation.isPending ? 'Enviando…' : 'Enviar'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* History tab */}
            {tab === 'history' && (
              <div className="space-y-1">
                {history.length === 0
                  ? <Card><p className="text-sm text-center text-on-surface-variant py-6">Sin historial disponible.</p></Card>
                  : history.map((h, i) => (
                    <div key={i} className="flex gap-4 py-3"> <div className="flex flex-col items-center gap-0.5"> <span className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                          <Icon name={h.icon} size={15} className="text-primary" />
                        </span>
                        {i < history.length - 1 && <span className="flex-1 w-px bg-slate-200 dark:bg-dark-outline-variant mt-1" />} </div> <div className="flex-1 pb-3"> <p className="text-sm text-on-surface">{h.text}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{h.when}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Attachments tab */}
            {tab === 'attachments' && (
              <div className="space-y-2">
                {!ticket.attachments || ticket.attachments.length === 0
                  ? <Card><p className="text-sm text-center text-on-surface-variant py-6">Sin archivos adjuntos.</p></Card>
                  : ticket.attachments.map(a => (
                    <div key={a.ticketAttachmentId} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-dark-outline-variant bg-white dark:bg-dark-surface-container">
                      <Icon name={getFileIcon(a.fileExtension)} size={20} className="text-primary" /> <span className="flex-1 text-sm font-medium text-on-surface">{a.originalFileName}</span>
                      <span className="text-xs text-on-surface-variant">{formatBytes(a.fileSizeBytes)}</span>
                      <Button variant="text" size="sm" leading="download">Descargar</Button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="space-y-4"> <Card> <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">Detalles</p> <div className="space-y-3">
                {[
                  { lbl: 'Solicitante', content: requester
                    ? <div className="flex items-center gap-2 mt-1"><Avatar user={requester} size="sm" /><span className="text-sm text-on-surface">{requester.name}</span></div>
                    : <span className="text-sm text-on-surface">{ticket.createdBy ?? '—'}</span>
                  },
                  { lbl: 'Asignado a', content: assignee
                    ? <div className="flex items-center gap-2 mt-1"><Avatar user={assignee} size="sm" /><span className="text-sm text-on-surface">{assignee.name}</span></div>
                    : <span className="text-sm text-on-surface-variant italic">— Sin asignar —</span>},
                  { lbl: 'Departamento',    content: <span className="text-sm text-on-surface">{ticket.departmentName ?? '—'}</span> },
                  { lbl: 'Tipo de soporte', content: <span className="text-sm text-on-surface">{ticket.supportTypeName ?? '—'}</span> },
                  { lbl: 'Creado',          content: <span className="text-sm text-on-surface">{formatDate(ticket.createdAt)}</span> },
                  { lbl: 'Vence',           content: <span className="text-sm text-on-surface">{formatDate(ticket.deadline)}</span> },
                ].map(({ lbl, content }) => (
                  <div key={lbl}>
                    <p className="text-xs text-on-surface-variant">{lbl}</p>
                    {content}
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">SLA</p> <div className="flex items-center justify-between mb-2">
                <SlaTraffic state={slaState} label={slaLabel} />
                <span className="text-xs text-on-surface-variant">{slaConsumedPct}% consumido</span>
              </div>
              <SlaBar pct={ticket.remainingSlaPct} state={slaState} />
              <p className="text-xs text-on-surface-variant mt-2">
                Tipo: «{ticket.supportTypeName}»
              </p>
            </Card>

            {isAgent && (
              <Card>
                <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">Cambiar prioridad</p> <div className="flex flex-wrap gap-1.5">
                  {PRIORITIES.map(p => (
                    <button key={p.id}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        ticket.priority === p.id
                          ? 'bg-primary text-white dark:text-dark-on-primary'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}>
                      {p.name}
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </aside>
        </div>
      </div>

      {/* Dialogs */}
      {dialog === 'close' && (
        <CloseTicketDialog ticketCode={ticketCode} onClose={() => setDialog(null)}
          onConfirm={(cat, comment) => closeMutation.mutate({ resolutionCategory: cat, closingComment: comment })} />
      )}
      {dialog === 'redirect' && (
        <RedirectDialog ticketCode={ticketCode} onClose={() => setDialog(null)}
          onConfirm={(id, reason) => redirectMutation.mutate({ newSupportTypeId: id, reason })} />
      )}
      {dialog === 'rate' && (
        <RateDialog ticketCode={ticketCode} onClose={() => setDialog(null)}
          onConfirm={(_stars, text) => rateMutation.mutate(text.trim().length > 0)} />
      )}
      {dialog === 'waiting' && (
        <ConfirmDialog
          icon="hourglass_empty" title="Marcar como esperando información"
          body="El ticket quedará en espera y el SLA se pausará hasta que el solicitante responda."
          confirmLabel="Marcar como esperando" onClose={() => setDialog(null)} onConfirm={() => waitingMutation.mutate()}
        />
      )}
      {dialog === 'cancel' && (
        <ConfirmDialog
          icon="cancel" title="Cancelar ticket"
          body="¿Deseas cancelar este ticket? Esta acción no se puede deshacer."
          confirmLabel="Cancelar ticket" confirmVariant="outlined"
          onClose={() => setDialog(null)} onConfirm={() => setDialog(null)}
        />
      )}
      {dialog === 'reopen' && (
        <ConfirmDialog
          icon="restart_alt" title="Reabrir ticket"
          body="El ticket volverá al estado «Abierto» y el equipo de soporte será notificado."
          confirmLabel="Reabrir" onClose={() => setDialog(null)} onConfirm={() => reopenMutation.mutate()}
        />
      )}
    </>
  )
}

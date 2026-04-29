import { HD_TICKETS, HD_THREADS, HD_PEOPLE } from '@data/seed'
import { wrapResponse } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { TicketDto, TicketSummaryDto } from '@t/dtos'
import type { CreateTicketRequest, CloseTicketRequest, ReopenTicketRequest, RedirectTicketRequest } from '@t/requests'
import { toTicketSummary, toTicketDto } from './adapters'

const delay = (ms = 300) => new Promise<void>(res => setTimeout(res, ms))

function buildComments(ticketId: string) {
  const thread = HD_THREADS[ticketId] ?? []
  return thread
    .filter(e => e.kind === 'comment')
    .map((e, idx) => {
      const author = e.author ? HD_PEOPLE[e.author] : null
      return {
        ticketCommentId: idx + 1,
        ticketId: parseInt(ticketId.replace('TK-', ''), 10),
        content: e.text,
        authorId: author?.username ?? null,
        visibility: e.internal ? 'Internal' as const : 'Public' as const,
        createdAt: new Date(Date.now() - (10 - idx) * 3600000).toISOString(),
        attachments: null,
      }
    })
}

export async function getAll(): Promise<ApiResponse<TicketSummaryDto[]>> {
  await delay()
  return wrapResponse(HD_TICKETS.map(toTicketSummary))
}

export async function getById(id: number): Promise<ApiResponse<TicketDto>> {
  await delay()
  const ticketKey = `TK-${id}`
  const ticket = HD_TICKETS.find(t => t.id === ticketKey)
  if (!ticket) return { data: null, success: false, message: 'Ticket no encontrado', statusCode: 404 }
  const comments = buildComments(ticketKey)
  return wrapResponse(toTicketDto(ticket, comments))
}

export async function create(_body: CreateTicketRequest): Promise<ApiResponse<TicketDto>> {
  await delay(500)
  const fake = HD_TICKETS[0]
  const comments = buildComments(fake.id)
  return wrapResponse(toTicketDto(fake, comments), 201)
}

export async function remove(_id: number): Promise<ApiResponse<void>> {
  await delay()
  return wrapResponse<void>(undefined)
}

export async function close(id: number, _body: CloseTicketRequest): Promise<ApiResponse<TicketDto>> {
  await delay()
  const ticket = HD_TICKETS.find(t => t.id === `TK-${id}`)
  if (!ticket) return { data: null, success: false, message: 'Ticket no encontrado', statusCode: 404 }
  const closed = { ...ticket, statusId: 'closed' as const }
  return wrapResponse(toTicketDto(closed, buildComments(ticket.id)))
}

export async function reopen(id: number, _body: ReopenTicketRequest): Promise<ApiResponse<TicketDto>> {
  await delay()
  const ticket = HD_TICKETS.find(t => t.id === `TK-${id}`)
  if (!ticket) return { data: null, success: false, message: 'Ticket no encontrado', statusCode: 404 }
  const reopened = { ...ticket, statusId: 'open' as const }
  return wrapResponse(toTicketDto(reopened, buildComments(ticket.id)))
}

export async function redirect(id: number, _body: RedirectTicketRequest): Promise<ApiResponse<TicketDto>> {
  await delay()
  const ticket = HD_TICKETS.find(t => t.id === `TK-${id}`)
  if (!ticket) return { data: null, success: false, message: 'Ticket no encontrado', statusCode: 404 }
  return wrapResponse(toTicketDto(ticket, buildComments(ticket.id)))
}

export async function uploadAttachment(_ticketId: number, _file: File): Promise<ApiResponse<unknown>> {
  await delay(800)
  return wrapResponse({ uploaded: true })
}

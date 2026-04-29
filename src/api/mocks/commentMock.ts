import { HD_THREADS, HD_PEOPLE } from '@data/seed'
import { wrapResponse } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { TicketCommentDto } from '@t/dtos'
import type { AddCommentRequest } from '@t/requests'

const delay = (ms = 300) => new Promise<void>(res => setTimeout(res, ms))

export async function getByTicket(ticketId: number): Promise<ApiResponse<TicketCommentDto[]>> {
  await delay()
  const key = `TK-${ticketId}`
  const thread = HD_THREADS[key] ?? []
  const comments: TicketCommentDto[] = thread
    .filter(e => e.kind === 'comment')
    .map((e, idx) => {
      const author = e.author ? HD_PEOPLE[e.author] : null
      return {
        ticketCommentId: idx + 1,
        ticketId,
        content: e.text,
        authorId: author?.username ?? null,
        visibility: e.internal ? 'Internal' as const : 'Public' as const,
        createdAt: new Date(Date.now() - (10 - idx) * 3600000).toISOString(),
        attachments: null,
      }
    })
  return wrapResponse(comments)
}

export async function add(ticketId: number, body: AddCommentRequest): Promise<ApiResponse<TicketCommentDto>> {
  await delay()
  const comment: TicketCommentDto = {
    ticketCommentId: Date.now(),
    ticketId,
    content: body.content,
    authorId: null,
    visibility: body.visibility,
    createdAt: new Date().toISOString(),
    attachments: null,
  }
  return wrapResponse(comment)
}

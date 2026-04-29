import { USE_MOCK } from '@config'
import * as mock from '@api/mocks/commentMock'
import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { TicketCommentDto } from '@t/dtos'
import type { AddCommentRequest } from '@t/requests'

export const ticketCommentService = {
  getByTicket(ticketId: number): Promise<ApiResponse<TicketCommentDto[]>> {
    if (USE_MOCK) return mock.getByTicket(ticketId)
    return apiClient.get<TicketCommentDto[]>(`/Tickets/${ticketId}/comments`)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<TicketCommentDto[]>(e))
  },

  add(ticketId: number, body: AddCommentRequest): Promise<ApiResponse<TicketCommentDto>> {
    if (USE_MOCK) return mock.add(ticketId, body)
    return apiClient.post<TicketCommentDto>(`/Tickets/${ticketId}/comments`, body)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<TicketCommentDto>(e))
  },
}

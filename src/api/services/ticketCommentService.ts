import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { TicketCommentDto } from '@t/dtos'
import type { AddCommentRequest } from '@t/requests'

export const ticketCommentService = {
  getByTicket(ticketId: number): Promise<ApiResponse<TicketCommentDto[]>> {
    return apiClient.get<TicketCommentDto[]>(`/Tickets/${ticketId}/comments`)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<TicketCommentDto[]>(e))
  },

  add(ticketId: number, body: AddCommentRequest): Promise<ApiResponse<TicketCommentDto>> {
    return apiClient.post<TicketCommentDto>(`/Tickets/${ticketId}/comments`, body)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<TicketCommentDto>(e))
  },
}

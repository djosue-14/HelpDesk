import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { TicketDto, TicketSummaryDto } from '@t/dtos'
import type {
  CreateTicketRequest,
  CloseTicketRequest,
  ReopenTicketRequest,
  RedirectTicketRequest,
  UpdateTicketStatusRequest,
} from '@t/requests'

export const ticketService = {
  getAll(): Promise<ApiResponse<TicketSummaryDto[]>> {
    return apiClient.get<TicketSummaryDto[]>('/Tickets')
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<TicketSummaryDto[]>(e))
  },

  create(body: CreateTicketRequest): Promise<ApiResponse<TicketDto>> {
    return apiClient.post<TicketDto>('/Tickets', body)
      .then(r => wrapResponse(r.data, 201))
      .catch(e => wrapError<TicketDto>(e))
  },

  getById(id: number): Promise<ApiResponse<TicketDto>> {
    return apiClient.get<TicketDto>(`/Tickets/${id}`)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<TicketDto>(e))
  },

  delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/Tickets/${id}`)
      .then(() => wrapResponse<void>(undefined))
      .catch(e => wrapError<void>(e))
  },

  close(id: number, body: CloseTicketRequest): Promise<ApiResponse<TicketDto>> {
    return apiClient.put<TicketDto>(`/Tickets/${id}/close`, body)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<TicketDto>(e))
  },

  reopen(id: number, body: ReopenTicketRequest): Promise<ApiResponse<TicketDto>> {
    return apiClient.put<TicketDto>(`/Tickets/${id}/reopen`, body)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<TicketDto>(e))
  },

  updateStatus(id: number, body: UpdateTicketStatusRequest): Promise<ApiResponse<TicketDto>> {
    return apiClient.put<TicketDto>(`/Tickets/${id}/status`, body)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<TicketDto>(e))
  },

  redirect(id: number, body: RedirectTicketRequest): Promise<ApiResponse<TicketDto>> {
    return apiClient.put<TicketDto>(`/Tickets/${id}/redirect`, body)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<TicketDto>(e))
  },

  uploadAttachment(ticketId: number, file: File): Promise<ApiResponse<unknown>> {
    const form = new FormData()
    form.append('file', file)
    return apiClient
      .post(`/Tickets/${ticketId}/attachments`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<unknown>(e))
  },
}

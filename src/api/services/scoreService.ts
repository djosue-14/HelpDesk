import { USE_MOCK } from '@config'
import * as mock from '@api/mocks/scoreMock'
import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { UserScoreDto } from '@t/dtos'
import type { RateTicketRequest } from '@t/requests'

export const scoreService = {
  getUserScore(userId: string): Promise<ApiResponse<UserScoreDto>> {
    if (USE_MOCK) return mock.getUserScore(userId)
    return apiClient.get<UserScoreDto>(`/Score/${userId}`)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<UserScoreDto>(e))
  },

  rateTicket(ticketId: number, body: RateTicketRequest): Promise<ApiResponse<void>> {
    if (USE_MOCK) return mock.rateTicket(ticketId, body)
    return apiClient.post(`/Tickets/${ticketId}/rate`, body)
      .then(() => wrapResponse<void>(undefined))
      .catch(e => wrapError<void>(e))
  },
}

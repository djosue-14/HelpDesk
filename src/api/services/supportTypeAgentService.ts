import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { SupportTypeAgentDto } from '@t/dtos'
import type { AssignAgentRequest } from '@t/requests'

export const supportTypeAgentService = {
  getActive(supportTypeId: number): Promise<ApiResponse<SupportTypeAgentDto>> {
    return apiClient.get<SupportTypeAgentDto>(`/SupportTypeAgents/active/${supportTypeId}`)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<SupportTypeAgentDto>(e))
  },

  getHistory(supportTypeId: number): Promise<ApiResponse<SupportTypeAgentDto[]>> {
    return apiClient.get<SupportTypeAgentDto[]>(`/SupportTypeAgents/history/${supportTypeId}`)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<SupportTypeAgentDto[]>(e))
  },

  assign(body: AssignAgentRequest): Promise<ApiResponse<SupportTypeAgentDto>> {
    return apiClient.post<SupportTypeAgentDto>('/SupportTypeAgents', body)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<SupportTypeAgentDto>(e))
  },

  unassign(supportTypeId: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/SupportTypeAgents/${supportTypeId}`)
      .then(() => wrapResponse<void>(undefined))
      .catch(e => wrapError<void>(e))
  },
}

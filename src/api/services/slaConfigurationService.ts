import { USE_MOCK } from '@config'
import * as mock from '@api/mocks/slaMock'
import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { SlaConfigurationDto } from '@t/dtos'
import type { TicketPriority } from '@t/enums'
import type { UpdateSlaConfigurationRequest } from '@t/requests'

export const slaConfigurationService = {
  getAll(): Promise<ApiResponse<SlaConfigurationDto[]>> {
    if (USE_MOCK) return mock.getAll()
    return apiClient.get<SlaConfigurationDto[]>('/SlaConfigurations')
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<SlaConfigurationDto[]>(e))
  },

  update(priority: TicketPriority, body: UpdateSlaConfigurationRequest): Promise<ApiResponse<SlaConfigurationDto>> {
    if (USE_MOCK) return mock.update(priority, body)
    return apiClient.put<SlaConfigurationDto>(`/SlaConfigurations/${priority}`, body)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<SlaConfigurationDto>(e))
  },
}

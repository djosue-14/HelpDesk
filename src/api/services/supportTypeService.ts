import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { SupportTypeDto } from '@t/dtos'
import type { CreateSupportTypeRequest } from '@t/requests'

export const supportTypeService = {
  getAll(): Promise<ApiResponse<SupportTypeDto[]>> {
    return apiClient.get<SupportTypeDto[]>('/SupportTypes')
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<SupportTypeDto[]>(e))
  },

  create(body: CreateSupportTypeRequest): Promise<ApiResponse<SupportTypeDto>> {
    return apiClient.post<SupportTypeDto>('/SupportTypes', body)
      .then(r => wrapResponse(r.data, 201))
      .catch(e => wrapError<SupportTypeDto>(e))
  },

  getById(id: number): Promise<ApiResponse<SupportTypeDto>> {
    return apiClient.get<SupportTypeDto>(`/SupportTypes/${id}`)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<SupportTypeDto>(e))
  },

  delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/SupportTypes/${id}`)
      .then(() => wrapResponse<void>(undefined))
      .catch(e => wrapError<void>(e))
  },
}

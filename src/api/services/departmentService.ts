import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { DepartmentDto, SupportTypeDto } from '@t/dtos'
import type { CreateDepartmentRequest } from '@t/requests'

export const departmentService = {
  getAll(): Promise<ApiResponse<DepartmentDto[]>> {
    return apiClient.get<DepartmentDto[]>('/Departments')
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<DepartmentDto[]>(e))
  },

  create(body: CreateDepartmentRequest): Promise<ApiResponse<DepartmentDto>> {
    return apiClient.post<DepartmentDto>('/Departments', body)
      .then(r => wrapResponse(r.data, 201))
      .catch(e => wrapError<DepartmentDto>(e))
  },

  getById(id: number): Promise<ApiResponse<DepartmentDto>> {
    return apiClient.get<DepartmentDto>(`/Departments/${id}`)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<DepartmentDto>(e))
  },

  delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/Departments/${id}`)
      .then(() => wrapResponse<void>(undefined))
      .catch(e => wrapError<void>(e))
  },

  getSupportTypes(id: number): Promise<ApiResponse<SupportTypeDto[]>> {
    return apiClient.get<SupportTypeDto[]>(`/Departments/${id}/supporttypes`)
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<SupportTypeDto[]>(e))
  },
}

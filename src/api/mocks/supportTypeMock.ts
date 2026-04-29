import { wrapResponse } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { SupportTypeDto } from '@t/dtos'
import type { CreateSupportTypeRequest } from '@t/requests'
import { toAllSupportTypeDtos } from './adapters'

const delay = (ms = 300) => new Promise<void>(res => setTimeout(res, ms))

export async function getAll(): Promise<ApiResponse<SupportTypeDto[]>> {
  await delay()
  return wrapResponse(toAllSupportTypeDtos())
}

export async function getById(id: number): Promise<ApiResponse<SupportTypeDto>> {
  await delay()
  const all = toAllSupportTypeDtos()
  const found = all.find(t => t.supportTypeId === id)
  if (!found) return { data: null, success: false, message: 'Tipo de soporte no encontrado', statusCode: 404 }
  return wrapResponse(found)
}

export async function create(body: CreateSupportTypeRequest): Promise<ApiResponse<SupportTypeDto>> {
  await delay()
  const newType: SupportTypeDto = {
    supportTypeId: Date.now(),
    departmentId: body.departmentId,
    name: body.name,
    description: body.description ?? null,
    isEnabled: true,
  }
  return wrapResponse(newType, 201)
}

export async function remove(_id: number): Promise<ApiResponse<void>> {
  await delay()
  return wrapResponse<void>(undefined)
}

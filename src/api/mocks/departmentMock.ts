import { HD_DEPARTMENTS } from '@data/seed'
import { wrapResponse } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { DepartmentDto, SupportTypeDto } from '@t/dtos'
import type { CreateDepartmentRequest } from '@t/requests'
import { toDepartmentDtos, toSupportTypeDtos } from './adapters'

const delay = (ms = 300) => new Promise<void>(res => setTimeout(res, ms))

export async function getAll(): Promise<ApiResponse<DepartmentDto[]>> {
  await delay()
  return wrapResponse(toDepartmentDtos())
}

export async function getById(id: number): Promise<ApiResponse<DepartmentDto>> {
  await delay()
  const depts = toDepartmentDtos()
  const dept = depts.find(d => d.departmentId === id)
  if (!dept) return { data: null, success: false, message: 'Departamento no encontrado', statusCode: 404 }
  return wrapResponse(dept)
}

export async function create(body: CreateDepartmentRequest): Promise<ApiResponse<DepartmentDto>> {
  await delay()
  const newDept: DepartmentDto = {
    departmentId: HD_DEPARTMENTS.length + 1,
    name: body.name,
    description: body.description ?? null,
    coordinatorUserId: body.coordinatorUserId ?? null,
    isEnabled: true,
  }
  return wrapResponse(newDept, 201)
}

export async function remove(_id: number): Promise<ApiResponse<void>> {
  await delay()
  return wrapResponse<void>(undefined)
}

export async function getSupportTypes(id: number): Promise<ApiResponse<SupportTypeDto[]>> {
  await delay()
  const dept = HD_DEPARTMENTS[id - 1]
  if (!dept) return { data: null, success: false, message: 'Departamento no encontrado', statusCode: 404 }
  return wrapResponse(toSupportTypeDtos(dept.id, id))
}

import { wrapResponse } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { SlaConfigurationDto } from '@t/dtos'
import type { TicketPriority } from '@t/enums'
import type { UpdateSlaConfigurationRequest } from '@t/requests'
import { toSlaDtos } from './adapters'

const delay = (ms = 300) => new Promise<void>(res => setTimeout(res, ms))

export async function getAll(): Promise<ApiResponse<SlaConfigurationDto[]>> {
  await delay()
  return wrapResponse(toSlaDtos())
}

export async function update(priority: TicketPriority, body: UpdateSlaConfigurationRequest): Promise<ApiResponse<SlaConfigurationDto>> {
  await delay()
  const all = toSlaDtos()
  const existing = all.find(s => s.priority === priority)
  if (!existing) return { data: null, success: false, message: 'SLA no encontrado', statusCode: 404 }
  return wrapResponse({ ...existing, hoursLimit: body.hoursLimit, lastModifiedAt: new Date().toISOString() })
}

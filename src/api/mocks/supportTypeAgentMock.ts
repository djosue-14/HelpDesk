import { HD_PEOPLE } from '@data/seed'
import { wrapResponse } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { SupportTypeAgentDto } from '@t/dtos'
import type { AssignAgentRequest } from '@t/requests'

const delay = (ms = 300) => new Promise<void>(res => setTimeout(res, ms))

export async function getActive(supportTypeId: number): Promise<ApiResponse<SupportTypeAgentDto>> {
  await delay()
  const agent: SupportTypeAgentDto = {
    supportTypeAgentId: supportTypeId,
    supportTypeId,
    supportTypeName: null,
    userId: HD_PEOPLE.alvaro.username,
    isEnabled: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    createdBy: 'bruno.iturra',
    disabledAt: null,
    disabledBy: null,
  }
  return wrapResponse(agent)
}

export async function getHistory(supportTypeId: number): Promise<ApiResponse<SupportTypeAgentDto[]>> {
  await delay()
  return wrapResponse([
    {
      supportTypeAgentId: supportTypeId * 10,
      supportTypeId,
      supportTypeName: null,
      userId: HD_PEOPLE.lucia.username,
      isEnabled: false,
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      createdBy: 'bruno.iturra',
      disabledAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      disabledBy: 'bruno.iturra',
    },
  ])
}

export async function assign(body: AssignAgentRequest): Promise<ApiResponse<SupportTypeAgentDto>> {
  await delay()
  const agent: SupportTypeAgentDto = {
    supportTypeAgentId: Date.now(),
    supportTypeId: body.supportTypeId,
    supportTypeName: null,
    userId: null,
    isEnabled: true,
    createdAt: new Date().toISOString(),
    createdBy: null,
    disabledAt: null,
    disabledBy: null,
  }
  return wrapResponse(agent)
}

export async function unassign(_supportTypeId: number): Promise<ApiResponse<void>> {
  await delay()
  return wrapResponse<void>(undefined)
}

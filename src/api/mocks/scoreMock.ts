import { wrapResponse } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { UserScoreDto } from '@t/dtos'
import type { RateTicketRequest } from '@t/requests'
import { toUserScoreDto } from './adapters'

const delay = (ms = 300) => new Promise<void>(res => setTimeout(res, ms))

export async function getUserScore(userId: string): Promise<ApiResponse<UserScoreDto>> {
  await delay()
  return wrapResponse(toUserScoreDto(userId))
}

export async function rateTicket(_ticketId: number, _body: RateTicketRequest): Promise<ApiResponse<void>> {
  await delay()
  return wrapResponse<void>(undefined)
}

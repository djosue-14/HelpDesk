import { wrapResponse } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { OperationalMetricsDto, AgentPerformanceDto, HeatMapDto, LeaderboardDto } from '@t/dtos'
import { toOperationalMetrics, toLeaderboardDto, toHeatMapDto, toAgentPerformanceDto } from './adapters'

const delay = (ms = 300) => new Promise<void>(res => setTimeout(res, ms))

export async function getMetrics(_params?: { from?: string; to?: string; departmentId?: number }): Promise<ApiResponse<OperationalMetricsDto>> {
  await delay()
  return wrapResponse(toOperationalMetrics())
}

export async function getAgentPerformance(agentId: string, _params?: { from?: string; to?: string }): Promise<ApiResponse<AgentPerformanceDto>> {
  await delay()
  return wrapResponse(toAgentPerformanceDto(agentId))
}

export async function getTeamPerformance(_departmentId: number, _params?: { from?: string; to?: string }): Promise<ApiResponse<AgentPerformanceDto[]>> {
  await delay()
  return wrapResponse([toAgentPerformanceDto('alvaro.duarte'), toAgentPerformanceDto('lucia.morales')])
}

export async function getHeatmap(_params?: { from?: string; to?: string; departmentIds?: number[] }): Promise<ApiResponse<HeatMapDto>> {
  await delay()
  return wrapResponse(toHeatMapDto())
}

export async function getLeaderboard(_params?: { year?: number; month?: number }): Promise<ApiResponse<LeaderboardDto>> {
  await delay()
  return wrapResponse(toLeaderboardDto())
}

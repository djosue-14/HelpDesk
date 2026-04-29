import { USE_MOCK } from '@config'
import * as mock from '@api/mocks/dashboardMock'
import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { OperationalMetricsDto, AgentPerformanceDto, HeatMapDto, LeaderboardDto } from '@t/dtos'

export const dashboardService = {
  getMetrics(params?: { from?: string; to?: string; departmentId?: number }): Promise<ApiResponse<OperationalMetricsDto>> {
    if (USE_MOCK) return mock.getMetrics(params)
    return apiClient.get<OperationalMetricsDto>('/Dashboard/metrics', { params })
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<OperationalMetricsDto>(e))
  },

  getAgentPerformance(agentId: string, params?: { from?: string; to?: string }): Promise<ApiResponse<AgentPerformanceDto>> {
    if (USE_MOCK) return mock.getAgentPerformance(agentId, params)
    return apiClient.get<AgentPerformanceDto>(`/Dashboard/agents/${agentId}/performance`, { params })
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<AgentPerformanceDto>(e))
  },

  getTeamPerformance(departmentId: number, params?: { from?: string; to?: string }): Promise<ApiResponse<AgentPerformanceDto[]>> {
    if (USE_MOCK) return mock.getTeamPerformance(departmentId, params)
    return apiClient.get<AgentPerformanceDto[]>(`/Dashboard/departments/${departmentId}/team-performance`, { params })
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<AgentPerformanceDto[]>(e))
  },

  getHeatmap(params?: { from?: string; to?: string; departmentIds?: number[] }): Promise<ApiResponse<HeatMapDto>> {
    if (USE_MOCK) return mock.getHeatmap(params)
    return apiClient.get<HeatMapDto>('/Dashboard/heatmap', { params, paramsSerializer: { indexes: null } })
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<HeatMapDto>(e))
  },

  getLeaderboard(params?: { year?: number; month?: number }): Promise<ApiResponse<LeaderboardDto>> {
    if (USE_MOCK) return mock.getLeaderboard(params)
    return apiClient.get<LeaderboardDto>('/Dashboard/leaderboard', { params })
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<LeaderboardDto>(e))
  },
}

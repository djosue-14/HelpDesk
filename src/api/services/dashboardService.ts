import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@t/ApiResponse'
import type { ApiResponse } from '@t/ApiResponse'
import type { OperationalMetricsDto, AgentPerformanceDto, HeatMapDto, LeaderboardDto, RequesterDashboardDto, AgentDashboardDto, CoordinatorDashboardDto, AdminDashboardDto } from '@t/dtos'

export const dashboardService = {
  getRequesterDashboard(): Promise<ApiResponse<RequesterDashboardDto>> {
    return apiClient.get<RequesterDashboardDto>('/Dashboard')
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<RequesterDashboardDto>(e))
  },

  getAgentDashboard(): Promise<ApiResponse<AgentDashboardDto>> {
    return apiClient.get<AgentDashboardDto>('/Dashboard')
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<AgentDashboardDto>(e))
  },

  getCoordinatorDashboard(): Promise<ApiResponse<CoordinatorDashboardDto>> {
    return apiClient.get<CoordinatorDashboardDto>('/Dashboard')
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<CoordinatorDashboardDto>(e))
  },

  getAdminDashboard(): Promise<ApiResponse<AdminDashboardDto>> {
    return apiClient.get<AdminDashboardDto>('/Dashboard')
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<AdminDashboardDto>(e))
  },

  getMetrics(params?: { from?: string; to?: string; departmentId?: number }): Promise<ApiResponse<OperationalMetricsDto>> {
    const now = new Date()
    const from = params?.from ?? new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const to   = params?.to   ?? now.toISOString()
    return apiClient.get<OperationalMetricsDto>('/Dashboard/metrics', { params: { ...params, from, to } })
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<OperationalMetricsDto>(e))
  },

  getAgentPerformance(agentId: string, params?: { from?: string; to?: string }): Promise<ApiResponse<AgentPerformanceDto>> {
    const now = new Date()
    const from = params?.from ?? new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const to   = params?.to   ?? now.toISOString()
    return apiClient.get<AgentPerformanceDto>(`/Dashboard/agents/${agentId}/performance`, { params: { from, to } })
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<AgentPerformanceDto>(e))
  },

  getTeamPerformance(departmentId: number, params?: { from?: string; to?: string }): Promise<ApiResponse<AgentPerformanceDto[]>> {
    return apiClient.get<AgentPerformanceDto[]>(`/Dashboard/departments/${departmentId}/team-performance`, { params })
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<AgentPerformanceDto[]>(e))
  },

  getHeatmap(params?: { from?: string; to?: string; departmentIds?: number[] }): Promise<ApiResponse<HeatMapDto>> {
    const now = new Date()
    const from = params?.from ?? new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const to   = params?.to   ?? now.toISOString()
    return apiClient.get<HeatMapDto>('/Dashboard/heatmap', { params: { ...params, from, to }, paramsSerializer: { indexes: null } })
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<HeatMapDto>(e))
  },

  getLeaderboard(params?: { year?: number; month?: number }): Promise<ApiResponse<LeaderboardDto>> {
    const now = new Date()
    const year  = params?.year  ?? now.getFullYear()
    const month = params?.month ?? now.getMonth() + 1
    return apiClient.get<LeaderboardDto>('/Dashboard/leaderboard', { params: { year, month } })
      .then(r => wrapResponse(r.data))
      .catch(e => wrapError<LeaderboardDto>(e))
  },
}

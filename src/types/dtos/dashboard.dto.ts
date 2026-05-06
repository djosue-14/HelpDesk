import type { TicketSummaryDto } from './ticket.dto'
import type { UserScoreDto } from './score.dto'

export interface DailyVolumeDto {
  date: string
  created: number
  closed: number
}

export interface OperationalMetricsDto {
  from: string
  to: string
  totalCreated: number
  totalClosed: number
  totalActive: number
  slaCompliancePct: number
  avgResolutionHours: number
  avgFirstResponseHours: number
  reopenRatePct: number
  redirectRatePct: number
  dailyTrend: DailyVolumeDto[] | null
  slaByPriority: Record<string, number> | null
  previousPeriod: OperationalMetricsDto | null
}

export interface AgentPerformanceDto {
  userId: string | null
  totalAssigned: number
  totalClosed: number
  totalActive: number
  slaCompliancePct: number
  avgResolutionHours: number
  avgFirstResponseHours: number
  pauseCount: number
  avgPauseMinutes: number
  avgRating: number
  teamAvgSlaCompliancePct: number
  teamAvgResolutionHours: number
  staleTickets: TicketSummaryDto[] | null
}

export interface HeatMapCellDto {
  supportTypeId: number
  supportTypeName: string | null
  ticketCount: number
}

export interface HeatMapRowDto {
  departmentId: number
  departmentName: string | null
  cells: HeatMapCellDto[] | null
}

export interface HeatMapDto {
  from: string
  to: string
  rows: HeatMapRowDto[] | null
}

export interface LeaderboardEntryDto {
  rank: number
  userId: string | null
  pointsEarned: number
  ratingRatePct: number
}

export interface LeaderboardDto {
  year: number
  month: number
  top10: LeaderboardEntryDto[] | null
}

export interface RequesterDashboardDto {
  activeTickets: TicketSummaryDto[]
  ticketCountByStatus: Record<string, number>
  score: UserScoreDto | null
}

export interface AgentDashboardDto {
  queue: TicketSummaryDto[]
  totalAssigned: number
  overdueCount: number
  staleCount: number
  workloadPct: number
}

export interface AgentWorkloadDto {
  userId: string
  assignedCount: number
  overdueCount: number
}

export interface CoordinatorDashboardDto {
  departmentName: string
  totalActive: number
  slaBreachedCount: number
  teamWorkload: AgentWorkloadDto[]
  escalatedTickets: TicketSummaryDto[]
}

export interface AdminDashboardDto {
  totalActiveAllDepartments: number
  slaDailyCompliancePct: number
  countByPriority: Record<string, number>
  countByDepartment: Record<string, number>
}

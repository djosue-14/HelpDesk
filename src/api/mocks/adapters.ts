import {
  HD_TICKETS, HD_DEPARTMENTS, HD_SUPPORT_TYPES, HD_PEOPLE,
  HD_LEADERBOARD, HD_METRICS, HD_HEATMAP, HD_SCORE_MARINA,
} from '@data/seed'
import type { TicketPriority, TicketStatus } from '@t/enums'
import type { TicketSummaryDto, TicketDto, TicketCommentDto } from '@t/dtos'
import type {
  DepartmentDto, SupportTypeDto, SlaConfigurationDto,
  UserScoreDto, LeaderboardDto, OperationalMetricsDto,
  HeatMapDto, AgentPerformanceDto,
} from '@t/dtos'

// --- Enum mappers ---

const PRIORITY_MAP: Record<string, TicketPriority> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

const STATUS_MAP: Record<string, TicketStatus> = {
  open: 'Open',
  progress: 'InProgress',
  waiting: 'Paused',
  closed: 'Closed',
  reopened: 'Open',
}

function ticketId(id: string): number {
  return parseInt(id.replace('TK-', ''), 10)
}

// --- Ticket adapters ---

export function toTicketSummary(t: (typeof HD_TICKETS)[0]): TicketSummaryDto {
  const dept = HD_DEPARTMENTS.find(d => d.id === t.deptId)
  const types = HD_SUPPORT_TYPES[t.deptId] ?? []
  const type = types.find(tp => tp.id === t.typeId)
  const assignee = t.assignee ? HD_PEOPLE[t.assignee] : null
  const requester = HD_PEOPLE[t.requester]

  const deadline = new Date(Date.now() + (100 - t.slaPct) * 3600 * 1000)

  return {
    ticketId: ticketId(t.id),
    ticketNumber: ticketId(t.id),
    subject: t.subject,
    priority: PRIORITY_MAP[t.priority] ?? 'Medium',
    status: STATUS_MAP[t.statusId] ?? 'Open',
    departmentName: dept?.name ?? null,
    supportTypeName: type?.name ?? null,
    createdBy: requester?.username ?? null,
    assignedAgentUsername: assignee?.username ?? null,
    deadline: deadline.toISOString(),
    remainingSlaPct: Math.max(0, 100 - t.slaPct),
  }
}

export function toTicketDto(t: (typeof HD_TICKETS)[0], comments: TicketCommentDto[]): TicketDto {
  const summary = toTicketSummary(t)
  const requester = HD_PEOPLE[t.requester]
  const deadline = new Date(Date.now() + (100 - t.slaPct) * 3600 * 1000)

  return {
    ticketId: summary.ticketId,
    ticketNumber: summary.ticketNumber,
    subject: summary.subject,
    description: t.description,
    departmentName: summary.departmentName,
    supportTypeName: summary.supportTypeName,
    priority: summary.priority,
    status: summary.status,
    resolutionCategory: t.statusId === 'closed' ? 'Resuelto' : null,
    assignedAgentUsername: summary.assignedAgentUsername,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: requester?.username ?? null,
    firstOpenedAt: new Date(Date.now() - 82800000).toISOString(),
    workStartedAt: t.statusId !== 'open' ? new Date(Date.now() - 79200000).toISOString() : null,
    deadline: deadline.toISOString(),
    closedAt: t.statusId === 'closed' ? new Date(Date.now() - 3600000).toISOString() : null,
    totalPausedMinutes: t.statusId === 'waiting' ? 30 : 0,
    remainingSlaPct: Math.max(0, 100 - t.slaPct),
    comments,
    attachments: t.attachments.map((a, idx) => ({
      ticketAttachmentId: idx + 1,
      ticketId: summary.ticketId,
      commentId: null,
      originalFileName: a.name,
      fileExtension: a.name.split('.').pop() ?? null,
      fileSizeBytes: parseInt(a.size.replace(/[^0-9]/g, ''), 10) * 1024,
      uploadedBy: requester?.username ?? null,
      uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    })),
  }
}

// --- Department adapters ---

export function toDepartmentDtos(): DepartmentDto[] {
  return HD_DEPARTMENTS.map((d, idx) => ({
    departmentId: idx + 1,
    name: d.name,
    description: null,
    coordinatorUserId: null,
    isEnabled: true,
  }))
}

export function toSupportTypeDtos(deptId: string, deptNumericId: number): SupportTypeDto[] {
  return (HD_SUPPORT_TYPES[deptId] ?? []).map((t, idx) => ({
    supportTypeId: parseInt(t.id.replace('T', ''), 10) || idx + 1,
    departmentId: deptNumericId,
    name: t.name,
    description: null,
    isEnabled: true,
  }))
}

export function toAllSupportTypeDtos(): SupportTypeDto[] {
  return HD_DEPARTMENTS.flatMap((d, dIdx) =>
    toSupportTypeDtos(d.id, dIdx + 1)
  )
}

// --- SLA adapters ---

export function toSlaDtos(): SlaConfigurationDto[] {
  const SLA_HOURS: Record<TicketPriority, number> = {
    Critical: 2,
    High: 8,
    Medium: 24,
    Low: 72,
  }
  return (['Critical', 'High', 'Medium', 'Low'] as TicketPriority[]).map((p, idx) => ({
    slaConfigurationId: idx + 1,
    priority: p,
    hoursLimit: SLA_HOURS[p],
    lastModifiedAt: null,
    lastModifiedBy: null,
  }))
}

// --- Score adapters ---

export function toUserScoreDto(userId: string): UserScoreDto {
  const s = HD_SCORE_MARINA
  return {
    userScoreId: 1,
    userId,
    currentPoints: s.points,
    level: s.level,
    scoreTransactions: [
      { scoreTransactionId: 1, userId, ticketId: 2280, points: 50, reason: 'Ticket cerrado con calificación 5', createdAt: new Date(Date.now() - 172800000).toISOString() },
      { scoreTransactionId: 2, userId, ticketId: 2279, points: 40, reason: 'Ticket cerrado con calificación 4', createdAt: new Date(Date.now() - 345600000).toISOString() },
    ],
  }
}

// --- Dashboard adapters ---

export function toOperationalMetrics(): OperationalMetricsDto {
  const now = new Date()
  const from = new Date(now.getTime() - 30 * 86400000)
  const m = HD_METRICS

  const dailyTrend = m.volumeWeeks.map((_w, i) => ({
    date: new Date(now.getTime() - (13 - i) * 7 * 86400000).toISOString().slice(0, 10),
    created: m.volumeCreated[i] ?? 0,
    closed: m.volumeClosed[i] ?? 0,
  }))

  return {
    from: from.toISOString(),
    to: now.toISOString(),
    totalCreated: 301,
    totalClosed: 218,
    totalActive: 77,
    slaCompliancePct: 92.8,
    avgResolutionHours: 6.4,
    avgFirstResponseHours: 1.2,
    reopenRatePct: 3.1,
    redirectRatePct: 4.2,
    dailyTrend,
    slaByPriority: { Critical: 88.5, High: 91.2, Medium: 94.6, Low: 97.1 },
    previousPeriod: null,
  }
}

export function toLeaderboardDto(): LeaderboardDto {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    top10: HD_LEADERBOARD.map(e => {
      const person = HD_PEOPLE[e.user]
      return {
        rank: e.rank,
        userId: person?.username ?? e.user,
        pointsEarned: e.points,
        ratingRatePct: e.avgRating * 20,
      }
    }),
  }
}

export function toHeatMapDto(): HeatMapDto {
  const now = new Date()
  const from = new Date(now.getTime() - 30 * 86400000)
  const hm = HD_HEATMAP

  return {
    from: from.toISOString(),
    to: now.toISOString(),
    rows: hm.rows.map((row, rIdx) => ({
      departmentId: rIdx + 1,
      departmentName: row.name,
      cells: hm.cols.map((col, cIdx) => ({
        supportTypeId: rIdx * 10 + cIdx + 1,
        supportTypeName: col.name,
        ticketCount: hm.values[row.id]?.[col.id] ?? 0,
      })),
    })),
  }
}

export function toAgentPerformanceDto(userId: string): AgentPerformanceDto {
  const lb = HD_LEADERBOARD.find(e => {
    const person = HD_PEOPLE[e.user]
    return person?.username === userId || e.user === userId
  })

  return {
    userId,
    totalAssigned: lb?.closed ?? 0 + 7,
    totalClosed: lb?.closed ?? 87,
    totalActive: 7,
    slaCompliancePct: lb?.slaCompliance ?? 90,
    avgResolutionHours: 6.4,
    avgFirstResponseHours: 1.2,
    pauseCount: 3,
    avgPauseMinutes: 45,
    avgRating: lb?.avgRating ?? 4.5,
    teamAvgSlaCompliancePct: 92.8,
    teamAvgResolutionHours: 6.4,
    staleTickets: HD_TICKETS
      .filter(t => t.slaState === 'red' || t.slaState === 'yellow')
      .slice(0, 3)
      .map(toTicketSummary),
  }
}

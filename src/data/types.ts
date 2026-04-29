export type PriorityId = 'critical' | 'high' | 'medium' | 'low'
export type StatusId = 'open' | 'progress' | 'waiting' | 'closed' | 'reopened'
export type SlaState = 'green' | 'yellow' | 'red' | 'paused'
export type RoleId = 'requester' | 'agent' | 'coordinator' | 'admin'
export type LevelKey = 'bronze' | 'silver' | 'gold'

export interface Department {
  id: string
  name: string
  icon: string
  color: string
}

export interface SupportType {
  id: string
  name: string
  defaultPriority: PriorityId
  defaultSlaHours: number
}

export interface Priority {
  id: PriorityId
  name: string
  sla: string
  className: string
}

export interface Status {
  id: StatusId
  name: string
  icon: string
  cls: string
}

export interface Person {
  id: string
  username: string
  name: string
  dept: string
  role: RoleId
  initials: string
}

export interface Role {
  id: RoleId
  name: string
  user: Person
  icon: string
}

export interface Attachment {
  name: string
  size: string
  type: 'image' | 'pdf' | 'archive'
}

export interface Ticket {
  id: string
  code: string
  subject: string
  description: string
  deptId: string
  typeId: string
  statusId: StatusId
  priority: PriorityId
  requester: string
  assignee: string | null
  createdAt: string
  updatedAt: string
  slaPct: number
  slaRemaining: string
  slaState: SlaState
  rating: number | null
  ratingComment?: string
  attachments: Attachment[]
  unread: number
}

export interface ThreadEntry {
  id: number
  kind: 'comment' | 'system'
  author?: string
  internal?: boolean
  when: string
  text: string
}

export interface HistoryEntry {
  icon: string
  when: string
  text: string
}

export interface Badge {
  id: string
  name: string
  icon: string
  earned: boolean
}

export interface UserScore {
  username: string
  name: string
  level: string
  levelKey: LevelKey
  points: number
  nextLevel: string
  toNext: number
  nextThreshold: number
  ticketsCreated: number
  ticketsClosed: number
  avgRatingGiven: number
  badges: Badge[]
}

export interface LeaderboardEntry {
  rank: number
  user: string
  points: number
  closed: number
  avgRating: number
  slaCompliance: number
}

export interface DonutSlice {
  id: string
  count: number
  color: string
}

export interface Metrics {
  volumeWeeks: string[]
  volumeCreated: number[]
  volumeClosed: number[]
  byStatus: DonutSlice[]
  byPriority: DonutSlice[]
}

export interface HeatmapData {
  rows: { id: string; name: string }[]
  cols: { id: string; name: string }[]
  values: Record<string, Record<string, number>>
}

export interface Notification {
  id: number
  icon: string
  when: string
  text: string
}

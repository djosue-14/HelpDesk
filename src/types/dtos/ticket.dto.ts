import type { TicketPriority, TicketStatus, CommentVisibility } from '@t/enums'

export interface TicketAttachmentDto {
  ticketAttachmentId: number
  ticketId: number
  commentId: number | null
  originalFileName: string | null
  fileExtension: string | null
  fileSizeBytes: number
  uploadedBy: string | null
  uploadedAt: string
}

export interface TicketCommentDto {
  ticketCommentId: number
  ticketId: number
  content: string | null
  authorId: string | null
  visibility: CommentVisibility | null
  createdAt: string
  attachments: TicketAttachmentDto[] | null
}

export interface TicketDto {
  ticketId: number
  ticketNumber: number
  subject: string | null
  description: string | null
  departmentName: string | null
  supportTypeName: string | null
  priority: TicketPriority | null
  status: TicketStatus | null
  resolutionCategory: string | null
  assignedAgentUsername: string | null
  createdAt: string
  createdBy: string | null
  firstOpenedAt: string | null
  workStartedAt: string | null
  deadline: string
  closedAt: string | null
  totalPausedMinutes: number
  remainingSlaPct: number
  comments: TicketCommentDto[] | null
  attachments: TicketAttachmentDto[] | null
}

export interface TicketSummaryDto {
  ticketId: number
  ticketNumber: number
  subject: string | null
  priority: TicketPriority | null
  status: TicketStatus | null
  departmentName: string | null
  supportTypeName: string | null
  createdBy: string | null
  assignedAgentUsername: string | null
  deadline: string
  remainingSlaPct: number
}

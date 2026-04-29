import type { TicketPriority, CommentVisibility } from '@t/enums'

export interface CreateTicketRequest {
  departmentId: number
  supportTypeId: number
  priority: TicketPriority
  subject: string
  description?: string | null
}

export interface UpdateTicketStatusRequest {
  newStatus: string
}

export interface CloseTicketRequest {
  resolutionCategory: string
  closingComment?: string | null
}

export interface ReopenTicketRequest {
  reason?: string | null
}

export interface RedirectTicketRequest {
  newSupportTypeId: number
}

export interface AddCommentRequest {
  content: string
  visibility: CommentVisibility
}

export interface RateTicketRequest {
  hasComment: boolean
}

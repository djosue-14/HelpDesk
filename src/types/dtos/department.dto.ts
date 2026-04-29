export interface DepartmentDto {
  departmentId: number
  name: string | null
  description: string | null
  coordinatorUserId: string | null
  isEnabled: boolean
}

export interface SupportTypeDto {
  supportTypeId: number
  departmentId: number
  name: string | null
  description: string | null
  isEnabled: boolean
}

export interface SupportTypeAgentDto {
  supportTypeAgentId: number
  supportTypeId: number
  supportTypeName: string | null
  userId: string | null
  isEnabled: boolean
  createdAt: string
  createdBy: string | null
  disabledAt: string | null
  disabledBy: string | null
}

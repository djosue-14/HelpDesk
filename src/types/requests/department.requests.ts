export interface CreateDepartmentRequest {
  name: string
  description?: string | null
  coordinatorUserId?: string | null
}

export interface CreateSupportTypeRequest {
  departmentId: number
  name: string
  description?: string | null
}

export interface AssignAgentRequest {
  supportTypeId: number
}

export interface UpdateSlaConfigurationRequest {
  hoursLimit: number
}

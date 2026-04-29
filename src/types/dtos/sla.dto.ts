import type { TicketPriority } from '@t/enums'

export interface SlaConfigurationDto {
  slaConfigurationId: number
  priority: TicketPriority | null
  hoursLimit: number
  lastModifiedAt: string | null
  lastModifiedBy: string | null
}

import { useAuthContext } from '@hooks/useAuthContext'
import { HD_ROLES } from '@data/seed'
import type { Role } from '@/data/types'
import DashRequesterView from '@views/dashboard/DashRequesterView'
import DashAgentView from '@views/dashboard/DashAgentView'
import DashCoordView from '@views/dashboard/DashCoordView'

interface HomeViewProps {
  onCreateTicket: () => void
}

function deriveRole(roleId: string | undefined): Role {
  return HD_ROLES.find(r => r.id === roleId) ?? HD_ROLES[0]
}

export default function HomeView({ onCreateTicket }: HomeViewProps) {
  const { user } = useAuthContext()
  const role = deriveRole(user?.role)

  if (role.id === 'requester') return (
    <DashRequesterView role={role} onCreate={onCreateTicket} />
  )
  if (role.id === 'agent') return (
    <DashAgentView role={role} />
  )
  return (
    <DashCoordView role={role} isAdmin={role.id === 'admin'} />
  )
}

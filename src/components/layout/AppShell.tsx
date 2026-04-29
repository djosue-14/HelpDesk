import { Outlet } from 'react-router'
import SideNav from './SideNav'
import TopBar from './TopBar'
import type { Role } from '@/data/types'

interface AppShellProps {
  role: Role
  onRoleChange: (r: Role) => void
  onCreateTicket: () => void
}

export default function AppShell({ role, onRoleChange, onCreateTicket }: AppShellProps) {
  return (
    <div className="bg-surface text-on-surface h-screen overflow-hidden flex">
      <SideNav role={role} onCreateTicket={onCreateTicket} />
      <main className="flex-1 h-full overflow-y-auto relative">
        <TopBar role={role} onRoleChange={onRoleChange} onCreateTicket={onCreateTicket} />
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

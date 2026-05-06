import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router'
import { useAuthContext } from '@hooks/useAuthContext'
import { useRouteContext } from '@hooks/useRouteContext'
import { USE_MOCK_AUTH } from '@config'
import { getMockTokenForRole } from '@services/auth.service'
import AppShell from '@/components/layout/AppShell'
import type { Role } from '@/data/types'
import { HD_ROLES } from '@/data/seed'
import { AuthMiddleware } from '@middleware/AuthMiddleware'
import TicketsListView from '@views/tickets/TicketsListView'
import TicketDetailView from '@views/tickets/TicketDetailView'
import LeaderboardView from '@views/analytics/LeaderboardView'
import MetricsView from '@views/analytics/MetricsView'
import HeatmapView from '@views/analytics/HeatmapView'
import AgentsPerformanceView from '@views/analytics/AgentsPerformanceView'
import DepartmentsView from '@views/admin/DepartmentsView'
import SupportTypesView from '@views/admin/SupportTypesView'
import AssignmentsView from '@views/admin/AssignmentsView'
import SlaConfigView from '@views/admin/SlaConfigView'
import { CreateTicketDialog } from '@/components/dialogs/TicketDialogs'
import LoginView from '@views/LoginView'
import HomeView from '@views/HomeView'

function deriveRole(authRole: string | undefined): Role {
  return HD_ROLES.find(r => r.id === authRole) ?? HD_ROLES[0]
}

export default function App() {
  const { user, login } = useAuthContext()
  const { routes } = useRouteContext()
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)

  const role = deriveRole(user?.role)

  function handleRoleChange(r: Role) {
    if (USE_MOCK_AUTH) {
      const token = getMockTokenForRole(r.id)
      login(token)
    }
    navigate('/')
  }

  type ViewFactory = (role: Role) => React.ReactNode

  const VIEW_MAP: Record<string, ViewFactory> = {
    '/':                  () => <HomeView onCreateTicket={() => setShowCreate(true)} />,
    '/tickets':           (r) => <TicketsListView role={r} />,
    '/tickets/:id':       (r) => <TicketDetailView role={r} />,
    '/queue':             (r) => <TicketsListView role={r} scope="queue" />,
    '/score':             () => <LeaderboardView />,
    '/leaderboard':       () => <LeaderboardView />,
    '/metrics':           () => <MetricsView />,
    '/heatmap':           () => <HeatmapView />,
    '/agents':            () => <AgentsPerformanceView />,
    '/admin/departments': () => <DepartmentsView />,
    '/admin/types':       () => <SupportTypesView />,
    '/admin/assignments': () => <AssignmentsView />,
    '/admin/sla':         () => <SlaConfigView />,
  }

  const shell = (
    <AppShell
      role={role}
      onRoleChange={handleRoleChange}
      onCreateTicket={() => setShowCreate(true)}
    />
  )

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route element={<AuthMiddleware />}>
          <Route element={shell}>
            {(routes ?? []).map(route => {
              const factory = VIEW_MAP[route.path]
              if (!factory) return null
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={factory(role)}
                />
              )
            })}
            <Route index element={<HomeView onCreateTicket={() => setShowCreate(true)} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>

      {showCreate && (
        <CreateTicketDialog
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); navigate('/tickets') }}
        />
      )}
    </>
  )
}

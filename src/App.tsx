import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router'
import { useAuthContext } from '@hooks/useAuthContext'
import { USE_MOCK } from '@config'
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
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)

  const role = deriveRole(user?.role)

  function handleRoleChange(r: Role) {
    if (USE_MOCK) {
      const token = getMockTokenForRole(r.id)
      login(token)
    }
    navigate('/')
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
            <Route index element={<HomeView onCreateTicket={() => setShowCreate(true)} />} />
            <Route path="tickets" element={<TicketsListView role={role} />} />
            <Route path="tickets/:id" element={<TicketDetailView role={role} />} />
            <Route path="queue" element={<TicketsListView role={role} scope="queue" />} />
            <Route path="score" element={<LeaderboardView />} />
            <Route path="leaderboard" element={<LeaderboardView />} />
            <Route path="metrics" element={<MetricsView />} />
            <Route path="heatmap" element={<HeatmapView />} />
            <Route path="agents" element={<AgentsPerformanceView />} />
            <Route path="admin/departments" element={<DepartmentsView />} />
            <Route path="admin/types" element={<SupportTypesView />} />
            <Route path="admin/assignments" element={<AssignmentsView />} />
            <Route path="admin/sla" element={<SlaConfigView />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
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

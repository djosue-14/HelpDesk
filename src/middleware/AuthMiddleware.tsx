import { Navigate, Outlet } from 'react-router'
import { useAuthContext } from '@hooks/useAuthContext'

export const AuthMiddleware: React.FC = () => {
  const { isAuthenticated } = useAuthContext()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { USE_MOCK } from '@config'
import { useAuthContext } from '@hooks/useAuthContext'
import { getMockTokenForRole } from '@services/auth.service'
import { HD_ROLES } from '@data/seed'

const ROLE_COLORS: Record<string, string> = {
  requester:   'bg-blue-100 text-blue-700',
  agent:       'bg-violet-100 text-violet-700',
  coordinator: 'bg-amber-100 text-amber-700',
  admin:       'bg-slate-100 text-slate-700',
}

export default function LoginView() {
  const { isAuthenticated, login } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const handleMockLogin = (roleId: string) => {
    const token = getMockTokenForRole(roleId)
    login(token)
  }

  if (!USE_MOCK) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-dark-surface">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary dark:text-dark-primary mb-4 block">support_agent</span>
          <h1 className="text-2xl font-semibold text-on-surface dark:text-dark-on-surface mb-2">HelpDesk Enterprise</h1>
          <p className="text-on-surface-variant dark:text-dark-on-surface-variant text-sm">Iniciando sesión con Windows Auth…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface dark:bg-dark-surface gap-8 p-8">
      <div className="text-center">
        <span className="material-symbols-outlined text-5xl text-primary dark:text-dark-primary block mb-2">support_agent</span>
        <h1 className="text-2xl font-bold text-on-surface dark:text-dark-on-surface">HelpDesk Enterprise</h1>
        <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mt-1">Selecciona un perfil para continuar (modo demo)</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {HD_ROLES.map(role => (
          <button
            key={role.id}
            onClick={() => handleMockLogin(role.id)}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-outline-variant dark:border-dark-outline-variant bg-surface-container dark:bg-dark-surface-container hover:bg-surface-container-high dark:hover:bg-dark-surface-container-high transition-colors cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${ROLE_COLORS[role.id]}`}>
              {role.user.initials}
            </div>
            <div className="text-center">
              <p className="font-medium text-on-surface dark:text-dark-on-surface text-sm">{role.user.name}</p>
              <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">{role.name}</p>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">
        Para cambiar a API real: <code className="bg-surface-container dark:bg-dark-surface-container px-1 rounded">VITE_USE_MOCK=false</code>
      </p>
    </div>
  )
}

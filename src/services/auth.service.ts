import { USE_MOCK_AUTH } from '@config'
import apiClient from '@api/client/apiClient'
import type { TokenResponse } from '@t/auth'
import type { RouteProp } from '@t/route'
import { HD_ROLES, HD_PEOPLE } from '@data/seed'
import routesByRole from '@data/routes.json'

// --- Mock JWT generator ---

function makePayload(obj: object): string {
  return btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function buildMockToken(personKey: string): string {
  const person = HD_PEOPLE[personKey]
  if (!person) throw new Error(`Unknown mock user: ${personKey}`)

  const header = makePayload({ alg: 'none', typ: 'JWT' })
  const payload = makePayload({
    sub: person.id,
    username: person.username,
    name: person.name,
    role: person.role,
    dept: person.dept,
    exp: Math.floor(Date.now() / 1000) + 3600 * 8,
    iat: Math.floor(Date.now() / 1000),
  })
  const tokenRaw = JSON.stringify({
    access_token: `${header}.${payload}.mock-signature`,
    refresh_token: `mock-refresh-${person.id}`,
    expires_in: 28800,
    scope: 'openid profile',
    token_type: 'Bearer',
  })
  return tokenRaw
}

export function getMockTokenForRole(roleId: string): string {
  const role = HD_ROLES.find(r => r.id === roleId)
  if (!role) throw new Error(`Unknown role: ${roleId}`)
  const personKey = Object.entries(HD_PEOPLE).find(([, p]) => p.id === role.user.id)?.[0]
  if (!personKey) throw new Error(`No person for role: ${roleId}`)
  return buildMockToken(personKey)
}

const PUBLIC_ROUTES: RouteProp[] = [
  { path: '/login', label: 'Iniciar sesión', icon: 'login' },
]

// --- Auth service ---

const authService = {
  async getWindowsAuthAuthentication(): Promise<{ success: boolean }> {
    if (USE_MOCK_AUTH) return { success: true }
    const res = await apiClient.get<{ access_token: string }>('/Auth/windows')
    return { success: !!res.data?.access_token }
  },

  async refreshToken(accessToken: string, refreshToken: string): Promise<TokenResponse | null> {
    if (USE_MOCK_AUTH) {
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 28800,
        scope: 'openid profile',
        token_type: 'Bearer',
      }
    }
    try {
      const res = await apiClient.post<TokenResponse>('/Auth/refresh', { accessToken, refreshToken })
      return res.data
    } catch {
      return null
    }
  },

  async getPrivateRoutes(userId: string): Promise<RouteProp[]> {
    if (USE_MOCK_AUTH) {
      const person = Object.values(HD_PEOPLE).find(p => p.id === userId || p.username === userId)
      const role = (person?.role ?? 'requester') as keyof typeof routesByRole
      return (routesByRole[role] ?? []) as RouteProp[]
    }
    const res = await apiClient.get<RouteProp[]>(`/Auth/routes/${userId}`)
    return res.data
  },

  async getPublicRoutes(): Promise<RouteProp[]> {
    return PUBLIC_ROUTES
  },

  async logout(): Promise<void> {
    if (USE_MOCK_AUTH) return
    await apiClient.post('/Auth/logout')
  },
}

export default authService

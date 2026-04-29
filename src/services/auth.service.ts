import { USE_MOCK } from '@config'
import apiClient from '@api/client/apiClient'
import type { TokenResponse } from '@t/auth'
import type { RouteProp } from '@t/route'
import { HD_ROLES, HD_PEOPLE } from '@data/seed'

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

// --- Route definitions by role ---

const ROUTES_BY_ROLE: Record<string, RouteProp[]> = {
  requester: [
    { path: '/',       label: 'Mi panel',     icon: 'home',       section: 'Trabajo' },
    { path: '/tickets',label: 'Mis tickets',  icon: 'confirmation_number', section: 'Trabajo', badge: 4 },
    { path: '/score',  label: 'Mis puntos',   icon: 'star',       section: 'Reputación' },
  ],
  agent: [
    { path: '/',        label: 'Panel',        icon: 'home',          section: 'Bandeja' },
    { path: '/tickets', label: 'Asignados',    icon: 'inbox',         section: 'Bandeja', badge: 7 },
    { path: '/queue',   label: 'Cola del depto.', icon: 'queue',     section: 'Bandeja', badge: 12 },
    { path: '/leaderboard', label: 'Ranking',  icon: 'leaderboard',   section: 'Mi desempeño' },
    { path: '/dashboard',   label: 'Mis métricas', icon: 'bar_chart', section: 'Mi desempeño' },
  ],
  coordinator: [
    { path: '/',         label: 'Panel',       icon: 'home',          section: 'Operación' },
    { path: '/tickets',  label: 'Todos los tickets', icon: 'confirmation_number', section: 'Operación', badge: 49 },
    { path: '/dashboard',label: 'Métricas',    icon: 'bar_chart',     section: 'Operación' },
    { path: '/heatmap',  label: 'Mapa de calor', icon: 'grid_view',   section: 'Operación' },
    { path: '/agents',   label: 'Rendimiento', icon: 'groups',        section: 'Equipo' },
    { path: '/leaderboard', label: 'Ranking',  icon: 'leaderboard',   section: 'Equipo' },
  ],
  admin: [
    { path: '/',                  label: 'Panel',          icon: 'home',               section: 'Operación' },
    { path: '/tickets',           label: 'Todos los tickets', icon: 'confirmation_number', section: 'Operación', badge: 301 },
    { path: '/dashboard',         label: 'Métricas',       icon: 'bar_chart',          section: 'Operación' },
    { path: '/heatmap',           label: 'Mapa de calor',  icon: 'grid_view',          section: 'Operación' },
    { path: '/admin/departments', label: 'Departamentos',  icon: 'corporate_fare',     section: 'Catálogos' },
    { path: '/admin/sla',         label: 'Config SLA',     icon: 'timer',              section: 'Catálogos' },
  ],
}

const PUBLIC_ROUTES: RouteProp[] = [
  { path: '/login', label: 'Iniciar sesión', icon: 'login' },
]

// --- Auth service ---

const authService = {
  async getWindowsAuthAuthentication(): Promise<{ success: boolean }> {
    if (USE_MOCK) return { success: true }
    const res = await apiClient.get<{ access_token: string }>('/Auth/windows')
    return { success: !!res.data?.access_token }
  },

  async refreshToken(accessToken: string, refreshToken: string): Promise<TokenResponse | null> {
    if (USE_MOCK) {
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
    if (USE_MOCK) {
      const person = Object.values(HD_PEOPLE).find(p => p.id === userId || p.username === userId)
      const role = person?.role ?? 'requester'
      return ROUTES_BY_ROLE[role] ?? []
    }
    const res = await apiClient.get<RouteProp[]>(`/Auth/routes/${userId}`)
    return res.data
  },

  async getPublicRoutes(): Promise<RouteProp[]> {
    return PUBLIC_ROUTES
  },

  async logout(): Promise<void> {
    if (USE_MOCK) return
    await apiClient.post('/Auth/logout')
  },
}

export default authService

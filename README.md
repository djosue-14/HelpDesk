# HelpDesk.Client

## 📋 Descripción General

**HelpDesk.Client** es la capa de presentación frontend del proyecto HelpDesk, construida como una Single Page Application (SPA) con React 19, TypeScript y Vite. Proporciona la interfaz de usuario para la gestión de tickets de soporte, dashboard de métricas, administración de agentes, configuración de SLA y sistema de reputación, implementando una librería de componentes Material Design 3 personalizada.

---

## 🎯 Propósito

- **Interfaz de usuario**: SPA moderna y responsiva para gestión de tickets HelpDesk
- **Sistema de temas**: Soporte completo para modo claro/oscuro con Material Design 3
- **Gestión de estado**: Context API para estado local, React Query para estado del servidor
- **Integración API**: Capa de servicios con Axios para comunicación con HelpDesk.API
- **Autenticación**: Sistema JWT con Windows Auth, auto-refresh y middleware de protección de rutas

---

## 🏗️ Arquitectura

### Stack Tecnológico

| Elemento | Tecnología |
|---|---|
| Framework | React 19.1.1 + TypeScript 5.8.3 |
| Build Tool | Vite 7.1.2 con HMR |
| Estilos | Tailwind CSS v4.1.12 + Material Design 3 |
| Package Manager | Yarn v4.9.3 con Plug'n'Play (PnP) |

### Principios Aplicados

- **Component-Based Architecture**: Componentes reutilizables y encapsulados
- **Separation of Concerns**: API, componentes, hooks, contexto y vistas separados
- **Type Safety**: TypeScript estricto con DTOs y enums tipados
- **Material Design 3**: Consistencia visual siguiendo especificaciones de Google
- **Responsive Design**: Adaptación a múltiples tamaños de pantalla

---

## 📦 Dependencias

### Paquetes Principales

| Paquete | Versión | Propósito |
|---|---|---|
| `react` | 19.1.1 | Framework de UI |
| `react-dom` | 19.1.1 | Renderizado DOM |
| `react-router` | 7.8.2 | Enrutamiento SPA |
| `@tanstack/react-query` | 5.87.4 | Estado del servidor y caché |
| `@tanstack/react-table` | 8.21.3 | Tablas con sorting/filtering |
| `axios` | 1.12.2 | Cliente HTTP |
| `formik` | 2.4.9 | Gestión de formularios |
| `yup` | 1.7.1 | Validación de esquemas |
| `jwt-decode` | 4.0.0 | Decodificación de tokens JWT |
| `@headlessui/react` | 2.2.7 | Primitivos UI accesibles |
| `react-number-format` | 5.4.4 | Formateo de números |
| `react-hot-toast` | 2.6.0 | Notificaciones toast |

### Herramientas de Desarrollo

| Paquete | Versión | Propósito |
|---|---|---|
| `vite` | 7.1.2 | Bundler y servidor de desarrollo |
| `typescript` | 5.8.3 | Tipado estático |
| `tailwindcss` | 4.1.12 | Framework de estilos utilitarios |
| `eslint` | 9.28.0 | Linting de código |

---

## 📁 Estructura del Proyecto

```
HelpDesk.Client/
├── src/
│   ├── api/                              # Capa de integración API
│   │   ├── client/
│   │   │   └── apiClient.ts              # Instancia Axios con interceptores JWT
│   │   └── services/                     # Servicios por entidad (uno por controlador)
│   │       ├── dashboardService.ts
│   │       ├── departmentService.ts
│   │       ├── scoreService.ts
│   │       ├── slaConfigurationService.ts
│   │       ├── supportTypeAgentService.ts
│   │       ├── supportTypeService.ts
│   │       ├── ticketCommentService.ts
│   │       ├── ticketService.ts
│   │       └── index.ts                  # Barrel de exportación
│   │
│   ├── context/                          # Proveedores de Context API
│   │   ├── AuthContext.tsx               # Estado de autenticación y JWT
│   │   └── RouteContext.tsx              # Rutas dinámicas por rol
│   │
│   ├── hooks/                            # Hooks personalizados
│   │   ├── useTheme.ts                   # Gestión de tema claro/oscuro/sistema
│   │   ├── useConfirm.tsx                # Diálogos de confirmación
│   │   ├── useAuthContext.ts             # Acceso tipado al contexto de auth
│   │   ├── useRouteContext.ts            # Acceso tipado al contexto de rutas
│   │   └── index.ts
│   │
│   ├── providers/                        # Proveedores de contexto
│   │   └── ThemeProvider.tsx             # Proveedor de tema MD3
│   │
│   ├── middleware/                       # Middleware de rutas
│   │   └── AuthMiddleware.tsx            # Protección de rutas autenticadas
│   │
│   ├── types/                            # Definiciones de tipos TypeScript
│   │   ├── dtos/                         # DTOs — reflejan los contratos del API
│   │   │   ├── ticket.dto.ts
│   │   │   ├── dashboard.dto.ts
│   │   │   ├── department.dto.ts
│   │   │   ├── score.dto.ts
│   │   │   ├── sla.dto.ts
│   │   │   └── index.ts
│   │   ├── requests/                     # Request bodies tipados
│   │   │   ├── ticket.requests.ts
│   │   │   ├── department.requests.ts
│   │   │   └── index.ts
│   │   ├── enums/                        # Enumeraciones del dominio
│   │   │   ├── TicketPriority.ts
│   │   │   ├── TicketStatus.ts
│   │   │   ├── CommentVisibility.ts
│   │   │   └── index.ts
│   │   ├── ApiResponse.ts                # Wrapper genérico de respuesta API
│   │   ├── auth.ts                       # Tipos de autenticación
│   │   └── route.ts                      # Definiciones de rutas
│   │
│   ├── views/                            # Páginas/Vistas de la aplicación
│   │   ├── HomeView.tsx                  # Dashboard principal
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx
│   │   │   └── components/
│   │   ├── tickets/
│   │   │   ├── TicketsListView.tsx
│   │   │   ├── TicketDetailView.tsx
│   │   │   └── components/
│   │   ├── dashboard/
│   │   │   ├── DashboardView.tsx
│   │   │   └── components/
│   │   └── admin/
│   │       ├── DepartmentsView.tsx
│   │       ├── SlaConfigView.tsx
│   │       └── components/
│   │
│   ├── services/                         # Servicios de integración externa
│   │   └── auth.service.ts               # Servicio de autenticación (Windows Auth)
│   │
│   ├── theme/                            # Sistema de temas Material Design 3
│   │   ├── material-theme.json
│   │   ├── colors.css
│   │   ├── generate-css-colors.js
│   │   ├── material-theme-blue.json
│   │   └── material-theme-brown.json
│   │
│   ├── utils/                            # Funciones utilitarias
│   │   ├── jwt.ts                        # Manejo de tokens JWT
│   │   └── image.ts
│   │
│   ├── data/                             # Datos mock/estáticos
│   │   ├── auth.json
│   │   └── routes.json
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── eslint.config.js
├── package.json
├── .env
├── .env.development
└── .env.production
```

---

## 🔑 Componentes Clave

### 1. API Client

#### `src/api/client/apiClient.ts`

```typescript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Adjunta JWT en cada request
apiClient.interceptors.request.use((config) => {
  const raw = sessionStorage.getItem('authToken')
  if (raw) {
    try {
      const { access_token } = JSON.parse(raw)
      if (access_token) config.headers.Authorization = `Bearer ${access_token}`
    } catch {
      // token malformado — interceptor de respuesta lo manejará
    }
  }
  return config
})

// Manejo global de errores HTTP
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // El AuthContext ya maneja redirect a /login
    }
    console.error('API Error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

export default apiClient
```

#### Patrón de Servicios — `wrapResponse` / `wrapError`

Todos los servicios siguen este patrón para retornar un `ApiResponse<T>` consistente:

```typescript
// src/types/ApiResponse.ts
export interface ApiResponse<T> {
  data: T | null
  success: boolean
  message: string | null
  statusCode: number | null
}

export function wrapResponse<T>(data: T, statusCode = 200): ApiResponse<T> {
  return { data, success: true, message: null, statusCode }
}

export function wrapError<T>(error: unknown): ApiResponse<T> {
  const axiosError = error as import('axios').AxiosError
  return {
    data: null,
    success: false,
    message: (axiosError.response?.data as { detail?: string })?.detail
      ?? axiosError.message
      ?? 'Error desconocido',
    statusCode: axiosError.response?.status ?? null,
  }
}
```

---

### 2. Sistema de Autenticación

#### `src/context/AuthContext.tsx`

```typescript
import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import type { AuthContextType, AuthProviderProps, User } from '@types/auth'
import {
  isTokenValid,
  getUserFromToken,
  removeTokenFromStorage,
  setTokenInStorage,
} from '@utils/jwt'
import authService from '@services/auth.service'

const AuthContext = createContext<AuthContextType | null>(null)
AuthContext.displayName = 'AuthContext'

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  // Consulta periódica a Windows Auth para mantener sesión viva
  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ['windowsAuth'],
    queryFn: () => authService.getWindowsAuthAuthentication(),
    refetchInterval: 1800000,          // cada 30 minutos
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoading) return

      if (isError) {
        console.error('rror al autenticar con Windows Auth API.')
        removeTokenFromStorage()
        setIsAuthenticated(false)
        setUser(null)
        navigate('/login')
        return
      }

      let tokenRaw = sessionStorage.getItem('authToken')
      const isRefreshing = sessionStorage.getItem('tokenRefreshing')

      // Esperar si hay un refresh en curso (previene race conditions)
      if (isRefreshing === 'true') {
        for (let i = 0; i < 20; i++) {
          await new Promise((res) => setTimeout(res, 400))
          if (sessionStorage.getItem('tokenRefreshing') !== 'true') break
        }
        tokenRaw = sessionStorage.getItem('authToken')
      }

      // Intentar refresh si el token expiró
      if (tokenRaw && !isTokenValid(tokenRaw)) {
        try {
          const { access_token, refresh_token } = JSON.parse(tokenRaw)
          sessionStorage.setItem('tokenRefreshing', 'true')
          const refreshed = await authService.refreshToken(access_token, refresh_token)

          if (refreshed?.access_token) {
            const newTokenString = JSON.stringify({
              access_token: refreshed.access_token,
              refresh_token: refreshed.refresh_token,
              expires_in: refreshed.expires_in,
              scope: refreshed.scope,
              token_type: 'Bearer',
            })
            setTokenInStorage(newTokenString)
            tokenRaw = newTokenString
          } else {
            removeTokenFromStorage()
            tokenRaw = null
          }
        } catch (err) {
          console.error('Error refreshing token:', err)
          removeTokenFromStorage()
          tokenRaw = null
        } finally {
          sessionStorage.removeItem('tokenRefreshing')
        }
      }

      if (tokenRaw && isTokenValid(tokenRaw)) {
        const userFromToken = getUserFromToken(tokenRaw)
        setIsAuthenticated(true)
        setUser(userFromToken)
      } else {
        removeTokenFromStorage()
        setIsAuthenticated(false)
        setUser(null)
        navigate('/login')
      }
    }

    checkAuth()
  }, [navigate, isSuccess, data, isLoading, isError])

  const login = (token: string): void => {
    if (!token) {
      console.error('Token is required for login')
      return
    }
    setTokenInStorage(token)
    const userFromToken = getUserFromToken(token)
    setIsAuthenticated(true)
    setUser(userFromToken)
    navigate('/')
  }

  const logout = async (): Promise<void> => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      removeTokenFromStorage()
      setIsAuthenticated(false)
      setUser(null)
      navigate('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
```

#### Flujo de autenticación

```
App inicia
  └─► useQuery['windowsAuth'] ──► authService.getWindowsAuthAuthentication()
        │
        ├─ isError → removeToken → navigate('/login')
        │
        └─ isSuccess → checkAuth()
              │
              ├─ token válido ──────────────────────────► setUser() + setIsAuthenticated(true)
              │
              ├─ token expirado → refreshToken()
              │       ├─ OK  → setTokenInStorage() → setUser()
              │       └─ KO  → removeToken → navigate('/login')
              │
              └─ sin token → navigate('/login')
```

#### `src/hooks/useAuthContext.ts`

```typescript
import { useContext } from 'react'
import AuthContext from '@context/AuthContext'
import type { AuthContextType } from '@types/auth'

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
```

---

### 3. Contexto de Rutas

#### `src/context/RouteContext.tsx`

```typescript
import { createContext, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import authService from '@services/auth.service'
import { useAuthContext } from '@hooks/useAuthContext'
import type { RouteProp, RouteContextType, RouteProviderProps } from '@types/route'

const RouteContext = createContext<RouteContextType | null>(null)
RouteContext.displayName = 'RouteContext'

export const RouteProvider: React.FC<RouteProviderProps> = ({ children }) => {
  const [routes, setRoutes] = useState<RouteProp[]>()
  const { isAuthenticated, user } = useAuthContext()

  const { data } = useQuery({
    queryKey: ['rutas', isAuthenticated, user?.sub],
    queryFn: () => {
      // Rutas privadas si está autenticado, públicas si no
      if (isAuthenticated && user?.sub) {
        return authService.getPrivateRoutes(user.sub)
      }
      return authService.getPublicRoutes()
    },
    refetchInterval: 1800000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (data) setRoutes(data)
  }, [data])

  return (
    <RouteContext.Provider value={{ routes, setRoutes }}>
      {children}
    </RouteContext.Provider>
  )
}

export { RouteContext }
```

#### `src/hooks/useRouteContext.ts`

```typescript
import { useContext } from 'react'
import { RouteContext } from '@context/RouteContext'
import type { RouteContextType } from '@types/route'

export const useRouteContext = (): RouteContextType => {
  const context = useContext(RouteContext)
  if (!context) {
    throw new Error('useRouteContext must be used within a RouteProvider')
  }
  return context
}
```

---

### 4. Sistema de Temas

#### `src/hooks/useTheme.ts`

```typescript
import { useState, useEffect, createContext, useContext } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  resolvedTheme: ResolvedTheme
  setMode: (mode: ThemeMode) => void
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}

export const useThemeLogic = (initialMode: ThemeMode = 'system') => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme-mode') as ThemeMode) || initialMode
    }
    return initialMode
  })

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')

  // Detectar y reaccionar a preferencias del sistema operativo
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const updateResolvedTheme = () => {
      if (mode === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light')
      } else {
        setResolvedTheme(mode as ResolvedTheme)
      }
    }

    updateResolvedTheme()
    mediaQuery.addEventListener('change', updateResolvedTheme)
    return () => mediaQuery.removeEventListener('change', updateResolvedTheme)
  }, [mode])

  // Aplicar clase dark/light al elemento raíz del DOM
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('theme-transition')
    root.classList.remove('dark', 'light')
    root.classList.add(resolvedTheme)
    const timer = setTimeout(() => root.classList.remove('theme-transition'), 300)
    return () => clearTimeout(timer)
  }, [resolvedTheme, mode])

  // Persistir preferencia en localStorage
  useEffect(() => {
    localStorage.setItem('theme-mode', mode)
  }, [mode])

  const toggleTheme = () => {
    setMode((current) => {
      if (current === 'light') return 'dark'
      if (current === 'dark') return 'system'
      return 'light'
    })
  }

  return { mode, resolvedTheme, setMode, toggleTheme, isDark: resolvedTheme === 'dark' }
}

export { ThemeContext }
```

---

### 5. Gestión de Estado con React Query

#### `src/main.tsx`

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from '@providers/ThemeProvider'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,         // 5 minutos
      gcTime: 10 * 60 * 1000,           // 10 minutos (garbage collection)
      refetchOnWindowFocus: false,
    },
  },
})

// Orden de providers: QueryClient → Theme → Router → Auth → Routes → App
ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <RouteProvider>
            <App />
          </RouteProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
)
```

---

## 🌐 Integración con HelpDesk API

> **Base URL:** `/api` (proxy Vite en desarrollo → `http://localhost:5119`)  
> **Autenticación:** JWT Bearer — el token se lee de `sessionStorage['authToken']` y se inyecta automáticamente por el interceptor de axios.  
> **Versión API:** v1 · OpenAPI 3.0.4

**Regla crítica:** El `userId` / `authorId` / `createdBy` de cualquier operación **nunca se envía en el body** — el backend lo extrae del JWT. El frontend no debe incluir estos campos en ningún request.

---

### Tipos compartidos

#### `src/types/enums/TicketPriority.ts`

```typescript
export type TicketPriority = 'Critical' | 'High' | 'Medium' | 'Low'
```

#### `src/types/enums/TicketStatus.ts`

```typescript
export type TicketStatus = 'Open' | 'InProgress' | 'Paused' | 'Closed'
```

#### `src/types/enums/CommentVisibility.ts`

```typescript
export type CommentVisibility = 'Public' | 'Internal'
```

#### `src/types/enums/index.ts`

```typescript
export type { TicketPriority } from './TicketPriority'
export type { TicketStatus } from './TicketStatus'
export type { CommentVisibility } from './CommentVisibility'
```

---

### DTOs de respuesta

#### `src/types/dtos/department.dto.ts`

```typescript
export interface DepartmentDto {
  departmentId: number
  name: string | null
  description: string | null
  coordinatorUserId: string | null
  isEnabled: boolean
}

export interface SupportTypeDto {
  supportTypeId: number
  departmentId: number
  name: string | null
  description: string | null
  isEnabled: boolean
}

export interface SupportTypeAgentDto {
  supportTypeAgentId: number
  supportTypeId: number
  supportTypeName: string | null
  userId: string | null
  isEnabled: boolean
  createdAt: string         // ISO 8601
  createdBy: string | null
  disabledAt: string | null
  disabledBy: string | null
}
```

#### `src/types/dtos/sla.dto.ts`

```typescript
import type { TicketPriority } from '@types/enums'

export interface SlaConfigurationDto {
  slaConfigurationId: number
  priority: TicketPriority | null
  hoursLimit: number
  lastModifiedAt: string | null
  lastModifiedBy: string | null
}
```

#### `src/types/dtos/ticket.dto.ts`

```typescript
import type { TicketPriority, TicketStatus, CommentVisibility } from '@types/enums'

export interface TicketAttachmentDto {
  ticketAttachmentId: number
  ticketId: number
  commentId: number | null
  originalFileName: string | null
  fileExtension: string | null
  fileSizeBytes: number
  uploadedBy: string | null
  uploadedAt: string         // ISO 8601
}

export interface TicketCommentDto {
  ticketCommentId: number
  ticketId: number
  content: string | null
  authorId: string | null
  visibility: CommentVisibility | null
  createdAt: string          // ISO 8601
  attachments: TicketAttachmentDto[] | null
}

/** Detalle completo de un ticket — incluye comentarios y adjuntos */
export interface TicketDto {
  ticketId: number
  ticketNumber: number
  subject: string | null
  description: string | null
  departmentName: string | null
  supportTypeName: string | null
  priority: TicketPriority | null
  status: TicketStatus | null
  resolutionCategory: string | null
  assignedAgentUsername: string | null
  createdAt: string          // ISO 8601
  createdBy: string | null
  firstOpenedAt: string | null
  workStartedAt: string | null
  deadline: string           // ISO 8601
  closedAt: string | null
  totalPausedMinutes: number
  comments: TicketCommentDto[] | null
  attachments: TicketAttachmentDto[] | null
}

/** Versión resumida para listados — incluye % de SLA restante */
export interface TicketSummaryDto {
  ticketId: number
  ticketNumber: number
  subject: string | null
  priority: TicketPriority | null
  status: TicketStatus | null
  departmentName: string | null
  supportTypeName: string | null
  assignedAgentUsername: string | null
  deadline: string           // ISO 8601
  remainingSlaPct: number    // 0–100
}
```

#### `src/types/dtos/score.dto.ts`

```typescript
export interface ScoreTransactionDto {
  scoreTransactionId: number
  userId: string | null
  ticketId: number
  points: number
  reason: string | null
  createdAt: string          // ISO 8601
}

export interface UserScoreDto {
  userScoreId: number
  userId: string | null
  currentPoints: number
  level: string | null
  scoreTransactions: ScoreTransactionDto[] | null
}
```

#### `src/types/dtos/dashboard.dto.ts`

```typescript
import type { TicketSummaryDto } from './ticket.dto'

export interface DailyVolumeDto {
  date: string               // "YYYY-MM-DD"
  created: number
  closed: number
}

export interface OperationalMetricsDto {
  from: string               // ISO 8601
  to: string                 // ISO 8601
  totalCreated: number
  totalClosed: number
  totalActive: number
  slaCompliancePct: number
  avgResolutionHours: number
  avgFirstResponseHours: number
  reopenRatePct: number
  redirectRatePct: number
  dailyTrend: DailyVolumeDto[] | null
  /** Clave = prioridad ("Critical" | "High" | ...), valor = % cumplimiento */
  slaByPriority: Record<string, number> | null
  previousPeriod: OperationalMetricsDto | null
}

export interface AgentPerformanceDto {
  userId: string | null
  totalAssigned: number
  totalClosed: number
  totalActive: number
  slaCompliancePct: number
  avgResolutionHours: number
  avgFirstResponseHours: number
  pauseCount: number
  avgPauseMinutes: number
  avgRating: number
  teamAvgSlaCompliancePct: number
  teamAvgResolutionHours: number
  staleTickets: TicketSummaryDto[] | null
}

export interface HeatMapCellDto {
  supportTypeId: number
  supportTypeName: string | null
  ticketCount: number
}

export interface HeatMapRowDto {
  departmentId: number
  departmentName: string | null
  cells: HeatMapCellDto[] | null
}

export interface HeatMapDto {
  from: string               // ISO 8601
  to: string                 // ISO 8601
  rows: HeatMapRowDto[] | null
}

export interface LeaderboardEntryDto {
  rank: number
  userId: string | null
  pointsEarned: number
  ratingRatePct: number
}

export interface LeaderboardDto {
  year: number
  month: number              // 1–12
  top10: LeaderboardEntryDto[] | null
}
```

#### `src/types/dtos/index.ts`

```typescript
export type { DepartmentDto, SupportTypeDto, SupportTypeAgentDto } from './department.dto'
export type { SlaConfigurationDto } from './sla.dto'
export type {
  TicketDto,
  TicketSummaryDto,
  TicketCommentDto,
  TicketAttachmentDto,
} from './ticket.dto'
export type { UserScoreDto, ScoreTransactionDto } from './score.dto'
export type {
  OperationalMetricsDto,
  AgentPerformanceDto,
  HeatMapDto,
  HeatMapRowDto,
  HeatMapCellDto,
  LeaderboardDto,
  LeaderboardEntryDto,
  DailyVolumeDto,
} from './dashboard.dto'
```

---

### Request bodies

#### `src/types/requests/ticket.requests.ts`

```typescript
import type { TicketPriority, CommentVisibility } from '@types/enums'

export interface CreateTicketRequest {
  departmentId: number
  supportTypeId: number
  priority: TicketPriority
  subject: string
  description?: string | null
}

export interface UpdateTicketStatusRequest {
  newStatus: string
}

export interface CloseTicketRequest {
  resolutionCategory: string
  closingComment?: string | null
}

export interface ReopenTicketRequest {
  reason?: string | null
}

export interface RedirectTicketRequest {
  newSupportTypeId: number
}

export interface AddCommentRequest {
  content: string
  visibility: CommentVisibility
}

export interface RateTicketRequest {
  hasComment: boolean
}
```

#### `src/types/requests/department.requests.ts`

```typescript
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

/** El userId del agente se extrae del JWT en el backend — no enviarlo */
export interface AssignAgentRequest {
  supportTypeId: number
}

export interface UpdateSlaConfigurationRequest {
  hoursLimit: number         // entero positivo > 0
}
```

#### `src/types/requests/index.ts`

```typescript
export type {
  CreateTicketRequest,
  UpdateTicketStatusRequest,
  CloseTicketRequest,
  ReopenTicketRequest,
  RedirectTicketRequest,
  AddCommentRequest,
  RateTicketRequest,
} from './ticket.requests'

export type {
  CreateDepartmentRequest,
  CreateSupportTypeRequest,
  AssignAgentRequest,
  UpdateSlaConfigurationRequest,
} from './department.requests'
```

---

### Servicios

Todos los servicios siguen el patrón `wrapResponse/wrapError` y retornan `ApiResponse<T>`.

#### `src/api/services/dashboardService.ts`

```typescript
import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@types/ApiResponse'
import type { ApiResponse } from '@types/ApiResponse'
import type {
  OperationalMetricsDto,
  AgentPerformanceDto,
  HeatMapDto,
  LeaderboardDto,
} from '@types/dtos'

export const dashboardService = {

  getDashboard(): Promise<ApiResponse<unknown>> {
    return apiClient.get('/Dashboard')
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  getMetrics(params?: {
    from?: string
    to?: string
    departmentId?: number
  }): Promise<ApiResponse<OperationalMetricsDto>> {
    return apiClient.get('/Dashboard/metrics', { params })
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  getAgentPerformance(
    agentId: string,
    params?: { from?: string; to?: string }
  ): Promise<ApiResponse<AgentPerformanceDto>> {
    return apiClient.get(`/Dashboard/agents/${agentId}/performance`, { params })
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  getTeamPerformance(
    departmentId: number,
    params?: { from?: string; to?: string }
  ): Promise<ApiResponse<AgentPerformanceDto[]>> {
    return apiClient.get(`/Dashboard/departments/${departmentId}/team-performance`, { params })
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  getHeatmap(params?: {
    from?: string
    to?: string
    departmentIds?: number[]
  }): Promise<ApiResponse<HeatMapDto>> {
    return apiClient.get('/Dashboard/heatmap', {
        params,
        paramsSerializer: { indexes: null }, // ?departmentIds=1&departmentIds=2
      })
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  getLeaderboard(params?: {
    year?: number
    month?: number
  }): Promise<ApiResponse<LeaderboardDto>> {
    return apiClient.get('/Dashboard/leaderboard', { params })
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },
}
```

#### `src/api/services/departmentService.ts`

```typescript
import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@types/ApiResponse'
import type { ApiResponse } from '@types/ApiResponse'
import type { DepartmentDto, SupportTypeDto } from '@types/dtos'
import type { CreateDepartmentRequest } from '@types/requests'

export const departmentService = {

  getAll(): Promise<ApiResponse<DepartmentDto[]>> {
    return apiClient.get('/Departments')
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  create(body: CreateDepartmentRequest): Promise<ApiResponse<DepartmentDto>> {
    return apiClient.post('/Departments', body)
      .then((r) => wrapResponse(r.data, 201))
      .catch(wrapError)
  },

  getById(id: number): Promise<ApiResponse<DepartmentDto>> {
    return apiClient.get(`/Departments/${id}`)
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  /** Soft delete — falla con 400 si el departamento tiene tickets activos */
  delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/Departments/${id}`)
      .then(() => wrapResponse<void>(undefined))
      .catch(wrapError)
  },

  getSupportTypes(id: number): Promise<ApiResponse<SupportTypeDto[]>> {
    return apiClient.get(`/Departments/${id}/supporttypes`)
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },
}
```

#### `src/api/services/scoreService.ts`

```typescript
import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@types/ApiResponse'
import type { ApiResponse } from '@types/ApiResponse'
import type { UserScoreDto } from '@types/dtos'
import type { RateTicketRequest } from '@types/requests'

export const scoreService = {

  getUserScore(userId: string): Promise<ApiResponse<UserScoreDto>> {
    return apiClient.get(`/Score/${userId}`)
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  /**
   * Solo el solicitante original puede calificar, y solo una vez.
   * El ticket debe estar en estado "Closed".
   * El raterUserId lo extrae el backend del JWT.
   */
  rateTicket(ticketId: number, body: RateTicketRequest): Promise<ApiResponse<void>> {
    return apiClient.post(`/Tickets/${ticketId}/rate`, body)
      .then(() => wrapResponse<void>(undefined))
      .catch(wrapError)
  },
}
```

#### `src/api/services/slaConfigurationService.ts`

```typescript
import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@types/ApiResponse'
import type { ApiResponse } from '@types/ApiResponse'
import type { SlaConfigurationDto } from '@types/dtos'
import type { UpdateSlaConfigurationRequest } from '@types/requests'
import type { TicketPriority } from '@types/enums'

export const slaConfigurationService = {

  getAll(): Promise<ApiResponse<SlaConfigurationDto[]>> {
    return apiClient.get('/SlaConfigurations')
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  /**
   * @param priority  "Critical" | "High" | "Medium" | "Low"
   * @param body      hoursLimit debe ser un entero positivo mayor que cero
   */
  update(
    priority: TicketPriority,
    body: UpdateSlaConfigurationRequest
  ): Promise<ApiResponse<SlaConfigurationDto>> {
    return apiClient.put(`/SlaConfigurations/${priority}`, body)
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },
}
```

#### `src/api/services/supportTypeAgentService.ts`

```typescript
import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@types/ApiResponse'
import type { ApiResponse } from '@types/ApiResponse'
import type { SupportTypeAgentDto } from '@types/dtos'
import type { AssignAgentRequest } from '@types/requests'

export const supportTypeAgentService = {

  getActive(supportTypeId: number): Promise<ApiResponse<SupportTypeAgentDto>> {
    return apiClient.get(`/SupportTypeAgents/active/${supportTypeId}`)
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  getHistory(supportTypeId: number): Promise<ApiResponse<SupportTypeAgentDto[]>> {
    return apiClient.get(`/SupportTypeAgents/history/${supportTypeId}`)
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  /**
   * Asigna el usuario autenticado como agente activo.
   * Si ya hay un agente activo, el backend lo reemplaza de forma atómica.
   * No enviar userId en el body — lo extrae el backend del JWT.
   */
  assign(body: AssignAgentRequest): Promise<ApiResponse<SupportTypeAgentDto>> {
    return apiClient.post('/SupportTypeAgents', body)
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  unassign(supportTypeId: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/SupportTypeAgents/${supportTypeId}`)
      .then(() => wrapResponse<void>(undefined))
      .catch(wrapError)
  },
}
```

#### `src/api/services/supportTypeService.ts`

```typescript
import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@types/ApiResponse'
import type { ApiResponse } from '@types/ApiResponse'
import type { SupportTypeDto } from '@types/dtos'
import type { CreateSupportTypeRequest } from '@types/requests'

export const supportTypeService = {

  getAll(): Promise<ApiResponse<SupportTypeDto[]>> {
    return apiClient.get('/SupportTypes')
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  create(body: CreateSupportTypeRequest): Promise<ApiResponse<SupportTypeDto>> {
    return apiClient.post('/SupportTypes', body)
      .then((r) => wrapResponse(r.data, 201))
      .catch(wrapError)
  },

  getById(id: number): Promise<ApiResponse<SupportTypeDto>> {
    return apiClient.get(`/SupportTypes/${id}`)
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/SupportTypes/${id}`)
      .then(() => wrapResponse<void>(undefined))
      .catch(wrapError)
  },
}
```

#### `src/api/services/ticketCommentService.ts`

```typescript
import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@types/ApiResponse'
import type { ApiResponse } from '@types/ApiResponse'
import type { TicketCommentDto } from '@types/dtos'
import type { AddCommentRequest } from '@types/requests'

export const ticketCommentService = {

  /**
   * Los comentarios "Internal" solo son visibles para agentes y coordinadores.
   * Los solicitantes solo reciben comentarios "Public".
   */
  getByTicket(ticketId: number): Promise<ApiResponse<TicketCommentDto[]>> {
    return apiClient.get(`/Tickets/${ticketId}/comments`)
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  /**
   * El authorId lo extrae el backend del JWT — no enviarlo.
   * visibility: "Public" | "Internal"
   */
  add(ticketId: number, body: AddCommentRequest): Promise<ApiResponse<TicketCommentDto>> {
    return apiClient.post(`/Tickets/${ticketId}/comments`, body)
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },
}
```

#### `src/api/services/ticketService.ts`

```typescript
import apiClient from '@api/client/apiClient'
import { wrapResponse, wrapError } from '@types/ApiResponse'
import type { ApiResponse } from '@types/ApiResponse'
import type { TicketDto, TicketSummaryDto } from '@types/dtos'
import type {
  CreateTicketRequest,
  UpdateTicketStatusRequest,
  CloseTicketRequest,
  ReopenTicketRequest,
  RedirectTicketRequest,
} from '@types/requests'

export const ticketService = {

  /**
   * Los agentes solo ven sus tickets asignados.
   * Los administradores ven todos.
   */
  getAll(): Promise<ApiResponse<TicketSummaryDto[]>> {
    return apiClient.get('/Tickets')
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  /**
   * El backend asigna automáticamente: TicketNumber, Deadline (según SLA)
   * y AssignedAgent (agente activo del tipo de soporte).
   * El campo createdBy lo extrae el backend del JWT.
   */
  create(body: CreateTicketRequest): Promise<ApiResponse<TicketDto>> {
    return apiClient.post('/Tickets', body)
      .then((r) => wrapResponse(r.data, 201))
      .catch(wrapError)
  },

  getById(id: number): Promise<ApiResponse<TicketDto>> {
    return apiClient.get(`/Tickets/${id}`)
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  /** Soft delete — no elimina de la BD */
  delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete(`/Tickets/${id}`)
      .then(() => wrapResponse<void>(undefined))
      .catch(wrapError)
  },

  updateStatus(id: number, body: UpdateTicketStatusRequest): Promise<ApiResponse<TicketDto>> {
    return apiClient.put(`/Tickets/${id}/status`, body)
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  close(id: number, body: CloseTicketRequest): Promise<ApiResponse<TicketDto>> {
    return apiClient.put(`/Tickets/${id}/close`, body)
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  /**
   * Solo funciona dentro del período de gracia tras el cierre.
   * Retorna 400 si el período expiró.
   */
  reopen(id: number, body: ReopenTicketRequest): Promise<ApiResponse<TicketDto>> {
    return apiClient.put(`/Tickets/${id}/reopen`, body)
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  redirect(id: number, body: RedirectTicketRequest): Promise<ApiResponse<TicketDto>> {
    return apiClient.put(`/Tickets/${id}/redirect`, body)
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },

  /** Verificar con el backend el nombre exacto del campo en el FormData */
  uploadAttachment(ticketId: number, file: File): Promise<ApiResponse<unknown>> {
    const form = new FormData()
    form.append('file', file)
    return apiClient.post(`/Tickets/${ticketId}/attachments`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => wrapResponse(r.data))
      .catch(wrapError)
  },
}
```

#### `src/api/services/index.ts`

```typescript
export { dashboardService } from './dashboardService'
export { departmentService } from './departmentService'
export { scoreService } from './scoreService'
export { slaConfigurationService } from './slaConfigurationService'
export { supportTypeAgentService } from './supportTypeAgentService'
export { supportTypeService } from './supportTypeService'
export { ticketCommentService } from './ticketCommentService'
export { ticketService } from './ticketService'
```

---

### Uso en componentes con React Query

```typescript
// Ejemplo: listado de tickets en un componente
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketService } from '@api/services'
import toast from 'react-hot-toast'

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketService.getAll(),
    select: (res) => res.data ?? [],
  })
}

export function useCloseTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: CloseTicketRequest }) =>
      ticketService.close(id, body),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Ticket cerrado correctamente')
        queryClient.invalidateQueries({ queryKey: ['tickets'] })
      } else {
        toast.error(res.message ?? 'Error al cerrar el ticket')
      }
    },
  })
}
```

---

## 🌐 Enrutamiento

### Estructura de Rutas

| Ruta | Vista | Acceso |
|---|---|---|
| `/` | `HomeView` | Autenticado |
| `/tickets` | `TicketsListView` | Autenticado |
| `/tickets/:id` | `TicketDetailView` | Autenticado |
| `/dashboard` | `DashboardView` | Admin / Coordinador |
| `/admin/departments` | `DepartmentsView` | Admin |
| `/admin/sla` | `SlaConfigView` | Admin |
| `/login` | `LoginView` | Público |
| `*` | Redirect → `/` | — |

### `src/App.tsx`

```typescript
import { Routes, Route, Navigate } from 'react-router'
import { AuthMiddleware } from '@middleware/AuthMiddleware'
import MainLayout from '@views/layouts/MainLayout'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route element={<AuthMiddleware />}>
        <Route element={<MainLayout />}>
          <Route index element={<HomeView />} />
          <Route path="tickets" element={<TicketsListView />} />
          <Route path="tickets/:id" element={<TicketDetailView />} />
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="admin/departments" element={<DepartmentsView />} />
          <Route path="admin/sla" element={<SlaConfigView />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
```

---

## 🎨 Sistema de Temas Material Design 3

```
material-theme.json  →  generate-css-colors.js  →  colors.css  →  Componentes
    (Fuente)               (Generador)              (Variables)     (Consumo)
```

### Variables CSS

```css
/* Modo claro */
--color-primary: #2A638A;
--color-on-primary: #FFFFFF;
--color-secondary: #50606F;
--color-surface: #F7F9FF;

/* Modo oscuro */
--color-dark-primary: #98CCF9;
--color-dark-on-primary: #003350;
--color-dark-secondary: #B8C8D9;
--color-dark-surface: #101417;
```

Regla: **nunca usar colores hardcoded en componentes** — siempre referenciar las variables CSS del tema.

### Ciclo de actualización del tema

1. Reemplazar `material-theme.json` con nuevo tema desde [Material Theme Builder](https://m3.material.io/theme-builder)
2. Ejecutar `yarn theme:generate`
3. Todos los componentes heredan el nuevo tema automáticamente

---

## 🔧 Configuración

### `vite.config.ts` — Path Aliases y Proxy

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/':           resolve(__dirname, './src/'),
      '@components/': resolve(__dirname, './src/components/'),
      '@hooks/':      resolve(__dirname, './src/hooks/'),
      '@theme/':      resolve(__dirname, './src/theme/'),
      '@types/':      resolve(__dirname, './src/types/'),
      '@utils/':      resolve(__dirname, './src/utils/'),
      '@context/':    resolve(__dirname, './src/context/'),
      '@services/':   resolve(__dirname, './src/services/'),
      '@views/':      resolve(__dirname, './src/views/'),
      '@api/':        resolve(__dirname, './src/api/'),
      '@providers/':  resolve(__dirname, './src/providers/'),
      '@middleware/':  resolve(__dirname, './src/middleware/'),
      '@data/':       resolve(__dirname, './src/data/'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5119',   // HelpDesk.API en desarrollo
    },
  },
})
```

### `tsconfig.app.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "jsx": "react-jsx"
  }
}
```

### Variables de Entorno

**`.env`** (base)
```
VITE_API_URL=http://localhost:5119
VITE_APP_NAME=HelpDesk Client
VITE_APP_VERSION=1.0.0
```

**`.env.development`**
```
VITE_APP_API_IDENTITY=...
VITE_APP_CLIENT_ID=...
VITE_APP_CLIENT_SECRET=...
VITE_APP_GRANT_TYPE=password
```

---

## 🔗 Integración con Backend

```
HelpDesk.Client (React)  →  /api/*  →  Vite Proxy  →  HelpDesk.API (ASP.NET Core)
       :5173                                                  :5119
```

### Depende de

- **HelpDesk.API** ← Consume endpoints REST vía proxy `/api`

---

## 📝 Convenciones

### Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `TicketDetailView`, `DatePicker` |
| Hooks | camelCase + prefijo `use` | `useRipple`, `useAuthContext` |
| Servicios | camelCase + sufijo `Service` | `ticketService` |
| DTOs | PascalCase + sufijo `Dto` | `TicketSummaryDto` |
| Enums / Union types | PascalCase | `TicketPriority`, `TicketStatus` |
| Archivos componente | PascalCase | `Button.tsx` |
| Archivos utilidad | camelCase | `jwt.ts`, `image.ts` |

### Estructura de Componentes

```
src/components/ComponentName/
├── ComponentName.tsx          # Componente principal
└── index.ts                   # Barrel export
```

### Importaciones — siempre con path aliases

```typescript
// ✅ Correcto
import { ticketService } from '@api/services'
import { useAuthContext } from '@hooks/useAuthContext'
import type { TicketDto } from '@types/dtos'

// ❌ Incorrecto
import { ticketService } from '../../api/services/ticketService'
```

### Respuestas de API — siempre con `ApiResponse<T>`

```typescript
// ✅ Correcto — verificar success antes de usar data
const res = await ticketService.getById(id)
if (res.success && res.data) {
  setTicket(res.data)
} else {
  toast.error(res.message ?? 'Error desconocido')
}

// ❌ Incorrecto — acceder a data sin verificar
const res = await ticketService.getById(id)
setTicket(res.data!) // puede ser null si hubo error
```

---

## 🚀 Ejecución

### Desarrollo

```bash
cd HelpDesk.Client
yarn dev
```

### Build de Producción

```bash
yarn build       # tsc -b && vite build
```

### Preview de Producción

```bash
yarn preview
```

### Linting

```bash
yarn lint
```

### Generar CSS del Tema

```bash
yarn theme:generate
```

### URLs por defecto

- Aplicación: `http://localhost:5173`
- API (proxy): `http://localhost:5173/api/*` → `http://localhost:5119`

---

## 🧪 Testing Manual

### Comunicación con API

1. Iniciar el backend: `cd HelpDesk.API && dotnet run`
2. Iniciar el frontend: `cd HelpDesk.Client && yarn dev`
3. Acceder a `http://localhost:5173`
4. Verificar que el dashboard carga métricas correctamente

### Verificar Tema

1. Click en el toggle de tema (claro / oscuro / sistema)
2. Verificar que todos los componentes respetan el cambio
3. Verificar persistencia al recargar la página

---

## 💡 Mejores Prácticas

1. **Usar path aliases** — siempre importar con `@components/`, `@hooks/`, etc.
2. **Yarn, no npm** — el proyecto usa Yarn v4 con PnP; no ejecutar `npm install`
3. **Componentes encapsulados** — cada componente en su propio directorio con barrel export
4. **TypeScript estricto** — definir tipos para props, DTOs y respuestas API
5. **Patrón `wrapResponse/wrapError`** — seguirlo en todos los servicios sin excepción
6. **Verificar `ApiResponse.success`** — antes de acceder a `.data` en cualquier respuesta
7. **Ripple effects** — implementar en todos los componentes interactivos
9. **Variables CSS del tema** — no usar colores hardcoded en ningún componente
10. **Responsive mobile-first** — diseñar con grid responsive
11. **Context para estado global** — Context API para estado de app, React Query para datos del servidor
12. **userId nunca en el body** — el backend lo extrae del JWT; no incluirlo en requests

---

## 📌 Notas Importantes

- Requiere que **HelpDesk.API** esté ejecutándose para funcionalidad completa
- Usa **Yarn v4 con PnP** — no es compatible con `npm`
- La autenticación usa **Windows Auth** con JWT y auto-refresh de tokens
- El token se almacena en `sessionStorage['authToken']` como JSON con `{ access_token, refresh_token, expires_in, scope, token_type }`
- El proxy de Vite redirige `/api` a `localhost:5119` solo en **desarrollo**; en producción el servidor debe configurar el reverse proxy
- Los temas se generan desde JSON de [Material Theme Builder](https://m3.material.io/theme-builder)
- Los arrays como query params usan formato repetido (`?ids=1&ids=2`), no corchetes — configurar `paramsSerializer: { indexes: null }` en axios cuando aplique
- No hay framework de testing automatizado configurado — pendiente Vitest + Testing Library

---

## 🚀 Próximos Pasos

1. Configurar framework de testing (Vitest + Testing Library)
2. Implementar Error Boundaries globales
3. Agregar internacionalización (i18n)
4. Configurar PWA (Progressive Web App)
5. Implementar lazy loading de rutas
6. Agregar animaciones de transición entre páginas
7. Configurar CI/CD para builds automáticos
8. Implementar caché offline con Service Workers
9. Agregar accesibilidad (a11y) completa en todos los componentes

import { createContext, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import authService from '@services/auth.service'
import type { RouteProp, RouteContextType, RouteProviderProps } from '@t/route'

const RouteContext = createContext<RouteContextType | null>(null)
RouteContext.displayName = 'RouteContext'

export const RouteProvider: React.FC<RouteProviderProps> = ({ children }) => {
  const [routes, setRoutes] = useState<RouteProp[] | undefined>(undefined)

  const tokenRaw = sessionStorage.getItem('authToken')
  let userId: string | undefined
  let isAuthenticated = false

  if (tokenRaw) {
    try {
      const { access_token } = JSON.parse(tokenRaw) as { access_token: string }
      const payload = JSON.parse(atob(access_token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/') ?? '')) as { sub?: string }
      userId = payload.sub
      isAuthenticated = true
    } catch {
      // invalid token
    }
  }

  const { data } = useQuery({
    queryKey: ['routes', isAuthenticated, userId],
    queryFn: () => {
      if (isAuthenticated && userId) return authService.getPrivateRoutes(userId)
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

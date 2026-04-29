import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import type { AuthContextType, AuthProviderProps, User } from '@t/auth'
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

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ['windowsAuth'],
    queryFn: () => authService.getWindowsAuthAuthentication(),
    refetchInterval: 1800000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoading) return

      if (isError) {
        removeTokenFromStorage()
        setIsAuthenticated(false)
        setUser(null)
        navigate('/login')
        return
      }

      let tokenRaw = sessionStorage.getItem('authToken')
      const isRefreshing = sessionStorage.getItem('tokenRefreshing')

      if (isRefreshing === 'true') {
        for (let i = 0; i < 20; i++) {
          await new Promise<void>((res) => setTimeout(res, 400))
          if (sessionStorage.getItem('tokenRefreshing') !== 'true') break
        }
        tokenRaw = sessionStorage.getItem('authToken')
      }

      if (tokenRaw && !isTokenValid(tokenRaw)) {
        try {
          const { access_token, refresh_token } = JSON.parse(tokenRaw) as { access_token: string; refresh_token: string }
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
        } catch {
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
    if (!token) return
    setTokenInStorage(token)
    const userFromToken = getUserFromToken(token)
    setIsAuthenticated(true)
    setUser(userFromToken)
    navigate('/')
  }

  const logout = async (): Promise<void> => {
    try {
      await authService.logout()
    } catch {
      // ignore
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

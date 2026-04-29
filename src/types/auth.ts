export interface User {
  sub: string
  username: string
  name: string
  role: string
  dept?: string
  exp: number
  iat: number
}

export interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (token: string) => void
  logout: () => Promise<void>
}

export interface AuthProviderProps {
  children: React.ReactNode
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  scope: string
  token_type: string
}

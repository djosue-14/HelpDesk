import { jwtDecode } from 'jwt-decode'
import type { User } from '@t/auth'

interface StoredToken {
  access_token: string
  refresh_token: string
  expires_in: number
  scope: string
  token_type: string
}

export function isTokenValid(raw: string): boolean {
  try {
    const { access_token } = JSON.parse(raw) as StoredToken
    const decoded = jwtDecode<{ exp: number }>(access_token)
    return decoded.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function getUserFromToken(raw: string): User | null {
  try {
    const { access_token } = JSON.parse(raw) as StoredToken
    return jwtDecode<User>(access_token)
  } catch {
    return null
  }
}

export function setTokenInStorage(raw: string): void {
  sessionStorage.setItem('authToken', raw)
}

export function removeTokenFromStorage(): void {
  sessionStorage.removeItem('authToken')
  sessionStorage.removeItem('tokenRefreshing')
}

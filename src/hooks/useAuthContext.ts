import { useContext } from 'react'
import AuthContext from '@context/AuthContext'
import type { AuthContextType } from '@t/auth'

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider')
  return context
}

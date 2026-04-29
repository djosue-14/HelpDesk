import { useContext } from 'react'
import { RouteContext } from '@context/RouteContext'
import type { RouteContextType } from '@t/route'

export const useRouteContext = (): RouteContextType => {
  const context = useContext(RouteContext)
  if (!context) throw new Error('useRouteContext must be used within a RouteProvider')
  return context
}

export interface RouteProp {
  path: string
  label: string
  icon: string
  section?: string
  badge?: number
}

export interface RouteContextType {
  routes: RouteProp[] | undefined
  setRoutes: React.Dispatch<React.SetStateAction<RouteProp[] | undefined>>
}

export interface RouteProviderProps {
  children: React.ReactNode
}

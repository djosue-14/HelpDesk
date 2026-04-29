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

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('theme-transition')
    root.classList.remove('dark', 'light')
    root.classList.add(resolvedTheme)
    const timer = setTimeout(() => root.classList.remove('theme-transition'), 300)
    return () => clearTimeout(timer)
  }, [resolvedTheme, mode])

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

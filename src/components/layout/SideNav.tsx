import { useNavigate, useLocation } from 'react-router'
import Icon from '@/components/shared/Icon'
import { useRouteContext } from '@hooks/useRouteContext'
import { useTheme } from '@hooks/useTheme'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'
import type { RouteProp } from '@t/route'

export default function SideNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { routes } = useRouteContext()
  const { mode, setMode } = useTheme()

  const menuItems = (routes ?? []).filter((r): r is RouteProp & { section: string } => !!r.section)

  const sectionOrder = menuItems
    .map(r => r.section)
    .filter((s, i, arr) => arr.indexOf(s) === i)

  const groups = sectionOrder.reduce<Record<string, RouteProp[]>>((acc, section) => {
    acc[section] = menuItems.filter(r => r.section === section)
    return acc
  }, {})

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname === path || pathname.startsWith(path + '/')
  }

  return (
    <nav className="flex-none w-72 h-full z-40 border-r border-slate-200/60 dark:border-dark-outline-variant bg-white dark:bg-dark-surface-container shadow-[4px_0_12px_rgba(42,99,138,0.05)] flex flex-col overflow-y-auto">
      {/* Brand */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-md shrink-0">
            <Icon name="support_agent" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-primary leading-tight">HelpDesk</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-dark-on-surface-variant font-bold">Enterprise Suite</p>
          </div>
        </div>

        {/* Nav groups */}
        <div className="space-y-5">
          {sectionOrder.map(section => (
            <div key={section}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-dark-on-surface-variant px-3 mb-1">
                {section}
              </p>
              <div className="space-y-0.5">
                {groups[section].map(route => {
                  const active = isActive(route.path)
                  return (
                    <button
                      key={route.path}
                      onClick={() => navigate(route.path)}
                      className={[
                        'w-full rounded-lg px-3 py-2.5 flex items-center gap-3 text-sm transition-colors',
                        active
                          ? 'bg-primary/10 dark:bg-dark-primary/10 text-primary dark:text-dark-primary font-semibold'
                          : 'text-slate-600 dark:text-dark-on-surface hover:bg-slate-50 dark:hover:bg-dark-surface-container-high font-medium',
                      ].join(' ')}
                    >
                      <Icon name={route.icon} size={20} />
                      <span className="flex-1 text-left">{route.label}</span>
                      {route.badge != null && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                          active ? 'bg-primary dark:bg-dark-primary text-white dark:text-dark-on-primary' : 'bg-slate-200 dark:bg-dark-surface-container-high text-slate-600 dark:text-dark-on-surface-variant'
                        }`}>
                          {route.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-4 pb-4 pt-3 border-t border-slate-100 dark:border-dark-outline-variant space-y-2">
        <ThemeToggle theme={mode} onThemeChange={setMode} />
        <UserMenu />
      </div>
    </nav>
  )
}

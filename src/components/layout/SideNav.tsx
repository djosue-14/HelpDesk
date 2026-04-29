import { useNavigate, useLocation } from 'react-router'
import Icon from '@/components/shared/Icon'
import type { Role } from '@/data/types'

interface NavItem {
  id: string
  icon: string
  label: string
  count?: number
}

interface NavGroup {
  section: string
  items: NavItem[]
}

const NAV_BY_ROLE: Record<string, NavGroup[]> = {
  requester: [
    { section: 'Trabajo', items: [
      { id: 'home',    icon: 'dashboard',           label: 'Mi panel'    },
      { id: 'tickets', icon: 'confirmation_number', label: 'Mis tickets', count: 4 },
      { id: 'create',  icon: 'add_circle',          label: 'Nuevo ticket' },
    ]},
    { section: 'Reputación', items: [
      { id: 'score', icon: 'workspace_premium', label: 'Mis puntos' },
    ]},
  ],
  agent: [
    { section: 'Bandeja', items: [
      { id: 'home',   icon: 'dashboard', label: 'Panel'          },
      { id: 'tickets',icon: 'inbox',     label: 'Asignados a mí', count: 7  },
      { id: 'queue',  icon: 'list_alt',  label: 'Cola del depto.', count: 12 },
    ]},
    { section: 'Mi desempeño', items: [
      { id: 'leaderboard', icon: 'leaderboard', label: 'Ranking'      },
      { id: 'metrics',     icon: 'monitoring',  label: 'Mis métricas' },
    ]},
  ],
  coordinator: [
    { section: 'Operación', items: [
      { id: 'home',    icon: 'dashboard',  label: 'Panel'            },
      { id: 'tickets', icon: 'inbox',      label: 'Todos los tickets', count: 49 },
      { id: 'metrics', icon: 'monitoring', label: 'Métricas'         },
      { id: 'heatmap', icon: 'grid_on',    label: 'Mapa de calor'    },
    ]},
    { section: 'Equipo', items: [
      { id: 'agents',      icon: 'support_agent', label: 'Rendimiento' },
      { id: 'leaderboard', icon: 'leaderboard',   label: 'Ranking'     },
    ]},
  ],
  admin: [
    { section: 'Operación', items: [
      { id: 'home',    icon: 'dashboard',  label: 'Panel'              },
      { id: 'tickets', icon: 'inbox',      label: 'Todos los tickets', count: 301 },
      { id: 'metrics', icon: 'monitoring', label: 'Métricas'           },
      { id: 'heatmap', icon: 'grid_on',    label: 'Mapa de calor'      },
    ]},
    { section: 'Catálogos', items: [
      { id: 'departments', icon: 'corporate_fare', label: 'Departamentos'    },
      { id: 'types',       icon: 'category',       label: 'Tipos de soporte' },
      { id: 'assignments', icon: 'group',           label: 'Asignaciones'     },
      { id: 'sla',         icon: 'timer',           label: 'Configuración SLA'},
    ]},
  ],
}

const NAV_TO_PATH: Record<string, string> = {
  home:        '/',
  tickets:     '/tickets',
  queue:       '/queue',
  score:       '/score',
  leaderboard: '/leaderboard',
  metrics:     '/metrics',
  heatmap:     '/heatmap',
  agents:      '/agents',
  departments: '/admin/departments',
  types:       '/admin/types',
  assignments: '/admin/assignments',
  sla:         '/admin/sla',
}

const PATH_TO_NAV: Record<string, string> = Object.fromEntries(
  Object.entries(NAV_TO_PATH).map(([k, v]) => [v, k])
)

interface SideNavProps {
  role: Role
  onCreateTicket: () => void
}

export default function SideNav({ role, onCreateTicket }: SideNavProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const groups = NAV_BY_ROLE[role.id] ?? []

  const activeId = PATH_TO_NAV[pathname] ?? (pathname.startsWith('/tickets/') ? 'tickets' : 'home')

  const handleClick = (id: string) => {
    if (id === 'create') { onCreateTicket(); return }
    const path = NAV_TO_PATH[id]
    if (path) navigate(path)
  }

  return (
    <nav className="flex-none w-72 h-full z-40 border-r border-slate-200/60 bg-white shadow-[4px_0_12px_rgba(42,99,138,0.05)] flex flex-col overflow-y-auto">
      {/* Brand */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-md shrink-0">
            <Icon name="support_agent" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-primary leading-tight">HelpDesk</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Enterprise Suite</p>
          </div>
        </div>

        {/* Nav groups */}
        <div className="space-y-5">
          {groups.map((g, gi) => (
            <div key={gi}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 mb-1">{g.section}</p>
              <div className="space-y-0.5">
                {g.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleClick(item.id)}
                    className={[
                      'w-full rounded-lg px-3 py-2.5 flex items-center gap-3 text-sm transition-colors',
                      activeId === item.id
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 font-medium',
                    ].join(' ')}
                  >
                    <Icon name={item.icon} size={20} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.count != null && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                        activeId === item.id ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-6 pb-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl bg-surface-container-low border border-slate-100">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0"
            style={{ background: 'var(--color-primary)' }}
          >
            {role.user.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-on-surface truncate">{role.user.name}</p>
            <p className="text-xs text-slate-500 capitalize">{role.name}</p>
          </div>
        </div>
      </div>
    </nav>
  )
}

export type { NavGroup }

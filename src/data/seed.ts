import type {
  Department, SupportType, Priority, Status, Person, Role,
  Ticket, ThreadEntry, HistoryEntry, UserScore, LeaderboardEntry,
  Metrics, HeatmapData, Notification,
} from './types'

export const HD_DEPARTMENTS: Department[] = [
  { id: 'D01', name: 'Tecnología',         icon: 'memory',                   color: '#6750A4' },
  { id: 'D02', name: 'Recursos Humanos',   icon: 'groups',                   color: '#388E3C' },
  { id: 'D03', name: 'Finanzas',           icon: 'savings',                  color: '#1976D2' },
  { id: 'D04', name: 'Operaciones',        icon: 'precision_manufacturing',   color: '#E65100' },
  { id: 'D05', name: 'Comercial',          icon: 'storefront',               color: '#C62828' },
  { id: 'D06', name: 'Servicios Generales',icon: 'cleaning_services',        color: '#00838F' },
]

export const HD_SUPPORT_TYPES: Record<string, SupportType[]> = {
  D01: [
    { id: 'T0101', name: 'Soporte de hardware',  defaultPriority: 'high',     defaultSlaHours: 8  },
    { id: 'T0102', name: 'Soporte de software',  defaultPriority: 'medium',   defaultSlaHours: 24 },
    { id: 'T0103', name: 'Acceso y permisos',    defaultPriority: 'medium',   defaultSlaHours: 16 },
    { id: 'T0104', name: 'Conectividad / red',   defaultPriority: 'critical', defaultSlaHours: 4  },
    { id: 'T0105', name: 'Solicitud de equipo',  defaultPriority: 'low',      defaultSlaHours: 72 },
  ],
  D02: [
    { id: 'T0201', name: 'Recibo de nómina',           defaultPriority: 'medium', defaultSlaHours: 16 },
    { id: 'T0202', name: 'Permisos y vacaciones',      defaultPriority: 'low',    defaultSlaHours: 48 },
    { id: 'T0203', name: 'Constancias y certificados', defaultPriority: 'low',    defaultSlaHours: 72 },
    { id: 'T0204', name: 'Capacitación',               defaultPriority: 'low',    defaultSlaHours: 72 },
  ],
  D03: [
    { id: 'T0301', name: 'Reembolsos',           defaultPriority: 'medium', defaultSlaHours: 24 },
    { id: 'T0302', name: 'Pago a proveedores',   defaultPriority: 'high',   defaultSlaHours: 16 },
    { id: 'T0303', name: 'Anticipos y viáticos', defaultPriority: 'medium', defaultSlaHours: 24 },
  ],
  D04: [
    { id: 'T0401', name: 'Mantenimiento de planta', defaultPriority: 'high',     defaultSlaHours: 8  },
    { id: 'T0402', name: 'Falla de línea',          defaultPriority: 'critical', defaultSlaHours: 2  },
    { id: 'T0403', name: 'Insumos y consumibles',   defaultPriority: 'low',      defaultSlaHours: 72 },
  ],
  D05: [
    { id: 'T0501', name: 'Cotización a cliente', defaultPriority: 'medium', defaultSlaHours: 16 },
    { id: 'T0502', name: 'Postventa',            defaultPriority: 'high',   defaultSlaHours: 8  },
  ],
  D06: [
    { id: 'T0601', name: 'Limpieza y aseo',          defaultPriority: 'low',    defaultSlaHours: 48 },
    { id: 'T0602', name: 'Mantenimiento de oficina', defaultPriority: 'medium', defaultSlaHours: 24 },
    { id: 'T0603', name: 'Vehículos y transporte',   defaultPriority: 'medium', defaultSlaHours: 24 },
  ],
}

export const HD_PRIORITIES: Priority[] = [
  { id: 'critical', name: 'Crítica', sla: '2 h',  className: 'critical' },
  { id: 'high',     name: 'Alta',    sla: '8 h',  className: 'high'     },
  { id: 'medium',   name: 'Media',   sla: '24 h', className: 'medium'   },
  { id: 'low',      name: 'Baja',    sla: '72 h', className: 'low'      },
]

export const HD_STATUSES: Status[] = [
  { id: 'open',     name: 'Abierto',         icon: 'inbox',           cls: 'open'     },
  { id: 'progress', name: 'En proceso',      icon: 'pending',         cls: 'progress' },
  { id: 'waiting',  name: 'Esperando info.', icon: 'hourglass_empty', cls: 'waiting'  },
  { id: 'closed',   name: 'Cerrado',         icon: 'check_circle',    cls: 'closed'   },
  { id: 'reopened', name: 'Reabierto',       icon: 'restart_alt',     cls: 'reopened' },
]

export const HD_PEOPLE: Record<string, Person> = {
  marina:   { id: 'U001', username: 'marina.galvez',  name: 'Marina Gálvez',  dept: 'D05', role: 'requester',   initials: 'MG' },
  esteban:  { id: 'U002', username: 'esteban.rios',   name: 'Esteban Ríos',   dept: 'D04', role: 'requester',   initials: 'ER' },
  paola:    { id: 'U003', username: 'paola.benitez',  name: 'Paola Benítez',  dept: 'D03', role: 'requester',   initials: 'PB' },
  fernando: { id: 'U004', username: 'fernando.cano',  name: 'Fernando Cano',  dept: 'D02', role: 'requester',   initials: 'FC' },
  alvaro:   { id: 'A001', username: 'alvaro.duarte',  name: 'Álvaro Duarte',  dept: 'D01', role: 'agent',       initials: 'AD' },
  lucia:    { id: 'A002', username: 'lucia.morales',  name: 'Lucía Morales',  dept: 'D01', role: 'agent',       initials: 'LM' },
  diego:    { id: 'A003', username: 'diego.salinas',  name: 'Diego Salinas',  dept: 'D04', role: 'agent',       initials: 'DS' },
  carola:   { id: 'A004', username: 'carola.reyes',   name: 'Carola Reyes',   dept: 'D02', role: 'agent',       initials: 'CR' },
  hector:   { id: 'A005', username: 'hector.medina',  name: 'Héctor Medina',  dept: 'D03', role: 'agent',       initials: 'HM' },
  ana:      { id: 'A006', username: 'ana.solis',      name: 'Ana Solís',      dept: 'D06', role: 'agent',       initials: 'AS' },
  rocio:    { id: 'C001', username: 'rocio.zavala',   name: 'Rocío Zavala',   dept: 'D01', role: 'coordinator', initials: 'RZ' },
  bruno:    { id: 'X001', username: 'bruno.iturra',   name: 'Bruno Iturra',   dept: 'D01', role: 'admin',       initials: 'BI' },
}

export const HD_ROLES: Role[] = [
  { id: 'requester',   name: 'Solicitante',   user: HD_PEOPLE.marina,  icon: 'person'              },
  { id: 'agent',       name: 'Agente',        user: HD_PEOPLE.alvaro,  icon: 'support_agent'       },
  { id: 'coordinator', name: 'Coordinador',   user: HD_PEOPLE.rocio,   icon: 'manage_accounts'     },
  { id: 'admin',       name: 'Administrador', user: HD_PEOPLE.bruno,   icon: 'admin_panel_settings' },
]

export const HD_TICKETS: Ticket[] = [
  {
    id: 'TK-2284', code: '#TK-2284',
    subject: 'Pantalla externa parpadea al conectar al dock',
    description: 'Desde ayer, al conectar mi laptop al dock, la pantalla externa parpadea cada 30–40 segundos. Probé con otro cable HDMI sin éxito. Adjunto fotografía del dock y del modelo de pantalla.',
    deptId: 'D01', typeId: 'T0101', statusId: 'progress', priority: 'high',
    requester: 'marina', assignee: 'alvaro',
    createdAt: 'Hoy · 09:14', updatedAt: 'Hoy · 11:42',
    slaPct: 62, slaRemaining: '3 h 02 min', slaState: 'yellow',
    rating: null,
    attachments: [
      { name: 'foto-dock.jpg',       size: '1,2 MB', type: 'image' },
      { name: 'modelo-pantalla.pdf', size: '380 KB', type: 'pdf'   },
    ],
    unread: 2,
  },
  {
    id: 'TK-2283', code: '#TK-2283',
    subject: 'Red caída en el piso 4 — sala de juntas',
    description: 'Toda la sala de juntas del piso 4 se quedó sin red. Tenemos una demo con cliente en 1 hora.',
    deptId: 'D01', typeId: 'T0104', statusId: 'open', priority: 'critical',
    requester: 'esteban', assignee: 'lucia',
    createdAt: 'Hoy · 10:03', updatedAt: 'Hoy · 10:08',
    slaPct: 88, slaRemaining: '14 min', slaState: 'red',
    rating: null, attachments: [], unread: 3,
  },
  {
    id: 'TK-2282', code: '#TK-2282',
    subject: 'Solicitud de constancia laboral con sello',
    description: 'Necesito constancia laboral con sello para trámite bancario.',
    deptId: 'D02', typeId: 'T0203', statusId: 'progress', priority: 'low',
    requester: 'fernando', assignee: 'carola',
    createdAt: 'Ayer · 14:20', updatedAt: 'Hoy · 09:05',
    slaPct: 41, slaRemaining: '42 h', slaState: 'green',
    rating: null, attachments: [], unread: 0,
  },
  {
    id: 'TK-2281', code: '#TK-2281',
    subject: 'Reembolso de viaje a Querétaro — facturas Sept',
    description: 'Adjunto comprobantes del viaje del 12–14 de septiembre.',
    deptId: 'D03', typeId: 'T0301', statusId: 'waiting', priority: 'medium',
    requester: 'paola', assignee: 'hector',
    createdAt: 'Ayer · 11:00', updatedAt: 'Hoy · 08:30',
    slaPct: 50, slaRemaining: 'pausado', slaState: 'paused',
    rating: null,
    attachments: [{ name: 'facturas-sept.zip', size: '4,8 MB', type: 'archive' }],
    unread: 1,
  },
  {
    id: 'TK-2280', code: '#TK-2280',
    subject: 'Acceso a carpeta compartida \\\\fileserver\\Comercial',
    description: 'Necesito permiso de lectura/escritura para preparar la propuesta del cliente Andesa.',
    deptId: 'D01', typeId: 'T0103', statusId: 'closed', priority: 'medium',
    requester: 'marina', assignee: 'lucia',
    createdAt: 'Hace 3 días', updatedAt: 'Hace 2 días',
    slaPct: 30, slaRemaining: 'completado', slaState: 'green',
    rating: 5, ratingComment: 'Resuelto el mismo día y con un tutorial muy claro.',
    attachments: [], unread: 0,
  },
  {
    id: 'TK-2279', code: '#TK-2279',
    subject: 'Línea 3 detenida — alarma sensor de temperatura',
    description: 'Sensor de temperatura del cabezal de empacado disparó alarma. Línea detenida.',
    deptId: 'D04', typeId: 'T0402', statusId: 'closed', priority: 'critical',
    requester: 'esteban', assignee: 'diego',
    createdAt: 'Hace 4 días', updatedAt: 'Hace 4 días',
    slaPct: 75, slaRemaining: 'completado', slaState: 'green',
    rating: 4, ratingComment: 'Atención rápida, faltó documentar el cambio del sensor en bitácora.',
    attachments: [], unread: 0,
  },
  {
    id: 'TK-2278', code: '#TK-2278',
    subject: 'Cotización para cliente Andesa — 200 unidades',
    description: 'El cliente solicita cotización por 200 unidades del modelo A-12 con entrega a 30 días.',
    deptId: 'D05', typeId: 'T0501', statusId: 'progress', priority: 'medium',
    requester: 'marina', assignee: 'carola',
    createdAt: 'Hoy · 08:00', updatedAt: 'Hoy · 09:45',
    slaPct: 25, slaRemaining: '12 h', slaState: 'green',
    rating: null, attachments: [], unread: 0,
  },
  {
    id: 'TK-2277', code: '#TK-2277',
    subject: 'Outlook no sincroniza calendario compartido',
    description: 'El calendario compartido del equipo dejó de sincronizar desde el lunes.',
    deptId: 'D01', typeId: 'T0102', statusId: 'reopened', priority: 'medium',
    requester: 'paola', assignee: 'alvaro',
    createdAt: 'Hace 6 días', updatedAt: 'Hoy · 07:50',
    slaPct: 70, slaRemaining: '7 h 10 min', slaState: 'yellow',
    rating: null, attachments: [], unread: 1,
  },
  {
    id: 'TK-2276', code: '#TK-2276',
    subject: 'Reservar sala Atlas para junta directiva',
    description: 'Reservar la sala Atlas el viernes 28 de 10:00 a 13:00.',
    deptId: 'D06', typeId: 'T0602', statusId: 'closed', priority: 'low',
    requester: 'fernando', assignee: 'ana',
    createdAt: 'Hace 5 días', updatedAt: 'Hace 4 días',
    slaPct: 18, slaRemaining: 'completado', slaState: 'green',
    rating: 5, ratingComment: 'Excelente coordinación.',
    attachments: [], unread: 0,
  },
  {
    id: 'TK-2275', code: '#TK-2275',
    subject: 'Solicitud de laptop para nuevo desarrollador',
    description: 'El nuevo desarrollador del equipo de Plataforma ingresa el lunes 24, requiere laptop con 32 GB de RAM.',
    deptId: 'D01', typeId: 'T0105', statusId: 'open', priority: 'low',
    requester: 'fernando', assignee: null,
    createdAt: 'Ayer · 16:40', updatedAt: 'Ayer · 16:40',
    slaPct: 22, slaRemaining: '56 h', slaState: 'green',
    rating: null, attachments: [], unread: 0,
  },
]

export const HD_THREADS: Record<string, ThreadEntry[]> = {
  'TK-2284': [
    { id: 1, kind: 'comment',  author: 'marina',  internal: false, when: 'Hoy · 09:14',
      text: 'Desde ayer, al conectar mi laptop al dock, la pantalla externa parpadea cada 30–40 segundos. Probé con otro cable HDMI sin éxito. Adjunto fotografía del dock y del modelo de pantalla.' },
    { id: 2, kind: 'system',   when: 'Hoy · 09:15',
      text: 'Ticket asignado automáticamente al departamento de Tecnología.' },
    { id: 3, kind: 'system',   when: 'Hoy · 09:22',
      text: 'Álvaro Duarte tomó el ticket.' },
    { id: 4, kind: 'comment',  author: 'alvaro',  internal: false, when: 'Hoy · 09:31',
      text: 'Buenos días Marina, ¿podrías indicarme la marca y modelo de la pantalla externa, y si el parpadeo ocurre también con la pantalla integrada de la laptop? Te agradezco.' },
    { id: 5, kind: 'comment',  author: 'marina',  internal: false, when: 'Hoy · 09:48',
      text: 'Es una Dell U2723QE, sólo parpadea la externa, la integrada está bien. Si desconecto el dock y conecto directo, no parpadea.' },
    { id: 6, kind: 'comment',  author: 'alvaro',  internal: true,  when: 'Hoy · 10:05',
      text: 'Nota interna: el dock parece ser el WD19TBS, ya hubo dos casos similares (TK-2218, TK-2231). Probable firmware desactualizado.' },
    { id: 7, kind: 'comment',  author: 'alvaro',  internal: false, when: 'Hoy · 11:42',
      text: 'Marina, encontré el patrón: el firmware del dock está desactualizado. Voy a pasar a tu lugar a las 14:00 para actualizarlo, toma unos 15 minutos. ¿Te queda bien?' },
  ],
}

export const HD_HISTORY: Record<string, HistoryEntry[]> = {
  'TK-2284': [
    { icon: 'add_circle',  when: 'Hoy · 09:14', text: 'Marina Gálvez creó el ticket con prioridad Alta.' },
    { icon: 'auto_awesome',when: 'Hoy · 09:15', text: 'Asignación automática a Tecnología → Soporte de hardware.' },
    { icon: 'person_pin',  when: 'Hoy · 09:22', text: 'Álvaro Duarte se asignó el ticket.' },
    { icon: 'pending',     when: 'Hoy · 09:23', text: 'Estado cambió de Abierto a En proceso.' },
    { icon: 'attach_file', when: 'Hoy · 09:14', text: 'Se adjuntaron 2 archivos.' },
    { icon: 'lock',        when: 'Hoy · 10:05', text: 'Álvaro Duarte agregó una nota interna.' },
  ],
}

export const HD_SCORE_MARINA: UserScore = {
  username: 'marina.galvez', name: 'Marina Gálvez',
  level: 'Plata', levelKey: 'silver',
  points: 1480,
  nextLevel: 'Oro', toNext: 520, nextThreshold: 2000,
  ticketsCreated: 28, ticketsClosed: 24, avgRatingGiven: 4.6,
  badges: [
    { id: 'b1', name: 'Primer ticket',    icon: 'flag',              earned: true  },
    { id: 'b2', name: '10 calificaciones',icon: 'star',              earned: true  },
    { id: 'b3', name: 'Reportador útil',  icon: 'thumb_up',          earned: true  },
    { id: 'b4', name: '50 tickets',       icon: 'workspace_premium', earned: false },
  ],
}

export const HD_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, user: 'alvaro',  points: 4280, closed: 87, avgRating: 4.8, slaCompliance: 96 },
  { rank: 2, user: 'lucia',   points: 3940, closed: 78, avgRating: 4.7, slaCompliance: 94 },
  { rank: 3, user: 'diego',   points: 3610, closed: 72, avgRating: 4.6, slaCompliance: 91 },
  { rank: 4, user: 'carola',  points: 3120, closed: 64, avgRating: 4.5, slaCompliance: 89 },
  { rank: 5, user: 'hector',  points: 2880, closed: 58, avgRating: 4.4, slaCompliance: 87 },
  { rank: 6, user: 'ana',     points: 2410, closed: 49, avgRating: 4.3, slaCompliance: 85 },
]

export const HD_METRICS: Metrics = {
  volumeWeeks:   ['S-13','S-12','S-11','S-10','S-09','S-08','S-07','S-06','S-05','S-04','S-03','S-02','S-01','S-00'],
  volumeCreated: [82,91,76,88,95,102,88,110,96,118,125,108,132,128],
  volumeClosed:  [78,86,80,84,92,98, 90,105,99,110,119,112,128,121],
  byStatus: [
    { id: 'open',     count: 24,  color: '#3a8ed1' },
    { id: 'progress', count: 41,  color: '#7155b8' },
    { id: 'waiting',  count: 12,  color: '#F0A800' },
    { id: 'closed',   count: 218, color: '#62686d' },
    { id: 'reopened', count: 6,   color: '#BA1A1A' },
  ],
  byPriority: [
    { id: 'critical', count: 8,   color: '#BA1A1A' },
    { id: 'high',     count: 34,  color: '#E89A00' },
    { id: 'medium',   count: 95,  color: '#3a8ed1' },
    { id: 'low',      count: 164, color: '#62686d' },
  ],
}

export const HD_HEATMAP: HeatmapData = {
  rows: HD_DEPARTMENTS.map(d => ({ id: d.id, name: d.name })),
  cols: [
    { id: 'support',  name: 'Soporte'   },
    { id: 'request',  name: 'Solicitud' },
    { id: 'incident', name: 'Incidencia'},
    { id: 'consult',  name: 'Consulta'  },
    { id: 'access',   name: 'Acceso'    },
    { id: 'other',    name: 'Otros'     },
  ],
  values: {
    D01: { support: 38, request: 12, incident: 22, consult: 8,  access: 18, other: 3 },
    D02: { support: 4,  request: 9,  incident: 1,  consult: 14, access: 0,  other: 2 },
    D03: { support: 2,  request: 11, incident: 3,  consult: 9,  access: 0,  other: 1 },
    D04: { support: 26, request: 6,  incident: 19, consult: 2,  access: 0,  other: 4 },
    D05: { support: 5,  request: 8,  incident: 2,  consult: 6,  access: 1,  other: 0 },
    D06: { support: 3,  request: 7,  incident: 0,  consult: 4,  access: 0,  other: 1 },
  },
}

export const HD_NOTIFICATIONS: Notification[] = [
  { id: 1, icon: 'comment',      when: 'hace 5 min', text: 'Álvaro Duarte respondió en TK-2284.'            },
  { id: 2, icon: 'check_circle', when: 'hace 1 h',   text: 'TK-2280 fue cerrado y está listo para calificar.' },
  { id: 3, icon: 'priority_high',when: 'hace 3 h',   text: 'TK-2283 entró en SLA crítico.'                  },
]

// Helpers
export function hdGetPerson(key: string) { return HD_PEOPLE[key] }
export function hdGetPersonByUsername(username: string | null | undefined) {
  if (!username) return null
  return Object.values(HD_PEOPLE).find(p => p.username === username) ?? null
}
export function hdGetDept(id: string) { return HD_DEPARTMENTS.find(d => d.id === id) }
export function hdGetType(deptId: string, typeId: string) {
  return (HD_SUPPORT_TYPES[deptId] ?? []).find(t => t.id === typeId)
}
export function hdGetStatus(id: string) { return HD_STATUSES.find(s => s.id === id) }
export function hdGetPriority(id: string) { return HD_PRIORITIES.find(p => p.id === id) }

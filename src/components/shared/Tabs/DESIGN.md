# Tabs — Especificaciones de diseño y uso

Componente de navegación por pestañas construido con Tailwind CSS, diseñado según la especificación Material Design 3 adaptada al sistema de tokens del proyecto HelpDesk.

---

## Estructura de archivos

```
src/components/shared/Tabs/
├── Tabs.tsx   — Componente principal
├── index.ts   — Exports públicos del módulo
└── DESIGN.md  — Este archivo
```

Importar siempre desde el módulo:
```ts
import { Tabs } from '@components/shared/Tabs'
import type { TabsProps, TabItem } from '@components/shared/Tabs'
```

---

## Variantes

### `primary` (default)
- Altura mínima: 48px (`h-12`)
- Muestra icono (Material Symbol) + label cuando `icon` está definido
- Indicador activo: barra de 3px con esquinas superiores redondeadas
- Uso: navegación principal entre secciones de contenido distintas

### `secondary`
- Altura mínima: 48px (`h-12`)
- Solo muestra label (sin icono)
- Indicador activo: línea de 2px sin redondear
- Uso: sub-navegación o filtros dentro de una sección

---

## API

```ts
interface TabItem {
  id: string               // identificador único del tab
  label: string            // texto visible
  icon?: string            // nombre de Material Symbol (solo primary)
  badge?: string | number  // contador adicional mostrado junto al label
  disabled?: boolean       // tab no interactuable
}

interface TabsProps {
  tabs: TabItem[]
  value: string                    // id del tab activo (controlled)
  onChange: (id: string) => void   // callback al cambiar tab
  variant?: 'primary' | 'secondary'
  className?: string
}
```

---

## Tokens de diseño

| Estado | Clases aplicadas |
|--------|-----------------|
| Activo | `text-primary` + indicador `bg-primary` |
| Inactivo | `text-on-surface-variant` |
| Hover | `hover:text-on-surface hover:bg-surface-container` |
| Disabled | `opacity-40 cursor-not-allowed` |
| Borde del contenedor | `border-b border-outline-variant dark:border-dark-outline-variant` |

---

## Uso en el proyecto

| Vista | Variante | Tabs |
|-------|----------|------|
| `TicketDetailView` | `primary` | Conversación · Historial · Adjuntos |

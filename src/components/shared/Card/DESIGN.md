# Card — Especificaciones de diseño y uso

Componente contenedor de propósito general con tres variantes de elevación según Material Design 3, adaptado al sistema de tokens del proyecto HelpDesk.

---

## Estructura de archivos

```
src/components/shared/Card/
├── Card.tsx   — Componente principal
├── index.ts   — Exports públicos del módulo
└── DESIGN.md  — Este archivo
```

Importar siempre desde el módulo:
```ts
import { Card } from '@components/shared/Card'
import type { CardProps } from '@components/shared/Card'
```

---

## Variantes

### `outlined` (default)
- Fondo: `bg-surface-container-lowest` (blanco puro)
- Borde: `border border-outline-variant`
- Jerarquía: baja — menor énfasis, ideal para listas densas o contenido dentro de otros contenedores
- Hover manual: usar `className="hover:bg-surface-container-low"` si el card es interactivo

### `filled`
- Fondo: `bg-surface-container-highest` (gris medio)
- Sin borde, sin sombra
- Jerarquía: media — separación sutil, ideal para rejillas con muchos cards simultáneos

### `elevated`
- Fondo: `bg-surface-container-lowest` (blanco puro)
- Sombra reposo: `0px 1px 3px 1px rgba(0,0,0,0.15), 0px 1px 2px 0px rgba(0,0,0,0.30)` (M3 Elevation Level 1)
- Sombra hover: `0px 2px 6px 2px rgba(0,0,0,0.15), 0px 1px 2px 0px rgba(0,0,0,0.30)` (M3 Elevation Level 2)
- Jerarquía: alta — máximo énfasis, para elementos destacados en la pantalla

---

## API

```ts
interface CardProps {
  variant?: 'outlined' | 'filled' | 'elevated'  // default: 'outlined'
  children: ReactNode
  className?: string   // overrides adicionales de Tailwind
  style?: CSSProperties
  onClick?: () => void // añade cursor-pointer automáticamente
}
```

---

## Tokens de diseño

| Elemento | Token |
|----------|-------|
| Radio de esquinas | `rounded-xl` (12px) |
| Padding interno | `p-5` (20px) |
| Transición | `transition-all` |
| Fondo outlined/elevated | `bg-surface-container-lowest` / `dark:bg-dark-surface-container` |
| Fondo filled | `bg-surface-container-highest` / `dark:bg-dark-surface-container-high` |
| Borde outlined | `border-outline-variant` / `dark:border-dark-outline-variant` |

---

## Uso en el proyecto

| Vista | Variante | Propósito |
|-------|----------|-----------|
| `TicketDetailView` | outlined | Detalles, SLA, prioridad, historial vacío |
| `DashAgentView` | outlined | Ticket cards con `onClick` y hover manual |
| `DashRequesterView` | outlined | Reputación, guía de puntos, estado vacío |
| `DashCoordView` | outlined | Gráficos de volumen y estado |
| `MetricsView` | outlined | Donuts de distribución y tendencias |
| `HeatmapView` | outlined | Grid de heatmap e insights |
| `SlaConfigView` | outlined | Configuración SLA, reglas, calendario |
| `LeaderboardView` | outlined | Podium cards con gradientes custom vía `className` |

# Chip — Especificaciones de diseño y uso

Componentes compactos para introducir información, realizar selecciones, filtrar contenido o representar estados de manera visual. Basados en la especificación Material Design 3.

---

## Estructura de archivos

```
src/components/shared/Chip/
├── Chip.tsx          — Chip genérico interactivo (filter / assist)
├── StatusChip.tsx    — Badge de estado de ticket (display-only)
├── PriorityChip.tsx  — Badge de prioridad de ticket (display-only)
├── index.ts          — Exports públicos del módulo
└── DESIGN.md         — Este archivo
```

Importar siempre desde el módulo:
```ts
import { Chip, StatusChip, PriorityChip } from '@components/shared/Chip'
import type { ChipProps } from '@components/shared/Chip'
```

---

## Chip (genérico)

Elemento interactivo para filtros y selecciones. Implementa el patrón **Filter Chip** de MD3.

### API

```ts
interface ChipProps {
  children: ReactNode    // label del chip
  selected?: boolean     // estado activo (filter chip)
  leading?: string       // nombre de Material Symbol (icono leading)
  onClick?: () => void   // handler de click
  disabled?: boolean     // deshabilitado
  className?: string     // clases adicionales
}
```

### Anatomía y dimensiones

| Propiedad | Valor |
|-----------|-------|
| Altura | 32px (`h-8`) |
| Padding horizontal | 12px (`px-3`) |
| Gap icono–label | 8px (`gap-2`) |
| Border-radius | 8px (`rounded-lg`) |
| Tamaño icono | 18px |
| Tipografía | Label Large — 14px / 500 |

### Estados

| Estado | Clases |
|--------|--------|
| Unselected (rest) | `bg-surface-container-low border border-outline text-on-surface-variant` |
| Unselected (hover) | `hover:bg-surface-container-high hover:shadow-sm` |
| Selected | `bg-primary-container text-on-primary-container` |
| Focus | `focus-visible:ring-2 focus-visible:ring-primary` |
| Disabled | `opacity-[0.38] cursor-not-allowed` |

### Ejemplo de uso

```tsx
// Grupo de filtros (TicketsListView)
<Chip selected={status === 'all'} onClick={() => setStatus('all')}>
  Todos · {counts.all}
</Chip>
<Chip selected={status === 'Open'} leading="radio_button_unchecked" onClick={() => setStatus('Open')}>
  Abierto · {counts.Open}
</Chip>
```

---

## StatusChip

Badge de display para el estado de un ticket. **No es interactivo.**

```ts
<StatusChip id="Open" />       // → Abierto (azul)
<StatusChip id="InProgress" /> // → En proceso (violeta)
<StatusChip id="Paused" />     // → Esperando info. (ámbar)
<StatusChip id="Closed" />     // → Cerrado (slate)
<StatusChip id="reopened" />   // → Reabierto (rojo)
```

Retorna `null` si `id` es falsy o no está en el catálogo.

---

## PriorityChip

Badge de display para la prioridad de un ticket. **No es interactivo.**

```ts
<PriorityChip id="Critical" /> // → Crítica (rojo)
<PriorityChip id="High" />     // → Alta (naranja)
<PriorityChip id="Medium" />   // → Media (azul)
<PriorityChip id="Low" />      // → Baja (slate)
```

Retorna `null` si `id` es falsy o no está en el catálogo.

---

## Tokens de diseño

| Token | Valor |
|-------|-------|
| `surface-container-low` | Fondo del chip en reposo |
| `surface-container-high` | Fondo hover |
| `primary-container` | Fondo del estado selected |
| `on-primary-container` | Texto en estado selected |
| `outline` | Borde del chip en reposo |
| `on-surface-variant` | Texto del chip en reposo |

---

## Uso en el proyecto

| Vista | Componente | Uso |
|-------|-----------|-----|
| `TicketsListView` | `Chip` | Filtros de estado (barra de tabs) |
| `TicketsListView` | `StatusChip` + `PriorityChip` | Columnas de tabla |
| `TicketDetailView` | `StatusChip` + `PriorityChip` | Header del ticket |
| `DashAgentView` | `PriorityChip` | Card de ticket |
| `DashCoordView` | `StatusChip` + `PriorityChip` | Fila de ticket |
| `DashRequesterView` | `StatusChip` + `PriorityChip` | Fila de ticket |
| `SlaConfigView` | `PriorityChip` | Config de SLA por prioridad |

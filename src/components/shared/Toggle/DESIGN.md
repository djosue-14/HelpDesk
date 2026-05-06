# Toggle — Especificaciones de diseño y uso

Componente switch/toggle construido sobre `@headlessui/react` v2 (`Switch`), diseñado según Material Design 3 Switch con dimensiones y tokens exactos del Enterprise Blue Design System.

---

## Estructura de archivos

```
src/components/shared/Toggle/
├── Toggle.tsx  — Componente principal
├── index.ts    — Exports públicos del módulo
└── DESIGN.md   — Este archivo
```

Importar siempre desde el módulo:
```ts
import { Toggle } from '@components/shared/Toggle'
import type { ToggleProps } from '@components/shared/Toggle'
```

---

## Dependencias

| Paquete | Uso |
|---------|-----|
| `@headlessui/react` v2 | `Switch` — `role="switch"`, teclado (Space), focus management |
| `@components/shared/Icon` | Ícono `check` en la variante `withIcon` |

---

## Anatomía (según spec)

```
┌──────────────────────────────────────┐
│  Track: 52px × 32px  border-radius: 16px   │
│  ┌──────────┐                              │
│  │ Handle   │  ←── 24px Ø (rest)           │
│  │ 24×24px  │      28px Ø (focus)          │
│  └──────────┘                              │
│   left: 4px (off) / 24px (on)             │
└──────────────────────────────────────┘
```

---

## API

```ts
interface ToggleProps {
  checked: boolean
  onChange?: (checked: boolean) => void  // omitir para modo read-only
  disabled?: boolean
  withIcon?: boolean     // muestra checkmark en handle cuando active
  label?: ReactNode      // texto principal junto al switch
  description?: string  // texto secundario debajo del label
  className?: string
}
```

**Sin `onChange`**: el switch se renderiza como `disabled` (read-only visual).
**Sin `label`/`description`**: renderiza solo el track (útil en celdas de tabla).

---

## Tokens de diseño

| Estado | Track | Handle |
|--------|-------|--------|
| **On** rest | `bg-primary-container` (#2A638A) | `bg-white`, `left: 24px`, 24×24px |
| **Off** rest | `bg-surface-variant` + `border-2 border-outline` | `bg-outline`, `left: 4px`, 24×24px |
| **On** focus | igual | 28×28px, `left: 22px` |
| **Off** focus | igual | 28×28px, `left: 2px` |
| Hover (ambos) | igual | `shadow-[0_0_0_10px_rgba(42,99,138,0.08)]` |
| Disabled | `opacity-[0.38] pointer-events-none` | — |

Transición: `200ms cubic-bezier(0.4, 0, 0.2, 1)` en todos los estados.

---

## Variantes de uso

```tsx
// Solo track (en tabla)
<Toggle checked={isEnabled} />

// Interactivo con label
<Toggle checked={val} onChange={setVal} label="Notificaciones" />

// Con label + descripción
<Toggle
  checked={val}
  onChange={setVal}
  label="Escalación automática"
  description="Notifica al coordinador al 80% del SLA."
/>

// Con icono checkmark en handle
<Toggle checked={val} onChange={setVal} withIcon />
```

---

## Uso en el proyecto

| Vista | Tipo | Descripción |
|-------|------|-------------|
| `SlaConfigView` | Interactivo con label + description | Reglas globales (3 toggles) |
| `DepartmentsView` | Read-only en celda de tabla | Columna `Estado` (isEnabled) |

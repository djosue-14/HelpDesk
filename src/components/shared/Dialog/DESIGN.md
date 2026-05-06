# Dialog — Especificaciones de diseño y uso

Componente modal construido sobre `@headlessui/react` v2 (`Dialog`, `DialogPanel`), diseñado según la especificación Material Design 3 adaptada al sistema de tokens del proyecto HelpDesk. Proporciona focus trap, cierre con Escape y cierre al hacer clic fuera del panel.

---

## Estructura de archivos

```
src/components/shared/Dialog/
├── Dialog.tsx  — Componente principal y sub-componentes
├── index.ts    — Exports públicos del módulo
└── DESIGN.md   — Este archivo
```

Importar siempre desde el módulo:
```ts
import { Dialog, DialogHead, DialogBody, DialogFoot, DialogField } from '@components/shared/Dialog'
import type { DialogProps } from '@components/shared/Dialog'
```

---

## Dependencias

| Paquete | Uso |
|---------|-----|
| `@headlessui/react` v2 | `Dialog`, `DialogPanel` — portal, focus trap, Escape, clic fuera |
| `@components/shared/Icon` | Icono en `DialogHead` y botón de cierre |

---

## Sub-componentes

| Componente | Rol |
|-----------|-----|
| `Dialog` | Shell: backdrop + panel centrado. Default export. |
| `DialogHead` | Barra superior: icono, título, botón ✕ |
| `DialogBody` | Área scrollable de contenido (`overflow-y-auto`) |
| `DialogFoot` | Fila de acciones alineada a la derecha |
| `DialogField` | Wrapper de campo de formulario: label + helper text |

---

## API

```ts
// Shell principal
interface DialogProps {
  open?: boolean          // default: true (padre controla el render)
  onClose: () => void     // llamado al pulsar Escape o clic fuera del panel
  wide?: boolean          // false → 480px | true → 720px
  children: ReactNode
}

// DialogHead
{ icon: string; title: string; onClose: () => void }

// DialogBody / DialogFoot
{ children: ReactNode }

// DialogField
{ label: string; required?: boolean; helper?: string; children: ReactNode }
```

---

## Tokens de diseño

| Elemento | Clases |
|----------|--------|
| Panel fondo | `bg-white dark:bg-dark-surface-container` |
| Panel radio | `rounded-[28px]` (28px — MD3 spec) |
| Panel sombra | `shadow-2xl` (Level 3 elevation) |
| Backdrop | `bg-black/40 backdrop-blur-sm` |
| Separador head/foot | `border-slate-100 dark:border-dark-outline-variant` |
| Ancho normal | `w-[480px]` |
| Ancho amplio (`wide`) | `w-[720px]` |
| Altura máxima | `max-h-[90vh]` |

---

## Uso en el proyecto

| Componente | Ancho | Descripción |
|-----------|-------|-------------|
| `CreateTicketDialog` | wide | Formulario de creación de ticket |
| `CloseTicketDialog` | normal | Resolución al cerrar ticket |
| `RedirectDialog` | normal | Reasignación de departamento |
| `RateDialog` | normal | Calificación de atención |
| `ConfirmDialog` | normal | Confirmación genérica reutilizable |

---

## Ejemplo de uso

```tsx
import { Dialog, DialogHead, DialogBody, DialogFoot } from '@components/shared/Dialog'
import Button from '@components/shared/Button'

function MyDialog({ onClose }: { onClose: () => void }) {
  return (
    <Dialog onClose={onClose}>
      <DialogHead icon="warning" title="¿Estás seguro?" onClose={onClose} />
      <DialogBody>
        <p className="text-sm text-on-surface-variant">Esta acción no se puede deshacer.</p>
      </DialogBody>
      <DialogFoot>
        <Button variant="text" onClick={onClose}>Cancelar</Button>
        <Button onClick={onClose}>Confirmar</Button>
      </DialogFoot>
    </Dialog>
  )
}
```

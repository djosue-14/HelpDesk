# Select — Especificaciones de diseño y uso

Componente de selección desplegable construido sobre `@headlessui/react` v2 (`Listbox`), diseñado según la especificación Material Design 3 adaptada al sistema de tokens del proyecto HelpDesk. Reemplaza todos los `<select>` nativos del proyecto.

---

## Estructura de archivos

```
src/components/shared/Select/
├── Select.tsx  — Componente principal
├── index.ts    — Exports públicos del módulo
└── DESIGN.md   — Este archivo
```

Importar siempre desde el módulo:
```ts
import { Select } from '@components/shared/Select'
import type { SelectProps, SelectOption } from '@components/shared/Select'
```

---

## Dependencias

| Paquete | Uso |
|---------|-----|
| `@headlessui/react` v2 | `Listbox`, `ListboxButton`, `ListboxOption`, `ListboxOptions` — accesibilidad ARIA (combobox) y gestión del estado open/close |
| `@components/shared/Icon` | Ícono `arrow_drop_down` (trigger) y `check` (opción seleccionada) |

---

## API — Props

### Variante y tamaño

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Variante visual MD3. Solo aplica a `size='md'`. |
| `size` | `'sm' \| 'md'` | `'md'` | `'md'` = campo de formulario con label flotante. `'sm'` = compacto para filtros y toolbars, sin label. |

### Opciones y valor

| Prop | Tipo | Descripción |
|------|------|-------------|
| `options` | `SelectOption[]` | Array de opciones. Cada opción tiene `value: string \| number`, `label: string`, y `disabled?: boolean`. |
| `value` | `string \| number` | Valor controlado del campo. Comparado contra `option.value` con `String()` para evitar conflictos de tipo. |
| `onChange` | `(value: string \| number) => void` | Callback cuando el usuario selecciona una opción. Recibe el `value` de la opción seleccionada. |
| `placeholder` | `string` | Texto visible cuando no hay valor. En `size='md'` con label, solo visible cuando el campo está abierto y vacío. En `size='sm'`, siempre visible cuando no hay selección. |

### Estado y feedback

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | — | Label flotante. Solo aplica a `size='md'`. En `outlined`: flota sobre el borde. En `filled`: apilado encima del valor. |
| `required` | `boolean` | `false` | Agrega asterisco `*` rojo junto al label. Solo visual, no agrega validación nativa. |
| `disabled` | `boolean` | `false` | Aplica `opacity-40` y `cursor-not-allowed`. El campo no acepta interacción. |
| `error` | `boolean` | `false` | Activa estado de error: borde rojo, label rojo, ícono arrow en rojo. |
| `helperText` | `string` | — | Texto pequeño debajo del campo. En estado `error`, incluye ícono de error. |

### Atributos nativos

| Prop | Tipo | Descripción |
|------|------|-------------|
| `name` | `string` | Nombre del campo para formularios nativos (pasado a `Listbox`). |
| `id` | `string` | ID del `ListboxButton`. Vinculado al label flotante vía `htmlFor`. |
| `className` | `string` | Clases CSS aplicadas al wrapper externo `<div>`. Para controlar ancho (`w-72`, `col-span-2`, etc.). |

---

## Diseño visual

### Sistema de diseño

- **Base:** Material Design 3 (MD3) — especificación de Select / Exposed Dropdown Menu
- **Tokens:** Variables CSS del proyecto (`src/theme/colors.css`)
- **Dark mode:** Automático vía remapeo de variables en `.dark`. La única excepción explícita es el fondo del label flotante en outlined: `bg-white dark:bg-surface-container`.

---

### Variante Outlined (`size='md'`)

Borde completo, fondo transparente. Recomendada para formularios en diálogos y cards.

```
Trigger button:
  h-14 rounded border border-outline          — Resting: borde 1px gris
  border-2 border-primary                     — Open: borde 2px azul primario
  border-error / border-2 border-error        — Error: borde rojo en todos los estados
  hover:border-on-surface                     — Hover en resting
```

#### Label flotante en Outlined

El label se comporta igual que en `TextField`:

```
Estado resting (vacío + cerrado):
  posición  → top-1/2 -translate-y-1/2
  tamaño    → text-sm (14px)
  color     → text-on-surface-variant

Estado flotado (con valor O abierto):
  posición  → top-0 -translate-y-1/2   ← corta visualmente el borde superior
  tamaño    → text-xs font-medium (12px)
  color     → text-primary (si abierto) / text-on-surface-variant (con valor, cerrado)
  fondo     → bg-white dark:bg-surface-container + px-1
```

> **Mecanismo:** El label usa posicionamiento absoluto sobre el trigger. La posición se calcula en JSX con `isFloated = open || hasValue`, donde `open` proviene del render prop de `Listbox` y `hasValue` comprueba si `value` no es vacío/null/undefined.

---

### Variante Filled (`size='md'`)

Fondo sólido, solo borde inferior.

```
bg-surface-container rounded-t
border-b border-outline         — Resting
border-b-2 border-primary       — Open
```

Label y valor están apilados dentro del trigger button (label en línea pequeña arriba, valor debajo). No requiere fondo especial para el label.

---

### Tamaño compacto (`size='sm'`)

Para filtros en toolbars, chips de filtro y selectores de paginación. Sin label flotante.

```
h-9 rounded-lg border bg-surface-container-low
border-outline-variant hover:border-outline   — Resting
border-primary                                — Open
border-error                                  — Error
```

El placeholder o valor seleccionado se muestra directamente en el botón.

---

### Dropdown panel (ListboxOptions)

```
bg-white dark:bg-surface-container
rounded-lg shadow-lg border border-outline-variant/20
py-2
w-[var(--button-width)]   ← mismo ancho que el trigger (headlessui lo calcula)
[--anchor-gap:4px]        ← separación del trigger al panel
```

Animación de entrada/salida via headlessui transitions:
```
transition origin-top
data-closed:opacity-0 data-closed:scale-95
data-enter:duration-150 data-enter:ease-out
data-leave:duration-75 data-leave:ease-in
```

---

### Opciones (ListboxOption)

```
h-12 px-3 flex items-center justify-between gap-3
text-sm cursor-pointer select-none

data-focus:bg-surface-container-highest       — Hover/focus
data-selected:bg-secondary-container/30      — Seleccionada (fondo)
data-selected:text-primary                   — Seleccionada (color texto)
data-disabled:opacity-40 data-disabled:cursor-not-allowed
```

La opción seleccionada muestra un ícono `check` (18px, `text-primary`) al final y `font-semibold` en el texto.

---

### Ícono `arrow_drop_down`

```
transition-transform duration-150
open → rotate-180    (flecha apuntando hacia arriba)
closed → rotate-0    (flecha apuntando hacia abajo)
color: text-on-surface-variant (normal) / text-error (estado error)
```

---

## Estados visuales

| Estado | Trigger | Label |
|--------|---------|-------|
| Resting (sin valor) | Borde 1px `outline` | Centrado en el campo, `text-sm`, `text-on-surface-variant` |
| Resting (con valor) | Borde 1px `outline` | Flotado arriba, `text-xs`, `text-on-surface-variant` |
| Open (sin valor) | Borde 2px `primary` | Flotado arriba, `text-xs`, `text-primary` |
| Open (con valor) | Borde 2px `primary` | Flotado arriba, `text-xs`, `text-primary` |
| Error | Borde `error` en todos los estados | `text-error` en todos los estados |
| Disabled | `opacity-40`, `cursor-not-allowed` | Hereda la opacidad |

---

## Accesibilidad

`Listbox` de Headless UI implementa el patrón ARIA `combobox` / `listbox`:
- El trigger button tiene `role="combobox"` y `aria-expanded`.
- `ListboxOptions` tiene `role="listbox"`.
- Cada `ListboxOption` tiene `role="option"` y `aria-selected`.
- Navegación por teclado: `↑`/`↓` para moverse, `Enter`/`Space` para seleccionar, `Escape` para cerrar.
- El campo `disabled` propaga el estado a todos los elementos internos.

---

## Dark mode

Los tokens MD3 se remapean automáticamente en `.dark`. La única clase explícita de dark es:
```
bg-white dark:bg-surface-container
```
Usada en el fondo del label flotante (outlined) para que corte el borde visualmente.

---

## Patrones de uso en el proyecto

### Campo de formulario en diálogo (outlined)

```tsx
<Select
  label="Departamento"
  required
  helperText="A quién va dirigida la solicitud."
  value={deptId ?? ''}
  onChange={(v) => pickDept(Number(v))}
  options={departments.map(d => ({ value: d.departmentId, label: d.name }))}
/>
```

### Filtro compacto en toolbar

```tsx
<Select
  size="sm"
  placeholder="Todas las prioridades"
  value={prioF}
  onChange={(v) => setPrioF(v as TicketPriority | 'all')}
  options={[
    { value: 'all', label: 'Todas las prioridades' },
    ...PRIORITIES.map(p => ({ value: p.id, label: p.name })),
  ]}
/>
```

### Selector de página en paginación

```tsx
<Select
  size="sm"
  value={String(pageSize)}
  onChange={(v) => table.setPageSize(Number(v))}
  options={[5, 10, 15, 20, 25, 50].map(s => ({ value: String(s), label: String(s) }))}
  className="w-20"
/>
```

### Estado de error con helper

```tsx
<Select
  label="Región"
  required
  error
  helperText="Este campo es obligatorio"
  value={region}
  onChange={setRegion}
  options={regions}
/>
```

---

## Cuándo usar cada variante / tamaño

| Escenario | Variante / Tamaño recomendado |
|-----------|-------------------------------|
| Formulario en diálogo (sobre fondo blanco) | `outlined` + `md` |
| Formulario en card (sobre fondo blanco) | `outlined` + `md` |
| Campos sobre fondo de color | `filled` + `md` |
| Filtros en toolbar o barra de chips | `sm` |
| Selector de filas por página en tabla | `sm` |

---

## Consideraciones

### Comparación de valores

El componente compara `value` contra `option.value` usando `String(o.value) === String(value)`. Esto permite pasar IDs numéricos (`deptId: number`) y que la comparación funcione aunque el `Listbox` internamente trate los valores como strings en algunos contextos.

### Ancho del campo

El componente ocupa `w-full` por defecto dentro de su contenedor. Para `size='sm'` en contexts de ancho fijo, usar `className`:

```tsx
<Select size="sm" className="w-20" ... />   // selector de paginación
<Select size="sm" className="w-52" ... />   // filtro con texto largo
```

### El `required` es solo visual

Agrega `*` en el label pero no valida en HTML nativo. La validación debe manejarse externamente con Formik/Yup.

### Opciones con `value: ''` vacío

Evitar `value: ''` en las opciones si se usa `value={campo ?? ''}` como sentinel de "sin selección", ya que colisionaría. Usar un string semántico como `'all'` o `'none'` para la opción vacía.

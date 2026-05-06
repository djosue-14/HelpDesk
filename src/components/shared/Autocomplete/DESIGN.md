# Autocomplete — Especificaciones de diseño y uso

Componente de selección con búsqueda por escritura, construido sobre `@headlessui/react` v2 (`Combobox`). Visualmente idéntico al componente `Select` — mismas variantes, tamaños, tokens y estados — con dos diferencias funcionales: el trigger es un `<input>` que filtra opciones en tiempo real, y un botón `×` limpia tanto la búsqueda como el valor seleccionado.

Usar cuando las opciones son suficientemente numerosas como para que un scroll simple sea agotador (> 8–10 opciones dinámicas). Para listas cortas y estáticas, preferir `Select`.

---

## Estructura de archivos

```
src/components/shared/Autocomplete/
├── Autocomplete.tsx  — Componente principal
├── index.ts          — Exports públicos del módulo
└── DESIGN.md         — Este archivo
```

Importar siempre desde el módulo:
```ts
import { Autocomplete } from '@components/shared/Autocomplete'
import type { AutocompleteProps, AutocompleteOption } from '@components/shared/Autocomplete'
```

---

## Dependencias

| Paquete | Uso |
|---------|-----|
| `@headlessui/react` v2 | `Combobox`, `ComboboxInput`, `ComboboxButton`, `ComboboxOption`, `ComboboxOptions` — patrón ARIA combobox completo |
| `@components/shared/Icon` | `arrow_drop_down` (trigger), `close` (limpiar), `check` (seleccionada), `error` (error helper) |

### Por qué `Combobox` y no `Listbox`

`Listbox` renderiza un `<button>` como trigger — no acepta entrada de texto. `Combobox` renderiza un `<input>`, lo que permite tipear para filtrar opciones en tiempo real. Es el componente correcto de headlessui para el patrón de búsqueda progresiva.

---

## API — Props

Idéntica a `SelectProps` con estas diferencias clave:

| Diferencia | Select | Autocomplete |
|------------|--------|--------------|
| `onChange` type | `(v: string \| number) => void` | `(v: string \| number \| null) => void` — null al limpiar |
| `value` type | `string \| number` | `string \| number \| null` — permite null explícito |
| Trigger | `<button>` (Listbox) | `<input>` (Combobox) |
| Filtrado | — | interno por query, configurable |

### `AutocompleteOption`

```ts
interface AutocompleteOption {
  value: string | number
  label: string
  description?: string   // subtítulo secundario bajo el label en el dropdown
  disabled?: boolean
}
```

### Todas las props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Variante visual MD3. |
| `size` | `'sm' \| 'md'` | `'md'` | `'md'` = con label flotante. `'sm'` = compacto para filtros. |
| `label` | `string` | — | Label flotante (outlined) o estático (filled). Solo `size='md'`. |
| `placeholder` | `string` | — | Texto de ayuda visible cuando el input está enfocado y vacío. |
| `options` | `AutocompleteOption[]` | — | Lista completa de opciones. El componente filtra internamente. |
| `value` | `string \| number \| null` | — | Valor seleccionado controlado. `null` = sin selección. |
| `defaultValue` | `string \| number \| null` | — | Valor inicial no controlado (solo lectura en mount). |
| `onChange` | `(v: string \| number \| null) => void` | — | `null` cuando el usuario limpia con `×`. |
| `onQuery` | `(query: string) => void` | — | Llamado en cada cambio del texto de búsqueda. Útil para búsqueda remota. |
| `displayValue` | `(v: string \| number \| null) => string` | lookup por `value` en `options` | Personaliza el texto mostrado en el input para un valor dado. |
| `filterFunction` | `(options, query) => options` | `includes` case-insensitive sobre `label` y `description` | Reemplaza el filtrado interno. Pasar `() => options` si el filtrado es externo. |
| `required` | `boolean` | `false` | Asterisco `*` visual en el label. |
| `disabled` | `boolean` | `false` | Deshabilita input y oculta el botón `×`. |
| `error` | `boolean` | `false` | Estado de error: bordes rojos, label rojo, ícono en helper. |
| `errorText` | `string` | — | Texto de error. Reemplaza `helperText` cuando `error=true`. |
| `helperText` | `string` | — | Texto pequeño debajo del campo cuando no hay error. |
| `leadingIcon` | `ReactNode` | — | Ícono izquierdo. Ajusta automáticamente el padding del input y la posición del label. |
| `loading` | `boolean` | `false` | Muestra spinner animado; oculta flecha y botón `×`. |
| `clearable` | `boolean` | `true` | Muestra botón `×` cuando hay valor o query. |
| `nullable` | `boolean` | `true` | Permite `null` como valor (habilita el clear). |
| `onClear` | `() => void` | — | Llamado adicionalmente cuando el usuario limpia con `×`. |
| `name` | `string` | — | Atributo name para formularios. |
| `id` | `string` | — | ID del `ComboboxInput`, vinculado al label vía `htmlFor`. |
| `aria-label` | `string` | — | Accesibilidad cuando no hay `label` visible. |
| `className` | `string` | `''` | Clases del wrapper externo. Usar para controlar ancho. |

---

## Comportamiento de búsqueda

1. El usuario enfoca el input. El campo muestra el valor seleccionado (via `displayValue`).
2. Al escribir, el texto reemplaza la visualización y el `query` interno filtra las opciones con `String.includes()` case-insensitive.
3. El dropdown muestra las opciones filtradas. Si no hay coincidencias: `"Sin resultados para "texto""`.
4. Al seleccionar una opción: `onChange(value)` + dropdown se cierra + input muestra el label de la opción + `query` se resetea a `''`.
5. Al hacer clic en `×`: `onChange(null)` + `query = ''` + input queda vacío.

### Reseteo de query

El `query` (texto de búsqueda interno) se resetea automáticamente al:
- Seleccionar una opción
- Clicar el botón `×`

Si el usuario cierra el dropdown sin seleccionar (click fuera o Escape), el `query` persiste. Al reabrir, verá los resultados filtrados del intento anterior. Para ver todas las opciones, puede borrar con `×` o continuar escribiendo.

---

## Diseño visual

### Idéntico a Select en todos los estados

Los estilos son los mismos que `Select.tsx`:

| Elemento | Outlined md | Filled md | sm |
|----------|------------|-----------|-----|
| Contenedor | `h-14 rounded border` | `h-14 rounded-t bg-surface-container border-b` | `h-9 rounded-lg border bg-surface-container-low` |
| Resting | `border-outline` | `border-outline` | `border-outline-variant` |
| Focus | `border-2 border-primary` | `border-b-2 border-primary` | `border-primary` |
| Error | `border-error` | `border-b border-error` | `border-error` |
| Hover | `hover:border-on-surface` | — | `hover:border-outline` |

### Diferencia visual respecto a Select

- El trigger es un `<input>` en lugar de un `<button>`. Al enfocar, el cursor de texto es visible.
- Aparece el texto de búsqueda al escribir (placeholder visible en foco si no hay valor).
- El ícono `arrow_drop_down` es reemplazado por `close` (`×`) en cuanto hay valor o texto tipado.

### Label flotante (outlined md)

Usa exactamente el mecanismo `peer` de `TextField` — el `ComboboxInput` tiene clase `peer` y el label responde a `:focus` y `:not(:placeholder-shown)`:

```
Resting (vacío):  top-1/2 -translate-y-1/2, text-sm, text-on-surface-variant
Flotado (foco o valor): top-0 -translate-y-1/2, text-xs font-medium
  + bg-white dark:bg-surface-container px-1  ← corta el borde
```

El `placeholder` del input se setea a `" "` (espacio) cuando hay `label` — mismo truco que `TextField` — para activar el selector `:not(:placeholder-shown)` en el estado flotado.

### Apertura del dropdown

Al igual que `Select`, el dropdown se abre al hacer click en cualquier parte del campo. Esto se logra con un `ref` (`comboButtonRef`) en el `ComboboxButton` y un `onClick` en el `ComboboxInput` que delega al botón solo cuando el dropdown está cerrado:

```tsx
onClick={() => { if (!open) comboButtonRef.current?.click() }}
```

Sin esto, headlessui solo abriría el dropdown al clickear el ícono de flecha o al comenzar a escribir.

### Botón × y flecha

Comparten exactamente la misma posición (`absolute right-1 top-1/2 -translate-y-1/2`). El botón de flecha se vuelve `invisible` (pero sigue montado para accesibilidad) cuando `showClear` es true, y el botón `×` lo superpone. Esto evita cambios de layout y mantiene `pr-10` fijo en el input.

```
showClear = hasValue || query !== ''
showClear → × visible, flecha invisible
!showClear → flecha visible
disabled → solo flecha (invisible), sin ×
```

---

## Accesibilidad

`Combobox` implementa el patrón ARIA `combobox`:
- `ComboboxInput` tiene `role="combobox"`, `aria-expanded`, `aria-controls` (apuntando a `ComboboxOptions`).
- `ComboboxOptions` tiene `role="listbox"`.
- Cada `ComboboxOption` tiene `role="option"` y `aria-selected`.
- Navegación completa por teclado: `↑`/`↓`, `Enter` para seleccionar, `Escape` para cerrar.
- El botón `×` tiene `tabIndex={-1}` (no recibe foco por tab) y usa `onMouseDown` + `preventDefault` para evitar que el blur del input se dispare antes del clear.
- `ComboboxButton` permanece montado (aunque invisible) para mantener el trigger de teclado funcional.

---

## Dark mode

Mismo comportamiento que `Select` y `TextField`. Solo clase explícita de dark:
```
bg-white dark:bg-surface-container   ← fondo del label flotante en outlined
bg-white dark:bg-surface-container   ← fondo del dropdown panel
```

---

## Cuándo usar Autocomplete vs Select

| Criterio | Select | Autocomplete |
|----------|--------|--------------|
| Opciones fijas y pocas (≤ 8) | ✓ | — |
| Opciones dinámicas de BD, crecimiento esperado | — | ✓ |
| Datos que el usuario puede conocer de memoria | — | ✓ |
| Filtros con categorías muy cortas (Prioridad, SLA) | ✓ | — |
| Departamentos en empresa mediana/grande | — | ✓ |
| Tipos de soporte por departamento (puede crecer) | — | ✓ |

---

## Patrones de uso en el proyecto

### Diálogo: departamento con cascading

```tsx
<Autocomplete
  label="Departamento" required
  placeholder="Buscar departamento…"
  value={deptId}
  onChange={(v) => {
    if (v === null) { setDeptId(null); setTypeId(null) }
    else pickDept(Number(v))
  }}
  options={departments.map(d => ({ value: d.departmentId, label: d.name }))}
/>
```

> El caso `null` debe resetear también el campo dependiente (tipo de soporte).

### Diálogo: tipo dependiente del departamento

```tsx
<Autocomplete
  label="Tipo de soporte" required
  placeholder="Buscar tipo…"
  value={typeId}
  onChange={(v) => setTypeId(v !== null ? Number(v) : null)}
  options={types.map(t => ({ value: t.supportTypeId, label: t.name }))}
/>
```

### Filtro compacto en toolbar

```tsx
<Autocomplete
  size="sm"
  placeholder="Departamento"
  value={deptF === 'all' ? null : deptF}
  onChange={(v) => setDeptF(v !== null ? String(v) : 'all')}
  options={depts.map(d => ({ value: d, label: d }))}
  className="w-52"
/>
```

> Convertir entre el sentinel `'all'` (estado sin filtro) y `null` (Autocomplete vacío) en el `onChange`.

---

## Consideraciones

### Siempre manejar `null` en `onChange`

A diferencia de `Select`, el `onChange` de `Autocomplete` puede recibir `null`. No asumir que siempre es `string | number`:

```tsx
// ❌ Incorrecto
onChange={(v) => setId(Number(v))}          // Number(null) === 0

// ✓ Correcto
onChange={(v) => setId(v !== null ? Number(v) : null)}
```

### Filtrado case-insensitive con `includes`

El filtro es `label.toLowerCase().includes(query.toLowerCase())`. Para listas muy grandes (> 500 opciones), considera implementar filtrado del lado servidor y pasar el `query` al hook de datos.

### Ancho del dropdown

El dropdown usa `absolute z-50 mt-1 w-full` (posicionamiento CSS puro), **no** el prop `anchor` de headlessui. Esto es intencional: `ComboboxOptions` con `anchor` usa floating-UI y la variable `--button-width` referencia `ComboboxButton` (el ícono de flecha), no el input completo — resultando en un dropdown angosto. El wrapper externo es `relative` para establecer el contexto de posicionamiento.

### No mezclar `value` y búsqueda externa

El componente filtra las opciones internamente. Pasar siempre la lista completa en `options`. Si necesitas paginación o búsqueda remota, reemplazar `filteredOptions` por un hook externo y pasar el `query` al servidor.

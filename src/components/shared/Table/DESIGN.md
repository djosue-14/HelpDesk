# Table — Especificaciones de diseño y uso

Componente de tabla reutilizable construido sobre `@tanstack/react-table` v8, diseñado con Material Design 3 adaptado al sistema de tokens del proyecto HelpDesk. Es el reemplazo definitivo de todas las tablas HTML nativas del proyecto.

---

## Estructura de archivos

```
src/components/shared/Table/
├── Table.tsx      — Componente principal + subcomponentes internos
├── index.ts       — Exports públicos del módulo
└── DESIGN.md      — Este archivo
```

Importar siempre desde el módulo:
```ts
import { Table } from '@components/shared/Table'
import type { ColumnDef, RowAction } from '@components/shared/Table'
```

---

## Dependencias

| Paquete | Uso |
|---------|-----|
| `@tanstack/react-table` v8 | Motor headless de tabla (sorting, filtering, pagination, selection) |
| `@headlessui/react` v2 | Menú desplegable de acciones por fila (`Menu`, `MenuItems`) |
| `@components/shared/Icon` | Todos los iconos del componente (usa `material-symbols-outlined`) |

---

## API — Props

### Props requeridas

| Prop | Tipo | Descripción |
|------|------|-------------|
| `data` | `T[]` | Array de datos a mostrar. Se puede pasar pre-filtrado externamente. |
| `columns` | `ColumnDef<T>[]` | Definición de columnas de TanStack Table. Ver sección de columnas. |

### Props de contenido

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | `string` | — | Título mostrado sobre el card. Omitir si la vista ya tiene su propio header. |
| `description` | `string` | — | Descripción debajo del título. |
| `emptyMessage` | `string` | `'No hay datos disponibles'` | Texto del estado vacío. Usar `'Cargando...'` mientras llegan datos. |
| `className` | `string` | `''` | Clases CSS aplicadas al wrapper externo. |

### Props de búsqueda

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `searchable` | `boolean` | `false` | Muestra el input de búsqueda global dentro del card. Solo activar cuando la búsqueda la maneja el componente internamente. Si la vista filtra los datos externamente, NO activar. |
| `searchPlaceholder` | `string` | `'Buscar...'` | Placeholder del input. |
| `searchLabel` | `string` | `'Buscar'` | `aria-label` del input (accesibilidad). |

### Props de acciones por fila

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `showRowActions` | `boolean` | `false` | Activa la columna de acciones con menú `more_vert`. |
| `rowActions` | `RowAction<T>[]` | `[]` | Lista de acciones del menú. Requiere `showRowActions={true}`. |
| `onRowClick` | `(item: T, index: number) => void` | — | Callback al hacer click en una fila. Agrega `cursor-pointer` al hover. |

### Props de selección de filas

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `enableRowSelection` | `boolean` | `false` | Agrega columna de checkboxes al inicio. |
| `rowSelection` | `RowSelectionState` | — | Estado externo de selección (controlado). |
| `onRowSelectionChange` | `updater => void` | — | Setter del estado externo de selección. |
| `onSelectedRowsChange` | `(rows: T[]) => void` | — | Callback simplificado que recibe los items seleccionados (no el estado raw). |

### Props de estado controlado (opcional)

Todos los estados internos (sorting, columnFilters, pagination) tienen un equivalente externo para control desde el padre. Si no se proveen, el componente maneja su propio estado.

| Prop interna | Prop externa | Setter externo |
|---|---|---|
| `internalSorting` | `sorting` | `onSortingChange` |
| `internalColumnFilters` | `columnFilters` | `onColumnFiltersChange` |
| `internalPagination` | `pagination` | `onPaginationChange` |

---

## API — RowAction

```ts
interface RowAction<T> {
  id: string                              // Clave única
  label: string                           // Texto del item
  icon?: string                           // Nombre de icono material-symbols-outlined
  onClick: (item: T, index: number) => void
  disabled?: (item: T) => boolean         // Deshabilita condicionalmente
  hidden?: (item: T) => boolean           // Oculta condicionalmente
  variant?: 'default' | 'destructive'     // 'destructive' usa color error
}
```

---

## Definición de columnas

Se usa `ColumnDef<T>` de `@tanstack/react-table`. Patrones más comunes:

```ts
// Columna simple con accessor
{
  accessorKey: 'name',
  header: 'Nombre',
}

// Columna con renderer custom
{
  accessorKey: 'status',
  header: 'Estado',
  enableSorting: false,
  cell: ({ getValue }) => <StatusChip id={getValue()} />,
}

// Columna derivada (sin accessor directo)
{
  id: 'fullName',
  header: 'Nombre completo',
  cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
}

// Columna de acciones inline (alternativa al rowActions prop)
{
  id: 'actions',
  header: '',
  size: 100,
  enableSorting: false,
  cell: () => <Button variant="text" size="sm" leading="edit">Editar</Button>,
}
```

**Nota sobre acciones:** Para una sola acción por fila (ej. "Editar"), es más limpio definirla como columna inline. El `showRowActions` + `rowActions` es para múltiples acciones agrupadas en un menú desplegable.

---

## Diseño visual

### Sistema de diseño

- **Base:** Material Design 3 (MD3)
- **Tokens:** Variables CSS del proyecto (`src/theme/colors.css`)
- **Dark mode:** Automático. El CSS remapea los tokens en `.dark` — no se usan clases `dark:` dentro del componente para tokens MD3. Solo se usan `dark:` explícitos para colores estáticos externos (ej. `bg-white`).

### Card principal

```
rounded-xl
shadow-[0_4px_12px_rgba(42,99,138,0.05)]
border border-outline-variant/10
bg-surface-container-lowest
overflow-visible    ← crítico: permite que el menú desplegable escape el contenedor
```

El `overflow-visible` es intencional. El menú de acciones (Headless UI) usa `anchor` para posicionarse fuera del DOM flow; si el contenedor tuviera `overflow-hidden`, el menú quedaría recortado.

### Buscador

Ubicado dentro del card como header interno (no sobre él). Ancho fijo de `w-72`. Solo aparece cuando `searchable={true}`.

```
bg-surface-container-low
border border-outline-variant/50
rounded-lg
focus:ring-2 focus:ring-primary focus:border-primary
```

### Encabezados de columna

```
bg-surface-container-low
text-xs font-semibold text-on-surface-variant uppercase tracking-wider
border-b border-outline-variant/20
py-3 px-4 | first:pl-6 last:pr-6
```

Columnas con `enableSorting` (default `true`) muestran icono `unfold_more` / `arrow_upward` / `arrow_downward`. El header completo es clickeable para ordenar.

### Filas

```
divide-y divide-outline-variant/10   ← separador entre filas
transition-colors duration-200
py-4 px-4 | first:pl-6 last:pr-6
```

Estados de fila:
- **Hover:** `hover:bg-surface-container-low` (siempre activo)
- **Clickeable** (`onRowClick`): agrega `cursor-pointer`
- **Seleccionada** (`enableRowSelection`): `bg-secondary-container`

### Paginación

Ubicada en el footer del card, separada por `border-t border-outline-variant/20`. Muestra:
- Rango actual: `{start}–{end} de {total}`
- Selector de filas por página: 5, 10, 15, 20, 25, 50 (default: 10)
- Navegación: primera, anterior, `{page} / {total}`, siguiente, última

### Estado vacío

Icono `inbox` centrado en círculo `bg-surface-container-highest`, texto `text-sm font-medium`. Se muestra cuando `data` es vacío o todos los resultados de búsqueda son vacíos.

### Menú de acciones (RowActionsMenu)

Botón `more_vert` de 32×32 px con `rounded-full`. El menú (Headless UI `MenuItems`) se posiciona inteligentemente:
- **Posición normal:** `bottom end` con `mt-1` (menú abre hacia abajo)
- **Posición invertida:** `top end` con `mb-1` cuando la fila está entre las últimas 3 de la página visible y hay 5+ filas (evita que el menú se corte por el borde inferior)

Variantes de items:
- `default`: `text-on-surface`, hover `bg-surface-container-highest`
- `destructive`: `text-error`, hover `bg-error-container`
- `disabled`: `text-on-surface/38`, `cursor-not-allowed`

---

## Comportamiento de estado

### Estado interno vs controlado

El componente sigue el patrón "uncontrolled by default, controlled when provided". Para cada estado (sorting, pagination, columnFilters, rowSelection):

```
prop externa provista → usa estado externo
prop externa ausente  → usa useState interno
```

Esto permite usar el componente sin configuración extra en la mayoría de casos, y tomar control solo cuando la vista lo requiere (ej. persistir la paginación en URL).

### Búsqueda global vs filtrado externo

| Escenario | Configuración |
|-----------|--------------|
| La tabla filtra sus propios datos | `searchable={true}` — usa `globalFilter` interno de TanStack |
| La vista filtra externamente antes de pasar `data` | `searchable={false}` (default) — pasar ya los datos filtrados |
| Ambos | Técnicamente posible pero no recomendado — genera UX confusa |

En TicketsListView, los filtros (status, prioridad, departamento, SLA) se aplican externamente en un `useMemo` y el resultado filtrado se pasa como `data`. No se usa `searchable`.

### Paginación

Siempre activa (`manualPagination: false`). Opera sobre `data` completo en memoria. Página default: `{ pageIndex: 0, pageSize: 10 }`.

---

## Patrones de uso en el proyecto

### Tabla simple con búsqueda (DepartmentsView, SupportTypesView)

```tsx
<Table<DepartmentDto>
  data={isLoading ? [] : departments}
  columns={columns}
  emptyMessage={isLoading ? 'Cargando...' : 'No hay departamentos'}
  searchable
  searchPlaceholder="Buscar departamento..."
/>
```

### Tabla con datos pre-filtrados externamente (TicketsListView)

```tsx
// tickets ya viene filtrado/ordenado desde un useMemo
<Table<TicketSummaryDto>
  data={tickets}
  columns={columns}
  emptyMessage="Sin resultados. Ajusta los filtros."
  onRowClick={(ticket) => navigate(`/tickets/${ticket.ticketId}`)}
/>
```

### Tabla con acciones en menú desplegable

```tsx
const actions: RowAction<MyType>[] = [
  {
    id: 'edit',
    label: 'Editar',
    icon: 'edit',
    onClick: (item) => openEditDialog(item),
  },
  {
    id: 'delete',
    label: 'Eliminar',
    icon: 'delete',
    variant: 'destructive',
    onClick: (item) => confirmDelete(item),
    hidden: (item) => !item.canDelete,
  },
]

<Table<MyType>
  data={data}
  columns={columns}
  showRowActions
  rowActions={actions}
/>
```

### Tabla con selección múltiple

```tsx
const [selectedRows, setSelectedRows] = useState<MyType[]>([])

<Table<MyType>
  data={data}
  columns={columns}
  enableRowSelection
  onSelectedRowsChange={setSelectedRows}
/>

// selectedRows contiene los items seleccionados como T[]
```

---

## Columnas autogeneradas

El componente agrega automáticamente columnas cuando se activan ciertas features. Estas columnas tienen IDs reservados:

| ID | Feature | Posición | Size |
|----|---------|----------|------|
| `select` | `enableRowSelection={true}` | Primera | 50px |
| `actions` | `showRowActions={true}` + `rowActions.length > 0` | Última | 60px |

No definir columnas con estos IDs en el array `columns` del usuario.

---

## Consideraciones de rendimiento

- `columns` debe estar envuelto en `useMemo` en el padre para evitar re-renders del TanStack table en cada render.
- Si los cell renderers referencian datos externos (ej. `supportTypes` para contar), incluirlos en las dependencias del `useMemo` de columnas.
- Para tablas grandes (>500 filas), considerar activar `manualPagination: true` y manejar la paginación en el servidor.

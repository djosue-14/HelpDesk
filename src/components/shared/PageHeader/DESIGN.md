# PageHeader — Especificaciones de diseño y uso

Componente de encabezado de página que estandariza el patrón `label + h1 + descripción opcional + acciones opcionales` presente en todas las vistas del proyecto.

---

## Estructura de archivos

```
src/components/shared/PageHeader/
├── PageHeader.tsx   — Componente principal
├── index.ts         — Exports públicos del módulo
└── DESIGN.md        — Este archivo
```

Importar siempre desde el módulo:
```ts
import { PageHeader } from '@components/shared/PageHeader'
import type { PageHeaderProps } from '@components/shared/PageHeader'
```

---

## API

```ts
interface PageHeaderProps {
  label: string          // etiqueta superior en uppercase (ej. "Catálogo")
  title: ReactNode       // contenido del h1 — puede ser string o JSX dinámico
  description?: ReactNode // subtítulo opcional bajo el h1
  actions?: ReactNode    // slot derecho — botones, toggle groups, etc.
  className?: string     // clases adicionales en el contenedor raíz
}
```

---

## Anatomía visual

```
┌──────────────────────────────────────────────┬─────────────┐
│  LABEL (uppercase, xs, secondary)            │             │
│  Título de la página (32px, semibold)        │   actions   │
│  Descripción opcional (sm, on-surface-var.)  │             │
└──────────────────────────────────────────────┴─────────────┘
```

---

## Tokens de diseño

| Elemento    | Clases Tailwind                                             |
|-------------|-------------------------------------------------------------|
| Contenedor  | `flex items-start justify-between`                          |
| Label       | `text-xs font-bold uppercase tracking-wider text-secondary mb-1` |
| h1          | `text-[32px] leading-10 font-semibold text-on-surface`      |
| Descripción | `text-sm text-on-surface-variant mt-1`                      |
| Slot derecho| `flex items-center gap-3`                                   |

---

## Ejemplos de uso

### Sin descripción ni acciones
```tsx
<PageHeader label="Configuración" title="SLA y reglas de operación" />
```

### Con descripción y acciones
```tsx
<PageHeader
  label="Análisis"
  title="Mapa de calor — Departamento × Tipo"
  description="Distribución de tickets activos. Pasa el cursor para ver el detalle."
  actions={
    <>
      <Button variant="outlined" leading="calendar_today">Últimos 30 días</Button>
      <Button variant="outlined" leading="download">Exportar</Button>
    </>
  }
/>
```

### Con title dinámico (ReactNode)
```tsx
<PageHeader
  label="Bandeja de agente"
  title={<>Buen día, {name}</>}
  description={`${count} ticket${count === 1 ? '' : 's'} asignado${count === 1 ? '' : 's'}`}
  actions={<Button variant="tonal" leading="leaderboard">Mi ranking</Button>}
/>
```

### Con slot de acciones personalizado (toggle group)
```tsx
<PageHeader
  label="Ranking"
  title={`Top agentes — ${monthLabel}`}
  description="Puntos = tickets cerrados · cumplimiento SLA · calificación promedio."
  actions={<PeriodToggle value={period} onChange={setPeriod} />}
/>
```

---

## Uso en el proyecto

| Vista                | Label                  | Descripción | Acciones      |
|----------------------|------------------------|-------------|---------------|
| `DashAgentView`      | Bandeja de agente      | Sí          | 2 botones     |
| `DashCoordView`      | Vista de coordinación  | Sí          | 3 botones     |
| `DashRequesterView`  | Mi panel               | Sí          | 2 botones     |
| `DepartmentsView`    | Catálogo               | No          | 1 botón       |
| `SlaConfigView`      | Configuración          | No          | 1 botón       |
| `HeatmapView`        | Análisis               | Sí          | 2 botones     |
| `LeaderboardView`    | Ranking                | Sí          | Toggle group  |
| `MetricsView`        | Métricas operativas    | No          | 2 botones     |

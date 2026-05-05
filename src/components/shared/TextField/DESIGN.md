# TextField — Especificaciones de diseño y uso

Componente de campo de texto reutilizable construido sobre `@headlessui/react` v2, diseñado según la especificación Material Design 3 adaptada al sistema de tokens del proyecto HelpDesk. Es el reemplazo definitivo de todos los `<input>` y `<textarea>` de texto libre del proyecto.

---

## Estructura de archivos

```
src/components/shared/TextField/
├── TextField.tsx  — Componente principal
├── index.ts       — Exports públicos del módulo
└── DESIGN.md      — Este archivo
```

Importar siempre desde el módulo:
```ts
import { TextField } from '@components/shared/TextField'
import type { TextFieldProps } from '@components/shared/TextField'
```

---

## Dependencias

| Paquete | Uso |
|---------|-----|
| `@headlessui/react` v2 | `Field`, `Input`, `Textarea`, `Label` — accesibilidad automática (`htmlFor` / `id` vinculados por contexto) |
| `@components/shared/Icon` | Íconos leading y trailing (`material-symbols-outlined`) |

---

## API — Props

### Variante y estructura

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Variante visual MD3. Ver sección de diseño. |
| `label` | `string` | — | Texto del label flotante. Cuando se omite, el campo no tiene label y no se aplica el mecanismo de floating. |
| `multiline` | `boolean` | `false` | Renderiza `<textarea>` en lugar de `<input>`. |
| `rows` | `number` | `3` | Número de filas visibles del textarea. Solo aplica cuando `multiline={true}`. |

### Valor y eventos

| Prop | Tipo | Descripción |
|------|------|-------------|
| `value` | `string` | Valor controlado. Usar junto con `onChange`. |
| `defaultValue` | `string` | Valor inicial no controlado. No usar con `value`. |
| `onChange` | `(e: ChangeEvent<HTMLInputElement \| HTMLTextAreaElement>) => void` | Callback de cambio. Mismo tipo para input y textarea. |
| `onBlur` | `(e: FocusEvent<...>) => void` | Callback de blur. Útil para validaciones con Formik/Yup. |

### Atributos nativos

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `type` | `string` | `'text'` | Tipo del input (`'text'`, `'email'`, `'password'`, `'search'`, `'number'`, etc.). Ignorado en modo `multiline`. |
| `placeholder` | `string` | — | Texto de ayuda visible solo cuando el campo está **en foco y vacío**. No reemplaza al label. |
| `maxLength` | `number` | — | Límite de caracteres nativo del input. Combinar con `helperText` para mostrar conteo. |
| `required` | `boolean` | `false` | Agrega un asterisco `*` en rojo junto al label. No agrega validación HTML nativa. |
| `disabled` | `boolean` | `false` | Aplica `opacity-40` y `cursor-not-allowed`. El componente no acepta foco ni input. |
| `readOnly` | `boolean` | `false` | Campo no editable pero seleccionable. |
| `autoFocus` | `boolean` | `false` | Foco automático al montar. Usar con cuidado en diálogos (puede interrumpir animaciones). |
| `name` | `string` | — | Nombre del campo para formularios nativos. |
| `id` | `string` | — | ID del input. Si se omite, Headless UI genera uno automáticamente para vincular con el Label. |

### Estado y feedback

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `error` | `boolean` | `false` | Activa el estado de error: borde rojo, label rojo, ícono trailing en rojo. |
| `helperText` | `string` | — | Texto pequeño debajo del campo. Usar para conteo de caracteres (`"32/120"`), instrucciones o mensajes de error cuando `error={true}`. |

### Íconos

| Prop | Tipo | Descripción |
|------|------|-------------|
| `leadingIcon` | `string` | Nombre de icono `material-symbols-outlined` posicionado al inicio del campo (ej. `'search'`, `'person'`). Ajusta automáticamente el padding del input y la posición resting del label. |
| `trailingIcon` | `string` | Nombre de icono posicionado al final (ej. `'visibility'`, `'error'`, `'cancel'`). |
| `onTrailingIconClick` | `() => void` | Handler de click del trailing icon. Agrega `cursor-pointer` y hover al icono. Si se omite, el icono es solo decorativo. |

### Otros

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `className` | `string` | `''` | Clases CSS aplicadas al wrapper externo `<div>`. Útil para controlar el ancho (`w-72`, `col-span-2`, etc.) o sobrescribir estilos en contextos especiales. |

---

## Diseño visual

### Sistema de diseño

- **Base:** Material Design 3 (MD3) — especificación de Text Fields
- **Tokens:** Variables CSS del proyecto (`src/theme/colors.css`)
- **Dark mode:** Automático vía remapeo de variables en `.dark`. Los tokens (`text-on-surface-variant`, `border-outline`, `text-primary`, `bg-surface-container`) cambian solos. Solo `bg-white dark:bg-surface-container` en el fondo del label necesita clase explícita de dark.

---

### Variante Outlined

Borde completo, fondo transparente. Recomendada para formularios y diálogos.

```
border border-outline           — Resting: borde 1px gris
focus:border-2 focus:border-primary  — Focus: borde 2px azul primario
border-error / focus:border-error    — Error: borde rojo en todos los estados
rounded                         — Border radius 4px (valor por defecto del sistema)
bg-transparent
```

#### Label flotante en Outlined

El label corta visualmente el borde superior gracias a un fondo que coincide con el del contenedor:

```
Estado resting (campo vacío y sin foco):
  posición  → top-1/2 -translate-y-1/2
  tamaño    → text-base (16px)
  color     → text-on-surface-variant (#42474D light / #C1C7CE dark)

Estado flotado (con foco O con valor):
  posición  → top-0 -translate-y-1/2   ← centrado sobre el borde superior
  tamaño    → text-xs font-medium (12px)
  color     → text-primary en foco / text-on-surface-variant con valor sin foco
  fondo     → bg-white dark:bg-surface-container + px-1  ← corta el borde
```

> **Por qué `bg-white dark:bg-surface-container`:** El label necesita un fondo que coincida exactamente con la superficie que lo contiene. Los diálogos y cards usan `bg-white` (light) y el equivalente de `#1C2024` en dark, que es exactamente lo que produce `bg-surface-container` cuando el sistema remapea las variables en `.dark`.

---

### Variante Filled

Fondo sólido, solo borde inferior. Recomendada para campos sobre fondos blancos o de baja densidad.

```
bg-surface-container            — Fondo gris claro (#EBEEF3 light / #1C2024 dark)
rounded-t                       — Solo esquinas superiores redondeadas
border-b border-outline         — Resting: indicador inferior 1px
focus:border-b-2 focus:border-primary  — Focus: indicador 2px azul
```

#### Label flotante en Filled

No necesita fondo especial porque no hay borde que cortar.

```
Estado resting:  top-1/2 -translate-y-1/2, text-base
Estado flotado:  top-4 translate-y-0 → top-0 -translate-y-1/2, text-xs font-medium
```

---

### Mecanismo del floating label (Tailwind `peer`)

El floating label se implementa puramente con CSS usando la utilidad `peer` de Tailwind, sin JavaScript ni estado React:

1. El `<Input>` / `<Textarea>` tiene la clase `peer`.
2. El `placeholder` del input nativo es **siempre** `" "` (un espacio) cuando no se pasa prop, o el texto de ayuda del usuario cuando sí se pasa. Esto activa el pseudo-selector CSS `:placeholder-shown`.
3. El `<Label>` usa selectores de Tailwind que reaccionan al estado del `peer`:

```
peer-focus:top-0                          ← flota al recibir foco
peer-focus:-translate-y-1/2              ← se centra sobre el borde
peer-focus:text-xs peer-focus:font-medium
peer-[&:not(:placeholder-shown)]:top-0   ← se mantiene flotado cuando tiene valor
peer-[&:not(:placeholder-shown)]:-translate-y-1/2
peer-[&:not(:placeholder-shown)]:text-xs
```

**Comportamiento del placeholder de ayuda:**

```
placeholder:text-transparent                   — oculto por defecto
focus:placeholder:text-on-surface-variant/60   — visible (semitransparente) solo en foco
```

Esto permite que el campo tenga label flotante (posición centrada cuando vacío) Y texto de ayuda visible al enfocar, sin conflicto visual.

---

### Estados visuales

| Estado | Input | Label |
|--------|-------|-------|
| Resting (vacío) | Borde 1px `outline` | Centrado en el campo, `text-base`, `text-on-surface-variant` |
| Resting (con valor) | Borde 1px `outline` | Flotado arriba, `text-xs`, `text-on-surface-variant` |
| Focus (vacío) | Borde 2px `primary` | Flotado arriba, `text-xs`, `text-primary` |
| Focus (con valor) | Borde 2px `primary` | Flotado arriba, `text-xs`, `text-primary` |
| Error | Borde `error` en todos los estados | `text-error` en todos los estados |
| Disabled | `opacity-40`, `cursor-not-allowed` | Hereda la opacidad del Field container |

---

### Íconos leading y trailing

**Leading icon** — afecta el layout del label:

```
Input:  padding-left → pl-12 (en lugar de pl-4)
Label resting:   left-12
Label flotado:   left-4  (transición animada con transition-all)
Icono:  absolute left-3, top-1/2 -translate-y-1/2 (o top-4 en multiline)
```

**Trailing icon:**

```
Posición: absolute right-3, top-1/2 -translate-y-1/2 (o top-4 en multiline)
Color normal: text-on-surface-variant
Color error:  text-error
Clickeable (onTrailingIconClick): cursor-pointer hover:text-on-surface
```

---

### Modo multiline (textarea)

Cuando `multiline={true}`:

- Se renderiza `<Textarea>` de Headless UI con `resize-none`.
- El `Field` wrapper no tiene altura fija (`h-14` solo se aplica al input).
- El label resting empieza en `top-4 translate-y-0` (inicio del área de texto, no en el centro vertical del contenedor completo).
- El padding del textarea tiene `pt-6 pb-2` cuando hay label (espacio para el label flotado) o `py-3.5` cuando no hay label.

---

### Helper text

Texto `text-xs` renderizado bajo el campo (fuera del `Field`), en el mismo `<div>` wrapper:

```
Normal:  text-on-surface-variant, px-1
Error:   text-error, px-1
```

Combinación común para conteo de caracteres:

```tsx
<TextField
  label="Asunto"
  value={subject}
  onChange={e => setSubject(e.target.value)}
  maxLength={120}
  helperText={`${subject.length}/120`}
/>
```

---

## Accesibilidad

Headless UI's `Field` vincula automáticamente `Label` con `Input`/`Textarea` mediante un ID generado en contexto. Esto significa:

- La asociación `<label for="...">` es siempre correcta sin pasar `id` manualmente.
- Los lectores de pantalla anuncian el label al enfocar el input.
- El componente `disabled` en `Field` propaga `data-disabled` a todos los children de Headless UI.

El label tiene `pointer-events-none` para que los clics sobre él pasen al input subyacente, manteniendo el cursor de texto correcto durante la interacción.

---

## Dark mode

Los tokens MD3 del proyecto se remapean automáticamente cuando `<html>` tiene la clase `dark`:

```css
/* src/index.css */
.dark {
  --color-outline:            var(--color-dark-outline);
  --color-primary:            var(--color-dark-primary);
  --color-on-surface-variant: var(--color-dark-on-surface-variant);
  --color-surface-container:  var(--color-dark-surface-container);
  /* ... todos los demás tokens */
}
```

Por este motivo, el componente **no usa prefijos `dark:` para tokens MD3** (ej. `border-outline` funciona solo en ambos modos). La única excepción es el fondo del label flotante en outlined, que usa `bg-white dark:bg-surface-container` porque `bg-white` es un color estático que no forma parte del sistema de tokens.

---

## Patrones de uso en el proyecto

### Campo simple en diálogo

```tsx
<TextField
  label="Asunto"
  required
  placeholder="Resume el problema en una línea"
  value={subject}
  onChange={e => setSubject(e.target.value)}
  maxLength={120}
  helperText={`${subject.length}/120 caracteres`}
/>
```

### Campo multiline (resolución, comentarios)

```tsx
<TextField
  label="Resolución"
  required
  multiline
  rows={4}
  placeholder="Describe cómo se resolvió el problema."
  value={resolution}
  onChange={e => setResolution(e.target.value)}
/>
```

### Campo de búsqueda sin label (en Table)

```tsx
<TextField
  leadingIcon="search"
  placeholder="Buscar..."
  value={globalFilter}
  onChange={e => setGlobalFilter(e.target.value)}
  className="w-72"
/>
```

Cuando no se pasa `label`, el campo no tiene mecanismo de floating: el placeholder se comporta como un placeholder estándar visible cuando el campo está en foco.

### Campo con estado de error

```tsx
<TextField
  label="Email"
  type="email"
  trailingIcon="error"
  error
  value={email}
  onChange={e => setEmail(e.target.value)}
  helperText="Ingresa un email válido"
/>
```

### Campo con contraseña y toggle de visibilidad

```tsx
const [visible, setVisible] = useState(false)

<TextField
  label="Contraseña"
  type={visible ? 'text' : 'password'}
  trailingIcon={visible ? 'visibility_off' : 'visibility'}
  onTrailingIconClick={() => setVisible(v => !v)}
  value={password}
  onChange={e => setPassword(e.target.value)}
/>
```

### Campo de solo lectura (SlaConfigView)

```tsx
<TextField
  label="Resp. inicial"
  defaultValue="8 h"
/>
```

### Compositor de comentarios (dentro de contenedor con borde propio)

Cuando el TextField se coloca dentro de un contenedor que ya provee el borde y el fondo (como el compositor de tickets), se eliminan los bordes propios del campo:

```tsx
<TextField
  multiline
  rows={3}
  placeholder="Escribe una respuesta…"
  value={composer}
  onChange={e => setComposer(e.target.value)}
  className="[&_textarea]:border-none [&_textarea]:bg-transparent [&_textarea]:min-h-[80px]"
/>
```

---

## Cuándo usar cada variante

| Escenario | Variante recomendada |
|-----------|---------------------|
| Formulario en diálogo (sobre fondo blanco) | `outlined` |
| Formulario en card (sobre fondo blanco) | `outlined` |
| Campo de búsqueda en header/toolbar | `outlined` sin label |
| Campo único y prominente (landing, login) | `filled` |
| Campos sobre fondo de color | `filled` |

La variante `outlined` es el estándar del proyecto. La variante `filled` se reserva para contextos donde el campo debe destacar sobre el fondo.

---

## Consideraciones

### No mezclar `value` y `defaultValue`

- `value` + `onChange` → modo controlado (el padre gestiona el estado)
- `defaultValue` → modo no controlado (el DOM gestiona el estado internamente)
- Mezclar ambos genera warnings de React

### El `required` es solo visual

La prop `required` agrega el asterisco rojo en el label pero **no agrega validación HTML nativa** (`required` attribute en el input). La validación debe manejarse externamente con Formik/Yup u otra solución. Esto es intencional para mantener consistencia con el sistema de validación del proyecto.

### Ancho del campo

El componente ocupa `w-full` por defecto dentro de su contenedor. Controlar el ancho desde el padre:

```tsx
{/* En grid */}
<div className="grid grid-cols-2 gap-4">
  <TextField label="Nombre" ... />
  <TextField label="Apellido" ... />
</div>

{/* Ancho fijo */}
<TextField className="w-72" ... />
```

### Transición del label en multiline

En `multiline={true}`, el label resting usa `top-4 translate-y-0` (inicio del área de texto) en lugar de `top-1/2 -translate-y-1/2` (centro del contenedor). Esto evita que el label aparezca en el medio de un textarea alto, pero significa que la transición al flotar incluye un cambio de `translate-y`, lo cual es ligeramente diferente al comportamiento de single-line.

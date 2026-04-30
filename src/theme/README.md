# Material Design 3 Theme System

Este directorio contiene el sistema de temas Material Design 3 para el proyecto.

## Archivos

### `material-theme.json` ⭐
**Archivo activo del tema** - Contiene la configuración actual del tema:
- **Seed colors**: Colores base del tema
- **Light scheme**: Paleta completa para modo claro  
- **Dark scheme**: Paleta completa para modo oscuro
- **Color palettes**: Tonalidades completas para cada color

### `colors.css` 
**Auto-generado** - Contiene las variables CSS derivadas de `material-theme.json`

### `generate-css-colors.js`
Script que convierte automáticamente `material-theme.json` a variables CSS

### `*-old.json`
Archivos de tema anteriores renombrados automáticamente

## 🔄 Flujo de Cambio de Tema

Para cambiar el tema del proyecto:

1. **Pegar nuevo tema**: Sustituir `material-theme.json` con el nuevo archivo
2. **Regenerar CSS**: Ejecutar `yarn run theme:generate` o `yarn theme:generate`
3. **Los componentes heredan automáticamente** el nuevo tema

```bash
# Regenerar colores desde material-theme.json
yarn run theme:generate
```

## 📊 Colores Disponibles

### Colores Principales
- `bg-primary`, `text-on-primary`
- `bg-secondary`, `text-on-secondary` 
- `bg-tertiary`, `text-on-tertiary`
- `bg-error`, `text-on-error`

### Contenedores
- `bg-primary-container`, `text-on-primary-container`
- `bg-secondary-container`, `text-on-secondary-container`
- `bg-tertiary-container`, `text-on-tertiary-container`
- `bg-error-container`, `text-on-error-container`

### Superficies
- `bg-surface`, `bg-surface-variant`
- `bg-surface-container-*` (lowest, low, high, highest)
- `bg-background`

### Modo Oscuro
Todos los colores con prefijo `dark:bg-*` y `dark:text-*`

## 🛠️ Regeneración del Tema

1. Visitar [Material Theme Builder](https://m3.material.io/theme-builder)
2. Configurar colores seed
3. Exportar como JSON
4. Reemplazar `src/theme/material-theme.json`  
5. Ejecutar `yarn run theme:generate`
6. ¡Los componentes se actualizan automáticamente! ✨
// Script to generate CSS colors from material-theme.json
import fs from 'fs';
import path from 'path';

const themePath = path.join(process.cwd(), 'src/theme/material-theme.json');
const cssPath = path.join(process.cwd(), 'src/theme/colors.css');

function generateCSSColors() {
  try {
    const themeData = JSON.parse(fs.readFileSync(themePath, 'utf8'));
    const { light, dark } = themeData.schemes;
    
    let cssContent = `/* Auto-generated from material-theme.json */\n`;
    cssContent += `/* DO NOT EDIT MANUALLY - Run 'node src/theme/generate-css-colors.js' to regenerate */\n\n`;
    
    cssContent += `@theme {\n`;
    cssContent += `  /* Material Design 3 Light Theme */\n`;
    
    // Generate light theme colors
    Object.entries(light).forEach(([key, value]) => {
      const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      cssContent += `  ${cssVarName}: ${value};\n`;
    });
    
    cssContent += `\n  /* Material Design 3 Dark Theme */\n`;
    
    // Generate dark theme colors with dark- prefix
    Object.entries(dark).forEach(([key, value]) => {
      const cssVarName = `--color-dark-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      cssContent += `  ${cssVarName}: ${value};\n`;
    });
    
    cssContent += `}\n`;
    
    fs.writeFileSync(cssPath, cssContent, 'utf8');
    console.log('✅ CSS colors generated successfully!');
    console.log(`📁 Output: ${cssPath}`);
    
  } catch (error) {
    console.error('❌ Error generating CSS colors:', error.message);
    process.exit(1);
  }
}

generateCSSColors();
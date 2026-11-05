# PetMate — Landing page React

Landing desarrollada con React y JavaScript, empaquetada con Vite. El HTML se prerenderiza al iniciar y al compilar, así el contenido y los controles básicos siguen disponibles si JavaScript tarda en cargar.

## Iniciar

```bash
npm install
npm run dev
```

Para generar la versión de publicación: `npm run build`. Vite deja el sitio listo en `dist/`.

## Estructura
- `src/App.jsx`: componentes e interacción de la landing.
- `src/main.jsx`: hidrata el HTML generado.
- `scripts/prerender.mjs`: genera el HTML inicial para evitar una pantalla en blanco durante la carga.
- `assets/css/styles.css`: estilos responsive con la identidad azul y naranja.
- `assets/img/`: logos oficiales y capturas reales de las pantallas de PetMate.
- `ayuda.html` y `legal/`: centro de ayuda y páginas legales estáticas accesibles desde el footer.

## Antes de publicar
Completa los datos oficiales que siguen como marcadores y valida los documentos legales antes de publicar. La disponibilidad de la app y cualquier plan deben confirmarse antes de anunciarlos.

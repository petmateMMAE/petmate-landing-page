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

## SEO y medición

- La compilación agrega canonical, robots, Open Graph y Twitter Cards a cada página HTML. La portada también publica datos estructurados `Organization` y `WebSite`. No cambia el cuerpo ni los estilos.
- `SITE_URL` usa por defecto `https://petmatemx.netlify.app/`. Si cambia el dominio principal, configúralo en el entorno de compilación y vuelve a publicar. `sitemap.xml` y `robots.txt` se generan en `dist/`.
- Las páginas `aviso-privacidad-integral`, `politica-datos`, `politica-pagos` y `politica-eliminacion-cuentas` contienen marcadores `{{...}}`: se publican con `noindex, follow` y se excluyen del sitemap hasta completarlas y revisarlas.
- Para Search Console, el archivo de verificación `googlea24579e2933ecda6.html` se publica en la raíz del sitio. Después de desplegar, comprueba `https://petmatemx.netlify.app/googlea24579e2933ecda6.html` y pulsa **Verificar** en la propiedad de prefijo de URL de Search Console. Comprueba también `https://petmatemx.netlify.app/sitemap.xml` y envía esa URL en **Sitemaps**. Revisa después **Indexación > Páginas** y **Rendimiento > Resultados de búsqueda**. La verificación de dominio mediante DNS es un método distinto; `GOOGLE_SITE_VERIFICATION` queda disponible si Google entrega un token para metaetiqueta.
- Para GA4, configura `GA_MEASUREMENT_ID=G-XXXXXXXXXX` en el entorno de compilación de Netlify y vuelve a publicar. El ID de medición es público por naturaleza; no es una credencial. Sin ID no se carga Analytics.
- El módulo de Analytics espera consentimiento explícito antes de cargar `gtag.js`. Una interfaz de preferencias deberá llamar `window.petmateAnalytics.setConsent(true)` al aceptar o `setConsent(false)` al rechazar o revocar. La landing actual no tiene tal interfaz y agregarla cambiaría el diseño; por eso Analytics permanecerá inactivo para visitantes nuevos hasta que se autorice esa interfaz. La preferencia se guarda en `localStorage` bajo `petmate_analytics_consent`.
- Al activarse, se registra una vista de página por documento y, solo tras consentimiento, los eventos `contact` (`contact_method`: `email` o `phone`) y `app_store_click` (`store`: `google_play`). No se envían direcciones de correo, números, consultas de URL ni datos de formularios. Las páginas son documentos HTML separados; no hay cambios de ruta SPA que seguir.
- Para verificar GA4, usa Tag Assistant y la vista **DebugView** de GA4 con consentimiento concedido, abre la portada y pulsa el enlace de Google Play. Comprueba una vista y un `app_store_click`. Repite sin consentimiento y verifica que no se solicita `gtag.js`. No se ha verificado recepción de datos en una propiedad real porque falta el ID.

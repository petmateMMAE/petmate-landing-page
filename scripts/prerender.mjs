import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../index.html', import.meta.url);
const html = await readFile(file, 'utf8');
const marker = /<!-- app-root:start -->[\s\S]*?<!-- app-root:end -->/;

// The landing can also be authored as static HTML. In that case leave it as-is
// instead of failing the Netlify build or replacing the hand-authored page.
if (!marker.test(html)) {
  console.log('Prerender omitido: index.html no contiene marcadores React; se conserva el HTML estático.');
} else {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToString } = await import('react-dom/server');
  const server = await createServer({
    configFile: './vite.config.js',
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
  });

  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx');
    const markup = renderToString(React.createElement(App)).replace(/<link rel="preload"[^>]*\/>/g, '');
    await writeFile(file, html.replace(marker, `<!-- app-root:start -->${markup}<!-- app-root:end -->`), 'utf8');
  } finally {
    await server.close();
  }
}

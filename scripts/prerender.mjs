import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { readFile, writeFile } from 'node:fs/promises';

const server = await createServer({
  configFile: './vite.config.js',
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const markup = renderToString(React.createElement(App)).replace(/<link rel="preload"[^>]*\/>/g, '');
  const file = new URL('../index.html', import.meta.url);
  let html = await readFile(file, 'utf8');
  const marker = /<!-- app-root:start -->[\s\S]*?<!-- app-root:end -->/;
  if (!marker.test(html)) throw new Error('No se encontró el marcador React en index.html.');
  html = html.replace(marker, `<!-- app-root:start -->${markup}<!-- app-root:end -->`);
  await writeFile(file, html, 'utf8');
} finally {
  await server.close();
}

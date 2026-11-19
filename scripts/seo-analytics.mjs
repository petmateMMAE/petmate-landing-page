const SITE_FALLBACK = 'https://petmatemx.netlify.app/';
const PAGES = [
  '/', '/ayuda.html',
  '/legal/aviso-privacidad-simplificado.html',
  '/legal/aviso-privacidad-integral.html',
  '/legal/terminos-condiciones.html',
  '/legal/politica-datos.html',
  '/legal/politica-cookies.html',
  '/legal/politica-pagos.html',
  '/legal/politica-eliminacion-cuentas.html',
  '/legal/seguridad.html',
];
// These documents still contain {{...}} placeholders and must not be indexed.
const DRAFT_PAGES = new Set([
  '/legal/aviso-privacidad-integral.html',
  '/legal/politica-datos.html',
  '/legal/politica-pagos.html',
  '/legal/politica-eliminacion-cuentas.html',
]);
const escapeHtml = (value) => String(value).replace(/[&"<>]/g, (char) => ({
  '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;',
})[char]);

export function seoAnalytics(env) {
  const site = new URL(env.SITE_URL || SITE_FALLBACK);
  if (site.protocol !== 'https:') throw new Error('SITE_URL debe usar HTTPS');
  const measurementId = env.GA_MEASUREMENT_ID || '';
  if (measurementId && !/^G-[A-Z0-9]+$/.test(measurementId)) {
    throw new Error('GA_MEASUREMENT_ID debe tener formato G-XXXXXXXXXX');
  }
  const base = new URL('/', site);
  return {
    name: 'petmate-seo-analytics',
    transformIndexHtml: {
      order: 'post',
      handler(html, context) {
        const rawPath = context.path.split('?')[0];
        const path = rawPath === '/index.html' ? '/' : rawPath;
        if (!PAGES.includes(path)) return html;
        const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || 'PetMate';
        const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] || '';
        const canonical = new URL(path, base).href;
        const image = new URL('/assets/img/petmate-mark.webp', base).href;
        const robots = DRAFT_PAGES.has(path) ? 'noindex, follow' : 'index, follow';
        const schema = path === '/' ? JSON.stringify({
          '@context': 'https://schema.org', '@graph': [
            { '@type': 'Organization', '@id': `${base.href}#organization`, name: 'PetMate', url: base.href, logo: image },
            { '@type': 'WebSite', '@id': `${base.href}#website`, name: 'PetMate', url: base.href, inLanguage: 'es-MX', publisher: { '@id': `${base.href}#organization` } },
          ],
        }) : '';
        const tags = [
          ...(!/<link\s+rel="icon"/i.test(html) ? ['<link rel="icon" href="/favicon.png" type="image/png" />'] : []),
          `<meta name="robots" content="${robots}" />`,
          `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
          `<meta property="og:type" content="website" />`,
          `<meta property="og:site_name" content="PetMate" />`,
          `<meta property="og:locale" content="es_MX" />`,
          `<meta property="og:title" content="${escapeHtml(title)}" />`,
          `<meta property="og:description" content="${escapeHtml(description)}" />`,
          `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
          `<meta property="og:image" content="${escapeHtml(image)}" />`,
          `<meta name="twitter:card" content="summary" />`,
          `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
          `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
          `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
          ...(env.GOOGLE_SITE_VERIFICATION ? [`<meta name="google-site-verification" content="${escapeHtml(env.GOOGLE_SITE_VERIFICATION)}" />`] : []),
          ...(schema ? [`<script type="application/ld+json">${schema}</script>`] : []),
          ...(measurementId ? [
            `<script>window.PETMATE_GA_ID=${JSON.stringify(measurementId)};</script>`,
            `<script type="module" src="/assets/js/analytics.js"></script>`,
          ] : []),
        ].join('\n    ');
        // Replace only metadata; the body, styling and component markup are untouched.
        return html
          .replace(/\s*<meta property="og:(?:type|title|description|image)"[^>]*\/>/gi, '')
          .replace('</head>', `    ${tags}\n  </head>`);
      },
    },
    generateBundle() {
      const indexed = PAGES.filter((path) => !DRAFT_PAGES.has(path));
      const urls = indexed.map((path) => `  <url><loc>${escapeHtml(new URL(path, base).href)}</loc></url>`).join('\n');
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n` });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', base).href}\n` });
    },
  };
}

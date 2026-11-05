import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        ayuda: resolve(process.cwd(), 'ayuda.html'),
        privacidadSimplificado: resolve(process.cwd(), 'legal/aviso-privacidad-simplificado.html'),
        privacidadIntegral: resolve(process.cwd(), 'legal/aviso-privacidad-integral.html'),
        terminos: resolve(process.cwd(), 'legal/terminos-condiciones.html'),
        datos: resolve(process.cwd(), 'legal/politica-datos.html'),
        cookies: resolve(process.cwd(), 'legal/politica-cookies.html'),
        pagos: resolve(process.cwd(), 'legal/politica-pagos.html'),
        eliminacion: resolve(process.cwd(), 'legal/politica-eliminacion-cuentas.html'),
        seguridad: resolve(process.cwd(), 'legal/seguridad.html'),
      },
    },
  },
});

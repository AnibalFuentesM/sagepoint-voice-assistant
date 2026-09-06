import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => {
    return {
      server: {
        port: process.env.PORT ? Number(process.env.PORT) : 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss(), {
        name: 'localized-static-preview',
        configurePreviewServer(server) {
          // Match the language rewrites in vercel.json during local production QA.
          server.middlewares.use((req, _res, next) => {
            const url = new URL(req.url || '/', 'http://localhost');
            if (['/', '/portfolio/', '/web/'].includes(url.pathname) && url.searchParams.get('lang') === 'en') {
              req.url = `/_localized/en${url.pathname}index.html${url.search}`;
            }
            next();
          });
        },
      }],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

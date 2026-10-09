import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * En développement, exécute les fonctions du dossier api/ comme le ferait Vercel.
 * Sans DATABASE_URL, une base Postgres embarquée (PGlite) est stockée dans .data/.
 */
function localApi() {
  return {
    name: 'ipest-local-api',
    apply: 'serve',
    async configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '');
      for (const [k, v] of Object.entries(env)) if (process.env[k] === undefined) process.env[k] = v;

      if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
        const { PGlite } = await import('@electric-sql/pglite');
        mkdirSync(resolve('.data'), { recursive: true });
        const pg = new PGlite(resolve('.data/pglite'));
        globalThis.__IPEST_DEV_DB__ = { query: async (text, params) => (await pg.query(text, params)).rows };
        server.config.logger.info('  ➜  API locale : base PGlite dans .data/pglite');
      }
      if (!process.env.ADMIN_PASSWORD) {
        server.config.logger.warn('  ⚠  ADMIN_PASSWORD absent du fichier .env : l’espace /admin/ sera inaccessible.');
      }

      server.middlewares.use(async (req, res, next) => {
        const path = req.url.split('?')[0];
        if (path === '/admin') {
          res.statusCode = 301;
          res.setHeader('Location', '/admin/');
          return res.end();
        }
        if (!path.startsWith('/api/')) return next();
        const file = resolve(`.${path.replace(/\/$/, '')}.js`);
        if (!file.startsWith(resolve('api')) || !existsSync(file)) {
          res.statusCode = 404;
          return res.end('{"ok":false,"error":"Not found"}');
        }
        try {
          const mod = await server.ssrLoadModule(file);
          await mod.default(req, res);
        } catch (err) {
          next(err);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApi()],
  build: {
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        admin: resolve('admin/index.html'),
      },
    },
  },
});

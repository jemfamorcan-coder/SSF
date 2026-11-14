import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'live-report-api-dev',
        configureServer(server) {
          server.middlewares.use('/api/live-data', (_req, res) => {
            const fileCandidates = [
              path.resolve('public/assets/aistudio/Stockpile_and_Standby_Funds__SSF__Monitoring_Report_56c2f776'),
              path.resolve('public/assets/aistudio/Stockpile_and_Standby_Funds__SSF__Monitoring_Report_cf059da9'),
              path.resolve('public/assets/aistudio/Stockpile_and_Standby_Funds__SSF__Monitoring_Report_68657a5f'),
              path.resolve('public/assets/aistudio/Stockpile_and_Standby_Funds__SSF__Monitoring_Report_05f82081')
            ];
            const file = fileCandidates.find(f => fs.existsSync(f));
            if (file) {
              res.setHeader('Content-Type', 'text/plain; charset=utf-8');
              res.setHeader('Cache-Control', 'no-cache');
              res.end(fs.readFileSync(file, 'utf8'));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Report file not found' }));
            }
          });

          server.middlewares.use('/api/sync-sheet', async (req, res) => {
            const urlObj = new URL(req.url || '', 'http://localhost');
            const targetUrl = urlObj.searchParams.get('url');
            if (!targetUrl) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing url query param' }));
              return;
            }
            try {
              const fetchResp = await fetch(targetUrl);
              const text = await fetchResp.text();
              res.setHeader('Content-Type', 'text/plain; charset=utf-8');
              res.end(text);
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err?.message || 'Sync failed' }));
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

import { handleApiRequest } from './server/backend.js';

export default function backendPlugin() {
  return {
    name: 'vite-plugin-sampan-backend',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            await handleApiRequest(req, res, req.url);
          } catch (err) {
            console.error('Vite backend middleware error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
          return;
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            await handleApiRequest(req, res, req.url);
          } catch (err) {
            console.error('Vite preview backend middleware error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
          return;
        }
        next();
      });
    }
  };
}

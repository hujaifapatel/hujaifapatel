import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import categoryRoutes from './routes/categories.js';
import templateRoutes from './routes/templates.js';
import siteRoutes from './routes/sites.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  // Contact forms on downloaded websites post from any domain, so the API allows all origins
  app.use(cors());
  app.use(express.json({ limit: '25mb' })); // base64 images (3-4 + products)
  app.use(express.urlencoded({ extended: false, limit: '50kb' })); // contact form on downloaded websites

  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.use('/api/categories', categoryRoutes);
  app.use('/api/templates', templateRoutes);
  app.use('/api/sites', siteRoutes);
  app.use('/api', (_req, res) => res.status(404).json({ message: 'Route not found' }));

  // Production: serve the React build (client/dist)
  const dist = path.resolve(__dirname, '../../client/dist');
  if (fs.existsSync(dist)) {
    app.use(express.static(dist));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    if (err.type === 'entity.too.large') return res.status(413).json({ message: 'The upload is too large' });
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    res.status(500).json({ message: 'Server error' });
  });

  return app;
}

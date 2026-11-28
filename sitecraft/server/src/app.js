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

  app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || true }));
  app.use(express.json({ limit: '6mb' })); // base64 image ke liye

  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.use('/api/categories', categoryRoutes);
  app.use('/api/templates', templateRoutes);
  app.use('/api/sites', siteRoutes);
  app.use('/api', (_req, res) => res.status(404).json({ message: 'Route nahi mila' }));

  // Production: React build (client/dist) ko serve karein
  const dist = path.resolve(__dirname, '../../client/dist');
  if (fs.existsSync(dist)) {
    app.use(express.static(dist));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Image bahut badi hai' });
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    res.status(500).json({ message: 'Server error' });
  });

  return app;
}

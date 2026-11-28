import 'dotenv/config';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';
import { syncSeed } from './seed/seed.js';

const PORT = process.env.PORT || 5000;

try {
  await connectDB();
  await syncSeed(); // keeps categories + templates in sync with the seed files
  createApp().listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
} catch (err) {
  console.error('❌ Server failed to start:', err.message);
  process.exit(1);
}

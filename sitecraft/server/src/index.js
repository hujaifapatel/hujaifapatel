import 'dotenv/config';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';
import { seedIfEmpty } from './seed/seed.js';

const PORT = process.env.PORT || 5000;

try {
  await connectDB();
  await seedIfEmpty(); // pehli baar chalane par categories + templates daal dega
  createApp().listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
} catch (err) {
  console.error('❌ Server start nahi hua:', err.message);
  process.exit(1);
}

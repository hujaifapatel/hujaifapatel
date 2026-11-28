import 'dotenv/config';
import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';
import Category from '../models/Category.js';
import Template from '../models/Template.js';
import { categories, templates } from './data.js';
import { connectDB } from '../config/db.js';

// Categories/templates ko upsert karta hai (user sites ko touch nahi karta)
export async function seed() {
  await Promise.all(
    categories.map((c) => Category.updateOne({ slug: c.slug }, { $set: c }, { upsert: true }))
  );
  await Promise.all(
    templates.map((t) => Template.updateOne({ slug: t.slug }, { $set: t }, { upsert: true }))
  );
  console.log(`🌱 Seeded ${categories.length} categories, ${templates.length} templates`);
}

// Server start par: DB khali ho, purane format ke templates hon, ya seed me
// nayi category/template add hui ho — to seed chalata hai (upsert, kuch delete nahi hota)
export async function seedIfEmpty() {
  const [outdated, tCount, cCount] = await Promise.all([
    Template.exists({ 'demo.images.0': { $exists: false } }),
    Template.countDocuments({ slug: { $in: templates.map((t) => t.slug) } }),
    Category.countDocuments({ slug: { $in: categories.map((c) => c.slug) } }),
  ]);
  if (outdated || tCount < templates.length || cCount < categories.length) await seed();
}

// `npm run seed` se direct chalane par
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    await connectDB();
    await seed();
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

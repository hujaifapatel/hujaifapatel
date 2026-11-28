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

export async function seedIfEmpty() {
  if ((await Template.estimatedDocumentCount()) === 0) await seed();
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

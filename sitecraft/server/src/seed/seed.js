import 'dotenv/config';
import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';
import Category from '../models/Category.js';
import Template from '../models/Template.js';
import { categories, templates } from './data.js';
import { connectDB } from '../config/db.js';

// Upserts all categories and templates from the seed files.
// User websites and messages are never touched.
export async function seed({ quiet = false } = {}) {
  await Promise.all(categories.map((c) => Category.updateOne({ slug: c.slug }, { $set: c }, { upsert: true })));
  await Promise.all(templates.map((t) => Template.updateOne({ slug: t.slug }, { $set: t }, { upsert: true })));
  if (!quiet) console.log(`🌱 Synced ${categories.length} categories and ${templates.length} templates`);
}

// Runs on every server start so the database always matches the seed files
// (new categories/templates and text changes show up after a restart).
export const syncSeed = () => seed();

// `npm run seed`
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

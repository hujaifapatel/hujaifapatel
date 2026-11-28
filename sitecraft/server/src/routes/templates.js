import { Router } from 'express';
import mongoose from 'mongoose';
import Template from '../models/Template.js';

const router = Router();

// GET /api/templates?category=restaurant&featured=true&q=dark
router.get('/', async (req, res, next) => {
  try {
    const { category, featured, q } = req.query;
    const filter = {};
    if (category) filter.category = String(category);
    if (featured === 'true') filter.featured = true;
    if (q) {
      const rx = new RegExp(String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: rx }, { tags: rx }, { description: rx }, { category: rx }];
    }
    const templates = await Template.find(filter).sort({ featured: -1, createdAt: 1 }).lean();
    res.json(templates);
  } catch (err) {
    next(err);
  }
});

// GET /api/templates/:id (accepts an id or a slug)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
    const template = await Template.findOne(query).lean();
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (err) {
    next(err);
  }
});

export default router;

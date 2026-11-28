import { Router } from 'express';
import Category from '../models/Category.js';
import Template from '../models/Template.js';

const router = Router();

// GET /api/categories -> all categories with their template count
router.get('/', async (_req, res, next) => {
  try {
    const [categories, counts] = await Promise.all([
      Category.find().sort({ order: 1, name: 1 }).lean(),
      Template.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    ]);
    const map = Object.fromEntries(counts.map((c) => [c._id, c.count]));
    res.json(categories.map((c) => ({ ...c, templateCount: map[c.slug] || 0 })));
  } catch (err) {
    next(err);
  }
});

// GET /api/categories/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).lean();
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
});

export default router;

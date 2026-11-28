import { Router } from 'express';
import mongoose from 'mongoose';
import Site from '../models/Site.js';
import Template from '../models/Template.js';

const router = Router();

const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // ~3MB (base64 decoded)
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body) {
  const errors = {};
  const d = body?.data || {};
  if (!body?.templateId || !mongoose.isValidObjectId(body.templateId)) errors.templateId = 'Template select karein';
  if (!d.title || !String(d.title).trim()) errors.title = 'Title zaroori hai';
  if (!d.image || !/^data:image\/(png|jpe?g|webp|gif);base64,/.test(d.image)) {
    errors.image = 'Ek valid image upload karein';
  } else {
    const bytes = Math.ceil((d.image.length - d.image.indexOf(',') - 1) * 0.75);
    if (bytes > MAX_IMAGE_BYTES) errors.image = 'Image 3MB se chhoti honi chahiye';
  }
  if (!d.phone && !d.email) errors.contact = 'Phone ya email me se kam se kam ek dein';
  if (d.email && !EMAIL_RX.test(d.email)) errors.email = 'Email sahi nahi hai';
  return errors;
}

// POST /api/sites  -> user ki details template me apply karke site save
router.post('/', async (req, res, next) => {
  try {
    const errors = validate(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Validation failed', errors });

    const template = await Template.findById(req.body.templateId);
    if (!template) return res.status(404).json({ message: 'Template nahi mila' });

    const { title, tagline, image, phone, email, address, whatsapp } = req.body.data;
    const site = await Site.create({
      template: template._id,
      data: { title, tagline, image, phone, email, address, whatsapp },
    });
    res.status(201).json({ _id: site._id });
  } catch (err) {
    next(err);
  }
});

// GET /api/sites/:id  -> published site (template ke saath)
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Site nahi mili' });
    const site = await Site.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
      .populate('template')
      .lean();
    if (!site) return res.status(404).json({ message: 'Site nahi mili' });
    res.json(site);
  } catch (err) {
    next(err);
  }
});

export default router;

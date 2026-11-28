import { Router } from 'express';
import mongoose from 'mongoose';
import crypto from 'node:crypto';
import Site from '../models/Site.js';
import Template from '../models/Template.js';

const router = Router();

const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // har image ~3MB tak (decoded)
const MIN_IMAGES = 3;
const MAX_IMAGES = 4;
const MAX_PRODUCTS = 8;
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IMG_RX = /^data:image\/(png|jpe?g|webp|gif);base64,/;

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const imageError = (v) => {
  if (typeof v !== 'string' || !IMG_RX.test(v)) return 'Invalid image';
  const bytes = Math.ceil((v.length - v.indexOf(',') - 1) * 0.75);
  return bytes > MAX_IMAGE_BYTES ? 'Image 3MB se chhoti honi chahiye' : null;
};

// Request body ko validate + clean karta hai. Returns { errors, data }
function parse(body) {
  const errors = {};
  const d = body?.data || {};

  const data = {
    title: str(d.title, 80),
    tagline: str(d.tagline, 160),
    description: str(d.description, 1500),
    phone: str(d.phone, 30),
    whatsapp: str(d.whatsapp, 30),
    email: str(d.email, 120).toLowerCase(),
    address: str(d.address, 250),
    hours: str(d.hours, 120),
    images: Array.isArray(d.images) ? d.images.slice(0, MAX_IMAGES) : [],
    products: Array.isArray(d.products) ? d.products.slice(0, MAX_PRODUCTS) : [],
  };

  if (!data.title) errors.title = 'Title zaroori hai';
  if (!data.description) errors.description = 'Description zaroori hai';

  if (data.images.length < MIN_IMAGES) errors.images = `Kam se kam ${MIN_IMAGES} images upload karein`;
  else {
    const bad = data.images.map(imageError).find(Boolean);
    if (bad) errors.images = bad;
  }

  data.products = data.products
    .map((p) => ({
      name: str(p?.name, 80),
      price: str(p?.price, 40),
      description: str(p?.description, 300),
      image: typeof p?.image === 'string' ? p.image : '',
    }))
    .filter((p) => p.name);
  if (data.products.length === 0) errors.products = 'Kam se kam 1 product add karein';
  const badProduct = data.products.find((p) => p.image && imageError(p.image));
  if (badProduct) errors.products = `"${badProduct.name}" ki image sahi nahi hai`;

  if (!data.phone && !data.email) errors.contact = 'Phone ya email me se kam se kam ek dein';
  if (data.email && !EMAIL_RX.test(data.email)) errors.email = 'Email sahi nahi hai';

  return { errors, data };
}

const sameKey = (a = '', b = '') =>
  a.length === b.length && a.length > 0 && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

// POST /api/sites  -> user ki details template me apply karke site save
router.post('/', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.body?.templateId)) {
      return res.status(400).json({ message: 'Template select karein' });
    }
    const { errors, data } = parse(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ message: Object.values(errors)[0], errors });

    const template = await Template.findById(req.body.templateId);
    if (!template) return res.status(404).json({ message: 'Template nahi mila' });

    const site = await Site.create({ template: template._id, data });
    res.status(201).json({ _id: site._id, editKey: site.editKey });
  } catch (err) {
    next(err);
  }
});

// PUT /api/sites/:id  -> site edit (header: x-edit-key)
router.put('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Site nahi mili' });
    const site = await Site.findById(req.params.id).select('+editKey');
    if (!site) return res.status(404).json({ message: 'Site nahi mili' });
    if (!sameKey(String(req.get('x-edit-key') || ''), site.editKey)) {
      return res.status(403).json({ message: 'Is site ko edit karne ki permission nahi hai' });
    }
    const { errors, data } = parse(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ message: Object.values(errors)[0], errors });

    if (req.body.templateId && mongoose.isValidObjectId(req.body.templateId)) {
      const template = await Template.findById(req.body.templateId);
      if (template) site.template = template._id;
    }
    site.data = data;
    await site.save();
    res.json({ _id: site._id });
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

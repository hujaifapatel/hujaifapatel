import { Router } from 'express';
import mongoose from 'mongoose';
import crypto from 'node:crypto';
import Site from '../models/Site.js';
import Template from '../models/Template.js';

const router = Router();

const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // ~3MB per image (decoded)
const MIN_IMAGES = 3;
const MAX_IMAGES = 4;
const MAX_PRODUCTS = 12;
export const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IMG_RX = /^data:image\/(png|jpe?g|webp|gif);base64,/;

export const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const imageError = (v) => {
  if (typeof v !== 'string' || !IMG_RX.test(v)) return 'Invalid image';
  const bytes = Math.ceil((v.length - v.indexOf(',') - 1) * 0.75);
  return bytes > MAX_IMAGE_BYTES ? 'Each image must be smaller than 3 MB' : null;
};

// Validates and cleans the website data from the request body. Returns { errors, data }
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

  if (!data.title) errors.title = 'Title is required';
  if (!data.description) errors.description = 'Description is required';

  if (data.images.length < MIN_IMAGES) errors.images = `Please upload at least ${MIN_IMAGES} images`;
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
  if (data.products.length === 0) errors.products = 'Please add at least 1 product';
  const badProduct = data.products.find((p) => p.image && imageError(p.image));
  if (badProduct) errors.products = `The image for "${badProduct.name}" is not valid`;

  if (!data.phone && !data.email) errors.contact = 'Please provide a phone number or an email';
  if (data.email && !EMAIL_RX.test(data.email)) errors.email = 'Please enter a valid email';

  return { errors, data };
}

const sameKey = (a = '', b = '') =>
  a.length === b.length && a.length > 0 && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

// Loads the site and checks the x-edit-key header. Sends the error response itself and returns null on failure.
export async function siteForOwner(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ message: 'Website not found' });
    return null;
  }
  const site = await Site.findById(req.params.id).select('+editKey');
  if (!site) {
    res.status(404).json({ message: 'Website not found' });
    return null;
  }
  if (!sameKey(String(req.get('x-edit-key') || ''), site.editKey)) {
    res.status(403).json({ message: 'You do not have permission to manage this website' });
    return null;
  }
  return site;
}

/* ----------------------------- Websites ----------------------------- */

// POST /api/sites -> save the user's details applied to a template
router.post('/', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.body?.templateId)) {
      return res.status(400).json({ message: 'Please select a template' });
    }
    const { errors, data } = parse(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ message: Object.values(errors)[0], errors });

    const template = await Template.findById(req.body.templateId);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    const site = await Site.create({ template: template._id, data });
    res.status(201).json({ _id: site._id, editKey: site.editKey });
  } catch (err) {
    next(err);
  }
});

// PUT /api/sites/:id -> update a website (header: x-edit-key)
router.put('/:id', async (req, res, next) => {
  try {
    const site = await siteForOwner(req, res);
    if (!site) return;
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

// GET /api/sites/:id -> a published website (with its template)
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Website not found' });
    const site = await Site.findById(req.params.id).populate('template').lean();
    if (!site) return res.status(404).json({ message: 'Website not found' });
    res.json(site);
  } catch (err) {
    next(err);
  }
});

// POST /api/sites/:id/view -> count a visit to the live website
router.post('/:id/view', async (req, res, next) => {
  try {
    if (mongoose.isValidObjectId(req.params.id)) await Site.updateOne({ _id: req.params.id }, { $inc: { views: 1 } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;

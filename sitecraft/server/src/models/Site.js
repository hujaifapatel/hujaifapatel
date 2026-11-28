import mongoose from 'mongoose';
import crypto from 'node:crypto';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    price: { type: String, trim: true, maxlength: 40, default: '' },
    description: { type: String, trim: true, maxlength: 300, default: '' },
    image: { type: String, default: '' }, // base64 data URL
  },
  { _id: false }
);

const siteSchema = new mongoose.Schema(
  {
    template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
    data: {
      // Basic info
      title: { type: String, required: true, trim: true, maxlength: 80 },
      tagline: { type: String, trim: true, maxlength: 160, default: '' },
      description: { type: String, trim: true, maxlength: 1500, default: '' },
      // 3-4 images (base64 data URLs, client side compressed)
      images: { type: [String], default: [] },
      // Products page
      products: { type: [productSchema], default: [] },
      // Contact page
      phone: { type: String, trim: true, maxlength: 30, default: '' },
      whatsapp: { type: String, trim: true, maxlength: 30, default: '' },
      email: { type: String, trim: true, lowercase: true, maxlength: 120, default: '' },
      address: { type: String, trim: true, maxlength: 250, default: '' },
      hours: { type: String, trim: true, maxlength: 120, default: '' },
    },
    // Site banane wale ko milta hai — isi se baad me edit kar sakta hai
    editKey: { type: String, select: false, default: () => crypto.randomBytes(16).toString('hex') },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Site', siteSchema);

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '✨' },
    cover: { type: String, default: '' },
    order: { type: Number, default: 0 },
    // 'shop' = product wali dukaan, 'service' = service business
    group: { type: String, enum: ['shop', 'service'], default: 'service' },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);

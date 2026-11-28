import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({ title: String, desc: String, icon: String }, { _id: false });
const productSchema = new mongoose.Schema(
  { name: String, price: String, description: String, image: String },
  { _id: false }
);

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true, index: true }, // category slug
    // Which layout component the frontend renders
    layout: { type: String, enum: ['classic', 'bold', 'minimal', 'dark'], required: true },
    description: { type: String, default: '' },
    tags: [String],
    pages: [String], // e.g. ['Home', 'Menu', 'Contact']
    featured: { type: Boolean, default: false },
    theme: {
      primary: { type: String, default: '#10b981' },
      accent: { type: String, default: '#0f172a' },
      font: { type: String, default: 'Inter' },
    },
    // Fixed content of the template (depends on the category)
    content: {
      productsLabel: { type: String, default: 'Products' },
      productsIntro: String,
      cta: String,
      features: [featureSchema],
    },
    // Demo data for previews (replaced by the user's data)
    demo: {
      title: String,
      tagline: String,
      description: String,
      images: [String],
      products: [productSchema],
      phone: String,
      email: String,
      address: String,
      hours: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Template', templateSchema);

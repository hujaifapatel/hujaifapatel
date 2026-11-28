import mongoose from 'mongoose';

const siteSchema = new mongoose.Schema(
  {
    template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
    data: {
      title: { type: String, required: true, trim: true, maxlength: 80 },
      tagline: { type: String, trim: true, maxlength: 160, default: '' },
      image: { type: String, required: true }, // base64 data URL (client side compressed)
      phone: { type: String, trim: true, maxlength: 30, default: '' },
      email: { type: String, trim: true, lowercase: true, maxlength: 120, default: '' },
      address: { type: String, trim: true, maxlength: 200, default: '' },
      whatsapp: { type: String, trim: true, maxlength: 30, default: '' },
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Site', siteSchema);

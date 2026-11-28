import mongoose from 'mongoose';

// A message sent by a visitor through the Contact page of a generated website
const messageSchema = new mongoose.Schema(
  {
    site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, trim: true, maxlength: 30, default: '' },
    email: { type: String, trim: true, lowercase: true, maxlength: 120, default: '' },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);

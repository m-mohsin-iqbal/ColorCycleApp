import mongoose from 'mongoose';

const ColorStateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  colors: [{ type: String, required: true }],
  highlightIndex: { type: Number, required: true },
  timestamp: { type: Date, required: true },
});

export const ColorState = mongoose.models.ColorState || mongoose.model('ColorState', ColorStateSchema);
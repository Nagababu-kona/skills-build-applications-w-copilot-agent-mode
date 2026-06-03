import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    role: { type: String, default: 'student' },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 5 },
    difficulty: { type: String, default: 'Beginner' },
    focus: { type: String, default: 'General fitness' },
  },
  { timestamps: true }
);

export const Workout = mongoose.model('Workout', workoutSchema);

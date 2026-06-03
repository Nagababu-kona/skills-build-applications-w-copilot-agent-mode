import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    student: { type: String, required: true, trim: true },
    activity: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    points: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Activity = mongoose.model('Activity', activitySchema);

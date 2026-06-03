import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema(
  {
    student: { type: String, required: true, trim: true },
    totalPoints: { type: Number, default: 0, min: 0 },
    workouts: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Activity } from './models/Activity.js';
import { Team } from './models/Team.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8000);
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'OctoFit Tracker API is running.' });
});

app.get('/api/activities', async (_req, res) => {
  const activities = await Activity.find().sort({ date: -1 }).limit(8);
  res.json(activities);
});

app.get('/api/leaderboard', async (_req, res) => {
  const leaderboard = await Activity.aggregate([
    { $group: { _id: '$student', totalPoints: { $sum: '$points' }, workouts: { $sum: 1 } } },
    { $sort: { totalPoints: -1 } },
  ]);

  res.json(leaderboard);
});

app.get('/api/teams', async (_req, res) => {
  const teams = await Team.find().sort({ points: -1 });
  res.json(teams);
});

const seedData = async () => {
  const activityCount = await Activity.countDocuments();
  if (activityCount === 0) {
    await Activity.insertMany([
      { student: 'Ava', activity: 'Morning Run', durationMinutes: 25, points: 120, date: new Date('2026-06-01') },
      { student: 'Noah', activity: 'Strength Training', durationMinutes: 35, points: 150, date: new Date('2026-06-02') },
      { student: 'Mia', activity: 'Cycling', durationMinutes: 30, points: 110, date: new Date('2026-06-03') },
      { student: 'Liam', activity: 'Yoga Flow', durationMinutes: 20, points: 90, date: new Date('2026-06-03') },
    ]);
  }

  const teamCount = await Team.countDocuments();
  if (teamCount === 0) {
    await Team.insertMany([
      { name: 'Trail Blazers', captain: 'Ava', members: ['Ava', 'Liam', 'Noah'], points: 380 },
      { name: 'Power Squad', captain: 'Mia', members: ['Mia', 'Jules', 'Kai'], points: 340 },
    ]);
  }
};

const startServer = async () => {
  try {
    await mongoose.connect(mongoUri);
    await seedData();
    console.log('MongoDB connected successfully.');

    app.listen(port, '0.0.0.0', () => {
      console.log(`OctoFit Tracker API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start OctoFit Tracker API:', error);
    process.exit(1);
  }
};

startServer();

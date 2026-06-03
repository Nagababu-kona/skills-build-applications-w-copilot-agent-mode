import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Activity } from './models/Activity.js';
import { Leaderboard } from './models/Leaderboard.js';
import { Team } from './models/Team.js';
import { User } from './models/User.js';
import { Workout } from './models/Workout.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8000);
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'OctoFit Tracker API is running.', baseUrl });
});

app.get('/api/users', async (_req, res) => {
  const users = await User.find().sort({ points: -1 });
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

app.get('/api/teams', async (_req, res) => {
  const teams = await Team.find().sort({ points: -1 });
  res.json(teams);
});

app.post('/api/teams', async (req, res) => {
  const team = await Team.create(req.body);
  res.status(201).json(team);
});

app.get('/api/activities', async (_req, res) => {
  const activities = await Activity.find().sort({ date: -1 }).limit(8);
  res.json(activities);
});

app.post('/api/activities', async (req, res) => {
  const activity = await Activity.create(req.body);
  res.status(201).json(activity);
});

app.get('/api/leaderboard', async (_req, res) => {
  const leaderboard = await Leaderboard.find().sort({ totalPoints: -1 });

  if (leaderboard.length > 0) {
    res.json(leaderboard);
    return;
  }

  const fallbackLeaderboard = await Activity.aggregate([
    { $group: { _id: '$student', totalPoints: { $sum: '$points' }, workouts: { $sum: 1 } } },
    { $sort: { totalPoints: -1 } },
  ]);

  res.json(fallbackLeaderboard);
});

app.get('/api/workouts', async (_req, res) => {
  const workouts = await Workout.find().sort({ createdAt: -1 });
  res.json(workouts);
});

app.post('/api/workouts', async (req, res) => {
  const workout = await Workout.create(req.body);
  res.status(201).json(workout);
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

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    await User.insertMany([
      { name: 'Ava', email: 'ava@mergington.test', role: 'captain', points: 120 },
      { name: 'Noah', email: 'noah@mergington.test', role: 'student', points: 95 },
    ]);
  }

  const workoutCount = await Workout.countDocuments();
  if (workoutCount === 0) {
    await Workout.insertMany([
      { title: 'Sprint Intervals', category: 'Cardio', durationMinutes: 20, difficulty: 'Intermediate', focus: 'Speed and endurance' },
      { title: 'Core Stability', category: 'Strength', durationMinutes: 15, difficulty: 'Beginner', focus: 'Abs and posture' },
    ]);
  }

  const leaderboardCount = await Leaderboard.countDocuments();
  if (leaderboardCount === 0) {
    const leaderboardEntries = await Activity.aggregate([
      { $group: { _id: '$student', totalPoints: { $sum: '$points' }, workouts: { $sum: 1 } } },
      { $sort: { totalPoints: -1 } },
    ]);

    await Leaderboard.insertMany(
      leaderboardEntries.map((entry) => ({
        student: entry._id,
        totalPoints: entry.totalPoints,
        workouts: entry.workouts,
      }))
    );
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

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectToDatabase, mongoUri } from '../config/database.js';
import { Activity } from '../models/Activity.js';
import { Leaderboard } from '../models/Leaderboard.js';
import { Team } from '../models/Team.js';
import { User } from '../models/User.js';
import { Workout } from '../models/Workout.js';
dotenv.config();
// Seed the octofit_db database with test data
const seedData = async () => {
    await connectToDatabase();
    console.log('Connected to MongoDB at', mongoUri);
    await Promise.all([
        Activity.deleteMany({}),
        Leaderboard.deleteMany({}),
        Team.deleteMany({}),
        User.deleteMany({}),
        Workout.deleteMany({}),
    ]);
    const activities = await Activity.insertMany([
        { student: 'Ava', activity: 'Morning Run', durationMinutes: 25, points: 120, date: new Date('2026-06-01') },
        { student: 'Noah', activity: 'Strength Training', durationMinutes: 35, points: 150, date: new Date('2026-06-02') },
        { student: 'Mia', activity: 'Cycling', durationMinutes: 30, points: 110, date: new Date('2026-06-03') },
        { student: 'Liam', activity: 'Yoga Flow', durationMinutes: 20, points: 90, date: new Date('2026-06-03') },
    ]);
    await Team.insertMany([
        { name: 'Trail Blazers', captain: 'Ava', members: ['Ava', 'Liam', 'Noah'], points: 380 },
        { name: 'Power Squad', captain: 'Mia', members: ['Mia', 'Jules', 'Kai'], points: 340 },
    ]);
    await User.insertMany([
        { name: 'Ava', email: 'ava@mergington.test', role: 'captain', points: 120 },
        { name: 'Noah', email: 'noah@mergington.test', role: 'student', points: 95 },
        { name: 'Mia', email: 'mia@mergington.test', role: 'student', points: 110 },
        { name: 'Liam', email: 'liam@mergington.test', role: 'student', points: 90 },
    ]);
    await Workout.insertMany([
        { title: 'Sprint Intervals', category: 'Cardio', durationMinutes: 20, difficulty: 'Intermediate', focus: 'Speed and endurance' },
        { title: 'Core Stability', category: 'Strength', durationMinutes: 15, difficulty: 'Beginner', focus: 'Abs and posture' },
        { title: 'Recovery Stretch', category: 'Mobility', durationMinutes: 12, difficulty: 'Beginner', focus: 'Flexibility and balance' },
    ]);
    const students = Array.from(new Set(activities.map((activity) => activity.student)));
    const leaderboardEntries = students.map((student) => {
        const studentActivities = activities.filter((activity) => activity.student === student);
        return {
            student,
            totalPoints: studentActivities.reduce((sum, activity) => sum + activity.points, 0),
            workouts: studentActivities.length,
        };
    });
    await Leaderboard.insertMany(leaderboardEntries);
    console.log('Seeded collections: users, teams, activities, leaderboard, workouts');
    await mongoose.disconnect();
};
seedData().catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
});

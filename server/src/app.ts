import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import workoutRoutes from './routes/workouts';
import exerciseRoutes from './routes/exercises';
import leaderboardRoutes from './routes/leaderboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = [
    CLIENT_URL,
    CLIENT_URL.endsWith('/') ? CLIENT_URL.slice(0, -1) : CLIENT_URL + '/',
    'http://localhost:5173'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes(origin + '/')) {
            callback(null, true);
        } else {
            console.log('⚠️ CORS Blocked Origin:', origin);
            callback(null, true); // Temporarily true for debugging, change back to Error later
        }
    },
    credentials: true
}));

app.use(express.json());

// Simple Request Logger
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.get('/', (_req, res) => {
    res.json({ message: 'Horizon Performance API is running 🏋️' });
});
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/horizon-performance';
mongoose
    .connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

export default app;

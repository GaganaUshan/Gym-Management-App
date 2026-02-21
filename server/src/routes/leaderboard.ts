import { Router, Request, Response } from 'express';
import Workout from '../models/Workout';
import User from '../models/User';

const router = Router();

// Consistency score formula:
//  - Total workouts (weight: 2×)
//  - Workouts in last 7 days (weight: 5×) — freshness bonus
//  - Workouts in last 30 days (weight: 3×)
//  - Unique days worked out (streak quality)

// GET /api/leaderboard
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const now = new Date();
        const day7 = new Date(now); day7.setDate(now.getDate() - 7);
        const day30 = new Date(now); day30.setDate(now.getDate() - 30);

        // Aggregate workouts per user
        const stats = await Workout.aggregate([
            {
                $group: {
                    _id: '$userId',
                    total: { $sum: 1 },
                    last7: {
                        $sum: { $cond: [{ $gte: ['$date', day7] }, 1, 0] },
                    },
                    last30: {
                        $sum: { $cond: [{ $gte: ['$date', day30] }, 1, 0] },
                    },
                    // unique days: collect all dates, deduplicate in JS
                    dates: { $push: '$date' },
                },
            },
        ]);

        // Compute score and attach user name
        const users = await User.find({}, 'name _id');
        const userMap: Record<string, string> = {};
        users.forEach(u => { userMap[u._id.toString()] = u.name; });

        const leaderboard = stats.map(s => {
            // Count unique calendar days
            const uniqueDays = new Set(
                (s.dates as Date[]).map((d: Date) => new Date(d).toDateString())
            ).size;

            const score = s.total * 2 + s.last7 * 5 + s.last30 * 3 + uniqueDays;
            return {
                userId: s._id,
                name: userMap[s._id.toString()] ?? 'Unknown',
                total: s.total,
                last7: s.last7,
                last30: s.last30,
                uniqueDays,
                score,
            };
        });

        // Include users who have zero workouts too
        users.forEach(u => {
            const exists = leaderboard.find(l => l.userId.toString() === u._id.toString());
            if (!exists) {
                leaderboard.push({ userId: u._id, name: u.name, total: 0, last7: 0, last30: 0, uniqueDays: 0, score: 0 });
            }
        });

        leaderboard.sort((a, b) => b.score - a.score);

        res.json(leaderboard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

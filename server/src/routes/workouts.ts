import { Router, Response } from 'express';
import Workout from '../models/Workout';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(protect);

// GET /api/workouts
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const workouts = await Workout.find({ userId: req.userId }).sort({ date: -1 });
        res.json(workouts);
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/workouts
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, date, exercises, durationMinutes, notes } = req.body;
        const workout = await Workout.create({
            userId: req.userId,
            name: name || 'Workout',
            date: date || new Date(),
            exercises: exercises || [],
            durationMinutes,
            notes,
        });
        res.status(201).json(workout);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/workouts/:id
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const workout = await Workout.findOne({ _id: req.params.id, userId: req.userId });
        if (!workout) {
            res.status(404).json({ message: 'Workout not found' });
            return;
        }
        await workout.deleteOne();
        res.json({ message: 'Deleted' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

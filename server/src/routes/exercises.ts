import { Router, Request, Response } from 'express';
import Exercise from '../models/Exercise';

const router = Router();

const DEFAULT_EXERCISES = [
    { name: 'Barbell Bench Press', muscleGroup: 'Chest', secondaryMuscles: ['Triceps', 'Shoulders'], description: 'Classic compound chest movement.', instructions: 'Lie on a flat bench, grip the bar slightly wider than shoulder-width, lower to chest and press up.', difficulty: 'intermediate', equipment: 'Barbell' },
    { name: 'Pull-Up', muscleGroup: 'Back', secondaryMuscles: ['Biceps'], description: 'Upper body pulling compound movement.', instructions: 'Hang from a bar with overhand grip, pull chin above bar, lower with control.', difficulty: 'intermediate', equipment: 'Pull-up bar' },
    { name: 'Squat', muscleGroup: 'Legs', secondaryMuscles: ['Glutes', 'Core'], description: 'King of leg exercises.', instructions: 'Bar on traps, feet shoulder-width, descend until thighs are parallel, drive up through heels.', difficulty: 'intermediate', equipment: 'Barbell' },
    { name: 'Deadlift', muscleGroup: 'Back', secondaryMuscles: ['Legs', 'Core', 'Glutes'], description: 'Full-body compound pull.', instructions: 'Hip-width stance, hinge at hips, flat back, pull bar from floor to lockout.', difficulty: 'advanced', equipment: 'Barbell' },
    { name: 'Overhead Press', muscleGroup: 'Shoulders', secondaryMuscles: ['Triceps', 'Core'], description: 'Vertical pressing movement.', instructions: 'Bar at shoulder height, press overhead to full lockout, lower under control.', difficulty: 'intermediate', equipment: 'Barbell' },
    { name: 'Dumbbell Row', muscleGroup: 'Back', secondaryMuscles: ['Biceps'], description: 'Unilateral back rowing exercise.', instructions: 'Knee and hand on bench, pull dumbbell to hip, lower with control.', difficulty: 'beginner', equipment: 'Dumbbell' },
    { name: 'Incline Dumbbell Press', muscleGroup: 'Chest', secondaryMuscles: ['Shoulders', 'Triceps'], description: 'Upper chest focus.', instructions: 'Set bench to 30-45°, press dumbbells from shoulder height to full extension.', difficulty: 'beginner', equipment: 'Dumbbell' },
    { name: 'Romanian Deadlift', muscleGroup: 'Legs', secondaryMuscles: ['Glutes', 'Back'], description: 'Hip hinge for hamstrings.', instructions: 'Slight knee bend, hinge at hips pushing them back, lower bar along legs, squeeze glutes to return.', difficulty: 'intermediate', equipment: 'Barbell' },
    { name: 'Bicep Curl', muscleGroup: 'Arms', secondaryMuscles: [], description: 'Classic arm isolation movement.', instructions: 'Stand with dumbbells, curl to shoulder height, lower with control.', difficulty: 'beginner', equipment: 'Dumbbell' },
    { name: 'Tricep Dips', muscleGroup: 'Arms', secondaryMuscles: ['Chest', 'Shoulders'], description: 'Bodyweight tricep builder.', instructions: 'Grip parallel bars, lower until arms are 90°, press back up.', difficulty: 'beginner', equipment: 'Parallel bars' },
    { name: 'Leg Press', muscleGroup: 'Legs', secondaryMuscles: ['Glutes'], description: 'Machine-based quad dominant movement.', instructions: 'Feet shoulder-width on platform, lower sled until 90°, press back up.', difficulty: 'beginner', equipment: 'Machine' },
    { name: 'Cable Fly', muscleGroup: 'Chest', secondaryMuscles: [], description: 'Cable chest isolation.', instructions: 'Stand between cables at shoulder height, arc arms together in front, return slowly.', difficulty: 'beginner', equipment: 'Cable machine' },
    { name: 'Face Pull', muscleGroup: 'Shoulders', secondaryMuscles: ['Upper Back'], description: 'Rear delt and rotator cuff health exercise.', instructions: 'Set cable to face height, pull to forehead with elbows high, retract shoulder blades.', difficulty: 'beginner', equipment: 'Cable machine' },
    { name: 'Plank', muscleGroup: 'Core', secondaryMuscles: [], description: 'Static core endurance exercise.', instructions: 'Forearms on floor, body in straight line from head to toe, hold position.', difficulty: 'beginner', equipment: 'none' },
    { name: 'Hanging Leg Raise', muscleGroup: 'Core', secondaryMuscles: [], description: 'Dynamic ab flexion movement.', instructions: 'Hang from pull-up bar, raise legs to 90° (or higher), lower with control.', difficulty: 'intermediate', equipment: 'Pull-up bar' },
    { name: 'Lateral Raise', muscleGroup: 'Shoulders', secondaryMuscles: [], description: 'Side delt isolation.', instructions: 'Hold dumbbells at sides, raise to shoulder height with slightly bent arms, lower slowly.', difficulty: 'beginner', equipment: 'Dumbbell' },
    { name: 'Calf Raise', muscleGroup: 'Legs', secondaryMuscles: [], description: 'Calf muscle isolation.', instructions: 'Stand on edge of step or flat ground, rise up on toes, lower fully.', difficulty: 'beginner', equipment: 'none' },
    { name: 'Hip Thrust', muscleGroup: 'Glutes', secondaryMuscles: ['Hamstrings', 'Core'], description: 'Glute dominant hip extension.', instructions: 'Upper back on bench, bar across hips, drive hips up to full extension, squeeze glutes at top.', difficulty: 'intermediate', equipment: 'Barbell' },
];

// GET /api/exercises
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        let exercises = await Exercise.find();
        if (exercises.length === 0) {
            await Exercise.insertMany(DEFAULT_EXERCISES);
            exercises = await Exercise.find();
        }
        res.json(exercises);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

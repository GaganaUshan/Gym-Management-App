import mongoose, { Document, Schema } from 'mongoose';

export interface IExerciseEntry {
    name: string;
    sets: number;
    reps: number;
    weight: number; // in kg
    notes?: string;
}

export interface IWorkout extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    date: Date;
    exercises: IExerciseEntry[];
    durationMinutes?: number;
    notes?: string;
}

const ExerciseEntrySchema = new Schema<IExerciseEntry>({
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true, default: 0 },
    notes: { type: String },
});

const WorkoutSchema = new Schema<IWorkout>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, default: 'Workout' },
    date: { type: Date, default: Date.now },
    exercises: [ExerciseEntrySchema],
    durationMinutes: { type: Number },
    notes: { type: String },
});

export default mongoose.model<IWorkout>('Workout', WorkoutSchema);

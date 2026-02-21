import mongoose, { Document, Schema } from 'mongoose';

export interface IExercise extends Document {
    name: string;
    muscleGroup: string;
    secondaryMuscles?: string[];
    description: string;
    instructions: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    equipment: string;
}

const ExerciseSchema = new Schema<IExercise>({
    name: { type: String, required: true, trim: true },
    muscleGroup: { type: String, required: true },
    secondaryMuscles: [{ type: String }],
    description: { type: String, required: true },
    instructions: { type: String, required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    equipment: { type: String, default: 'none' },
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);

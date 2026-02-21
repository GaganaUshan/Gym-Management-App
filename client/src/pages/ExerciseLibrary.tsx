import { useState } from 'react';
import { BookOpen, Search } from 'lucide-react';

const EXERCISES = [
    { id: '1', name: 'Barbell Bench Press', muscleGroup: 'Chest', secondaryMuscles: ['Triceps', 'Shoulders'], description: 'Classic compound chest movement.', instructions: 'Lie on a flat bench, grip the bar slightly wider than shoulder-width, lower to chest and press up.', difficulty: 'intermediate', equipment: 'Barbell' },
    { id: '2', name: 'Pull-Up', muscleGroup: 'Back', secondaryMuscles: ['Biceps'], description: 'Upper body pulling compound movement.', instructions: 'Hang from a bar with overhand grip, pull chin above bar, lower with control.', difficulty: 'intermediate', equipment: 'Pull-up bar' },
    { id: '3', name: 'Squat', muscleGroup: 'Legs', secondaryMuscles: ['Glutes', 'Core'], description: 'King of leg exercises.', instructions: 'Bar on traps, feet shoulder-width, descend until thighs are parallel, drive up through heels.', difficulty: 'intermediate', equipment: 'Barbell' },
    { id: '4', name: 'Deadlift', muscleGroup: 'Back', secondaryMuscles: ['Legs', 'Core', 'Glutes'], description: 'Full-body compound pull.', instructions: 'Hip-width stance, hinge at hips, flat back, pull bar from floor to lockout.', difficulty: 'advanced', equipment: 'Barbell' },
    { id: '5', name: 'Overhead Press', muscleGroup: 'Shoulders', secondaryMuscles: ['Triceps', 'Core'], description: 'Vertical pressing movement.', instructions: 'Bar at shoulder height, press overhead to full lockout, lower under control.', difficulty: 'intermediate', equipment: 'Barbell' },
    { id: '6', name: 'Dumbbell Row', muscleGroup: 'Back', secondaryMuscles: ['Biceps'], description: 'Unilateral back rowing exercise.', instructions: 'Knee and hand on bench, pull dumbbell to hip, lower with control.', difficulty: 'beginner', equipment: 'Dumbbell' },
    { id: '7', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', secondaryMuscles: ['Shoulders', 'Triceps'], description: 'Upper chest focus.', instructions: 'Set bench to 30–45°, press dumbbells from shoulder height to full extension.', difficulty: 'beginner', equipment: 'Dumbbell' },
    { id: '8', name: 'Romanian Deadlift', muscleGroup: 'Legs', secondaryMuscles: ['Glutes', 'Back'], description: 'Hip hinge for hamstrings.', instructions: 'Slight knee bend, hinge at hips pushing them back, lower bar along legs, squeeze glutes to return.', difficulty: 'intermediate', equipment: 'Barbell' },
    { id: '9', name: 'Bicep Curl', muscleGroup: 'Arms', secondaryMuscles: [], description: 'Classic arm isolation movement.', instructions: 'Stand with dumbbells, curl to shoulder height, lower with control.', difficulty: 'beginner', equipment: 'Dumbbell' },
    { id: '10', name: 'Tricep Dips', muscleGroup: 'Arms', secondaryMuscles: ['Chest', 'Shoulders'], description: 'Bodyweight tricep builder.', instructions: 'Grip parallel bars, lower until arms are 90°, press back up.', difficulty: 'beginner', equipment: 'Parallel bars' },
    { id: '11', name: 'Leg Press', muscleGroup: 'Legs', secondaryMuscles: ['Glutes'], description: 'Machine-based quad dominant movement.', instructions: 'Feet shoulder-width on platform, lower sled until 90°, press back up.', difficulty: 'beginner', equipment: 'Machine' },
    { id: '12', name: 'Cable Fly', muscleGroup: 'Chest', secondaryMuscles: [], description: 'Cable chest isolation.', instructions: 'Stand between cables at shoulder height, arc arms together in front, return slowly.', difficulty: 'beginner', equipment: 'Cable machine' },
    { id: '13', name: 'Face Pull', muscleGroup: 'Shoulders', secondaryMuscles: ['Upper Back'], description: 'Rear delt and rotator cuff health.', instructions: 'Set cable to face height, pull to forehead with elbows high, retract shoulder blades.', difficulty: 'beginner', equipment: 'Cable machine' },
    { id: '14', name: 'Plank', muscleGroup: 'Core', secondaryMuscles: [], description: 'Static core endurance exercise.', instructions: 'Forearms on floor, body in straight line from head to toe, hold position.', difficulty: 'beginner', equipment: 'None' },
    { id: '15', name: 'Hanging Leg Raise', muscleGroup: 'Core', secondaryMuscles: [], description: 'Dynamic ab flexion movement.', instructions: 'Hang from pull-up bar, raise legs to 90° (or higher), lower with control.', difficulty: 'intermediate', equipment: 'Pull-up bar' },
    { id: '16', name: 'Lateral Raise', muscleGroup: 'Shoulders', secondaryMuscles: [], description: 'Side delt isolation.', instructions: 'Hold dumbbells at sides, raise to shoulder height with slightly bent arms, lower slowly.', difficulty: 'beginner', equipment: 'Dumbbell' },
    { id: '17', name: 'Calf Raise', muscleGroup: 'Legs', secondaryMuscles: [], description: 'Calf muscle isolation.', instructions: 'Stand on edge of step, rise up on toes, lower fully.', difficulty: 'beginner', equipment: 'None' },
    { id: '18', name: 'Hip Thrust', muscleGroup: 'Glutes', secondaryMuscles: ['Hamstrings', 'Core'], description: 'Glute dominant hip extension.', instructions: 'Upper back on bench, bar across hips, drive hips up to full extension, squeeze glutes at top.', difficulty: 'intermediate', equipment: 'Barbell' },
];

const GROUPS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Glutes'];
const diffBadge: Record<string, string> = { beginner: 'badge-green', intermediate: 'badge-yellow', advanced: 'badge-red' };

export default function ExerciseLibrary() {
    const [searchQuery, setSearchQuery] = useState('');
    const [group, setGroup] = useState('All');
    const [expanded, setExpanded] = useState<string | null>(null);

    const filtered = EXERCISES.filter(ex =>
        (group === 'All' || ex.muscleGroup === group) &&
        (ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <BookOpen size={20} style={{ color: 'var(--accent)' }} /> Library
            </h1>

            <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input input-icon" placeholder="Search exercises..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {GROUPS.map(g => (
                    <button key={g} onClick={() => setGroup(g)}
                        style={{
                            padding: '0.3rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.15s',
                            background: group === g ? 'var(--gradient-accent)' : 'var(--bg-card)',
                            border: group === g ? 'none' : '1px solid var(--border)',
                            color: group === g ? '#fff' : 'var(--text-secondary)',
                            boxShadow: group === g ? '0 2px 12px var(--accent-glow)' : 'none',
                        }}>
                        {g}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {filtered.map((ex, idx) => (
                    <div key={ex.id} className="card" style={{ overflow: 'hidden', animation: `float-up 0.25s ease ${idx * 0.025}s both` }}>
                        <div onClick={() => setExpanded(expanded === ex.id ? null : ex.id)}
                            style={{ padding: '0.875rem 1.125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 3 }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{ex.name}</span>
                                    <span className={`badge ${diffBadge[ex.difficulty] || 'badge-blue'}`}>{ex.difficulty}</span>
                                </div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                    {ex.muscleGroup}{ex.secondaryMuscles.length > 0 && ` · ${ex.secondaryMuscles.join(', ')}`}
                                    {ex.equipment !== 'None' && ` · ${ex.equipment}`}
                                </span>
                            </div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{expanded === ex.id ? '▲' : '▼'}</span>
                        </div>
                        {expanded === ex.id && (
                            <div style={{ borderTop: '1px solid var(--border)', padding: '0.875rem 1.125rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{ex.description}</p>
                                <div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.4rem' }}>How to perform</p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>{ex.instructions}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                        <BookOpen size={32} style={{ display: 'block', margin: '0 auto 10px', opacity: 0.3 }} />
                        <p>No exercises match your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

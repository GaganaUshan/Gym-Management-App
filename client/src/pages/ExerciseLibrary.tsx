import { useState, useEffect } from 'react';
import { BookOpen, Search } from 'lucide-react';
import api from '../lib/api';

interface Exercise { _id: string; name: string; muscleGroup: string; secondaryMuscles: string[]; description: string; instructions: string; difficulty: string; equipment: string; }

const GROUPS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Glutes'];
const diffBadge: Record<string, string> = { beginner: 'badge-green', intermediate: 'badge-yellow', advanced: 'badge-red' };

export default function ExerciseLibrary() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [group, setGroup] = useState('All');
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => { api.get('/api/exercises').then(r => setExercises(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);

    const filtered = exercises.filter(ex =>
        (group === 'All' || ex.muscleGroup === group) &&
        (ex.name.toLowerCase().includes(query.toLowerCase()) || ex.muscleGroup.toLowerCase().includes(query.toLowerCase()))
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <BookOpen size={20} style={{ color: 'var(--accent)' }} /> Library
            </h1>

            {/* Search */}
            <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input input-icon" placeholder="Search exercises..." value={query} onChange={e => setQuery(e.target.value)} />
            </div>

            {/* Filter chips */}
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

            {/* Exercise list */}
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton" style={{ height: 68 }} />)}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {filtered.map((ex, idx) => (
                        <div key={ex._id} className="card" style={{ overflow: 'hidden', animation: `float-up 0.25s ease ${idx * 0.025}s both` }}>
                            <div onClick={() => setExpanded(expanded === ex._id ? null : ex._id)}
                                style={{ padding: '0.875rem 1.125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 3 }}>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{ex.name}</span>
                                        <span className={`badge ${diffBadge[ex.difficulty] || 'badge-blue'}`}>{ex.difficulty}</span>
                                    </div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                        {ex.muscleGroup}{ex.secondaryMuscles.length > 0 && ` · ${ex.secondaryMuscles.join(', ')}`}
                                        {ex.equipment !== 'none' && ` · ${ex.equipment}`}
                                    </span>
                                </div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{expanded === ex._id ? '▲' : '▼'}</span>
                            </div>
                            {expanded === ex._id && (
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
            )}
        </div>
    );
}

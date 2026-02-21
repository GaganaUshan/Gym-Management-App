import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../lib/api';

interface Exercise { name: string; sets: number; reps: number; weight: number; }
interface Workout { _id: string; name: string; date: string; exercises: Exercise[]; durationMinutes?: number; notes?: string; }

export default function WorkoutLog() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/api/workouts').then(r => setWorkouts(r.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const deleteWorkout = async (id: string) => {
        if (!confirm('Delete this workout?')) return;
        await api.delete(`/api/workouts/${id}`);
        setWorkouts(prev => prev.filter(w => w._id !== id));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Workout Log
                </h1>
                <button className="btn-primary" onClick={() => navigate('/log/new')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', fontSize: '0.825rem' }}>
                    <Plus size={14} /> New
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 80 }} />)}
                </div>
            ) : workouts.length === 0 ? (
                <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                    <Dumbbell size={36} style={{ color: 'var(--text-muted)', display: 'block', margin: '0 auto 12px' }} />
                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 1rem' }}>No workouts logged yet</p>
                    <button className="btn-primary" onClick={() => navigate('/log/new')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.625rem 1.25rem' }}>
                        <Plus size={14} /> Log First Workout
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {workouts.map((w, idx) => (
                        <div key={w._id} className="card" style={{ overflow: 'hidden', animation: `float-up 0.3s ease ${idx * 0.04}s both` }}>
                            {/* Header row */}
                            <div onClick={() => setExpanded(expanded === w._id ? null : w._id)}
                                style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                    <div style={{
                                        width: 42, height: 42, borderRadius: 12,
                                        background: 'var(--accent-soft)', border: '1px solid rgba(59,130,246,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <Dumbbell size={18} style={{ color: 'var(--accent)' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{w.name}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.74rem', marginTop: 2 }}>
                                            {new Date(w.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
                                            {w.durationMinutes && <span style={{ color: 'var(--text-muted)' }}> · {w.durationMinutes}min</span>}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="badge badge-blue">{w.exercises.length} ex</span>
                                    <button onClick={e => { e.stopPropagation(); deleteWorkout(w._id); }}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6, display: 'flex', transition: 'color 0.2s' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
                                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                                        <Trash2 size={15} />
                                    </button>
                                    {expanded === w._id ? <ChevronUp size={15} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={15} style={{ color: 'var(--text-muted)' }} />}
                                </div>
                            </div>

                            {/* Expanded detail */}
                            {expanded === w._id && (
                                <div style={{ borderTop: '1px solid var(--border)', padding: '1rem 1.25rem' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                {['Exercise', 'Sets', 'Reps', 'kg'].map(h => (
                                                    <th key={h} style={{ textAlign: h === 'Exercise' ? 'left' : 'center', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', paddingBottom: '0.5rem' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {w.exercises.map((ex, i) => (
                                                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                                                    <td style={{ padding: '0.625rem 0', fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{ex.name}</td>
                                                    {[ex.sets, ex.reps, ex.weight || '—'].map((v, vi) => (
                                                        <td key={vi} style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', padding: '0.625rem 0' }}>{v}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {w.notes && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', marginTop: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>"{w.notes}"</p>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Plus, TrendingUp, Calendar, Zap, ChevronRight } from 'lucide-react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Workout {
    id: string;
    name: string;
    date: string;
    exercises: { name: string; sets: number; reps: number; weight: number }[];
    durationMinutes?: number;
}

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'workouts'),
            where('userId', '==', user.id),
            orderBy('date', 'desc'),
            limit(3)
        );
        getDocs(q)
            .then(snap => setRecentWorkouts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Workout))))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? '🌅 Good morning' : hour < 18 ? '☀️ Good afternoon' : '🌙 Good evening';
    const totalSets = recentWorkouts.reduce((s, w) => s + w.exercises.reduce((es, e) => es + e.sets, 0), 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Hero banner */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.15) 50%, rgba(7,11,20,0) 100%)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: 20,
                padding: '1.75rem',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: -40, right: -40,
                    width: 200, height: 200, borderRadius: '50%',
                    background: 'var(--accent)', filter: 'blur(60px)', opacity: 0.15,
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 0.35rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Flame size={13} /> {greeting}
                    </p>
                    <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
                        {user?.name?.split(' ')[0] ?? 'Athlete'} 💪
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 1.25rem' }}>
                        Stay consistent. Every rep compounds.
                    </p>
                    <button className="btn-primary" onClick={() => navigate('/log/new')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0.625rem 1.25rem', fontSize: '0.85rem' }}>
                        <Plus size={15} /> Log Workout
                    </button>
                </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {[
                    { label: 'Sessions', value: loading ? '—' : recentWorkouts.length },
                    { label: 'Total Sets', value: loading ? '—' : totalSets },
                    { label: 'Exercises', value: loading ? '—' : recentWorkouts.reduce((s, w) => s + w.exercises.length, 0) },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent workouts */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                    <h2 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Calendar size={16} style={{ color: 'var(--accent)' }} /> Recent Sessions
                    </h2>
                    <button onClick={() => navigate('/log')} style={{
                        background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.8rem',
                        fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3,
                    }}>
                        View all <ChevronRight size={13} />
                    </button>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 72 }} />)}
                    </div>
                ) : recentWorkouts.length === 0 ? (
                    <div className="card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                        <Zap size={32} style={{ color: 'var(--text-muted)', marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 1rem' }}>No workouts logged yet.</p>
                        <button className="btn-primary" onClick={() => navigate('/log/new')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', fontSize: '0.825rem' }}>
                            <Plus size={13} /> Start your first session
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {recentWorkouts.map((w, idx) => (
                            <div key={w.id} className="card card-hover"
                                style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: `float-up 0.3s ease ${idx * 0.06}s both` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 12,
                                        background: 'var(--accent-soft)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px solid rgba(59,130,246,0.2)',
                                    }}>
                                        <TrendingUp size={17} style={{ color: 'var(--accent)' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{w.name}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 2 }}>
                                            {new Date(w.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                                            {' · '}{w.exercises.length} exercise{w.exercises.length !== 1 ? 's' : ''}
                                            {w.durationMinutes && ` · ${w.durationMinutes}min`}
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

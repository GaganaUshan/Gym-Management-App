import { useState, useEffect } from 'react';
import { TrendingUp, Award, BarChart2, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

interface Workout { id: string; name: string; date: string; exercises: { name: string; sets: number; reps: number; weight: number }[]; durationMinutes?: number; }

const tooltipStyle = { backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--text-primary)' };
const tickStyle = { fill: '#3d4a66', fontSize: 11 };

export default function Progress() {
    const { user } = useAuth();
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'workouts'),
            where('userId', '==', user.id),
            orderBy('date', 'desc')
        );
        getDocs(q)
            .then(snap => setWorkouts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Workout))))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i));
        return { day: d.toLocaleDateString('en-GB', { weekday: 'short' }), count: workouts.filter(w => new Date(w.date).toDateString() === d.toDateString()).length };
    });

    const weeklyVolume = (() => {
        const map: Record<string, number> = {};
        workouts.forEach(w => {
            const d = new Date(w.date); const day = d.getDay() || 7;
            const mon = new Date(d); mon.setDate(d.getDate() - day + 1);
            const key = mon.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            map[key] = (map[key] || 0) + w.exercises.reduce((s, e) => s + e.sets * e.reps * (e.weight || 1), 0);
        });
        return Object.entries(map).map(([week, volume]) => ({ week, volume })).slice(-6);
    })();

    const prs = (() => {
        const map: Record<string, { maxWeight: number; maxSets: number }> = {};
        workouts.forEach(w => w.exercises.forEach(ex => {
            if (!map[ex.name]) map[ex.name] = { maxWeight: 0, maxSets: 0 };
            if (ex.weight > map[ex.name].maxWeight) map[ex.name].maxWeight = ex.weight;
            if (ex.sets > map[ex.name].maxSets) map[ex.name].maxSets = ex.sets;
        }));
        return Object.entries(map).map(([exercise, v]) => ({ exercise, ...v })).sort((a, b) => b.maxWeight - a.maxWeight).slice(0, 5);
    })();

    const totalVolume = workouts.reduce((s, w) => s + w.exercises.reduce((es, e) => es + e.sets * e.reps * (e.weight || 1), 0), 0);

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, gap: 12, color: 'var(--text-muted)' }}>
            <div style={{ width: 20, height: 20, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} className="animate-spin" /> Loading...
        </div>
    );

    if (workouts.length === 0) return (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <TrendingUp size={40} style={{ color: 'var(--text-muted)', display: 'block', margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>No data yet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Log workouts to see progress charts.</p>
        </div>
    );

    const sectionHead = (Icon: any, label: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
            <Icon size={15} style={{ color: 'var(--accent)' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{label}</span>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <TrendingUp size={20} style={{ color: 'var(--accent)' }} /> Progress
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {[
                    { label: 'Sessions', value: workouts.length },
                    { label: 'Volume (k)', value: `${Math.round(totalVolume / 1000)}k` },
                    { label: 'Exercises', value: [...new Set(workouts.flatMap(w => w.exercises.map(e => e.name)))].length },
                ].map(s => (
                    <div key={s.label} className="stat-card"><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
                ))}
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
                {sectionHead(BarChart2, 'This Week')}
                <ResponsiveContainer width="100%" height={130}>
                    <BarChart data={last7} barSize={22}>
                        <XAxis dataKey="day" tick={tickStyle} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
                        <Bar dataKey="count" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                        <defs>
                            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {weeklyVolume.length > 1 && (
                <div className="card" style={{ padding: '1.25rem' }}>
                    {sectionHead(TrendingUp, 'Weekly Volume')}
                    <ResponsiveContainer width="100%" height={130}>
                        <LineChart data={weeklyVolume}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="week" tick={tickStyle} axisLine={false} tickLine={false} />
                            <YAxis hide />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: 'var(--bg-base)' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {prs.length > 0 && (
                <div className="card" style={{ padding: '1.25rem' }}>
                    {sectionHead(Award, 'Personal Records')}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {prs.map((pr, i) => (
                            <div key={pr.exercise} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                                <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500 }}>{pr.exercise}</span>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    {pr.maxWeight > 0 && <span className="badge badge-blue">{pr.maxWeight}kg</span>}
                                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{pr.maxSets} sets</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="card-accent" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Zap size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                    Keep it up! Consistency is what separates the best from the rest.
                </p>
            </div>
        </div>
    );
}

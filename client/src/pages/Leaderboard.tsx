import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, Flame, Zap, TrendingUp, Medal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface LeaderEntry {
    userId: string;
    name: string;
    total: number;
    last7: number;
    score: number;
    uniqueDays: number;
}

const MEDAL_COLORS = ['#f59e0b', '#94a3b8', '#cd7c3a'];
const MEDAL_ICONS = ['🥇', '🥈', '🥉'];
const BAR_COLORS = ['#f59e0b', '#94a3b8', '#cd7c3a'];
const DEFAULT_BAR = '#3b82f6';

const tooltipStyle = {
    backgroundColor: '#0d1421',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    fontSize: 12,
    color: '#f0f4ff',
};

export default function Leaderboard() {
    const { user } = useAuth();
    const [data, setData] = useState<LeaderEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'chart' | 'list'>('chart');

    useEffect(() => {
        // Fetch ALL workouts (for leaderboard - all users)
        getDocs(collection(db, 'workouts'))
            .then(snap => {
                const workouts = snap.docs.map(d => d.data() as { userId: string; userName?: string; date: string; exercises: any[] });
                const now = new Date();
                const ms7 = 7 * 24 * 60 * 60 * 1000;
                const ms30 = 30 * 24 * 60 * 60 * 1000;

                // Group by userId
                const userMap: Record<string, { name: string; workouts: typeof workouts }> = {};
                workouts.forEach(w => {
                    if (!userMap[w.userId]) userMap[w.userId] = { name: w.userName || 'Athlete', workouts: [] };
                    userMap[w.userId].workouts.push(w);
                });

                // Compute scores
                const entries: LeaderEntry[] = Object.entries(userMap).map(([uid, { name, workouts: uws }]) => {
                    const total = uws.length;
                    const last7 = uws.filter(w => now.getTime() - new Date(w.date).getTime() <= ms7).length;
                    const last30 = uws.filter(w => now.getTime() - new Date(w.date).getTime() <= ms30).length;
                    const uniqueDays = new Set(uws.map(w => w.date.slice(0, 10))).size;
                    const score = total * 2 + last7 * 5 + last30 * 3 + uniqueDays;
                    return { userId: uid, name, total, last7, score, uniqueDays };
                });

                setData(entries.sort((a, b) => b.score - a.score));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const myRank = data.findIndex(d => d.userId === user?.id) + 1;
    const top3 = data.slice(0, 3);
    const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
    const podiumHeights = top3.length >= 3 ? [75, 100, 55] : [100];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Trophy size={20} style={{ color: '#f59e0b' }} /> Leaderboard
                </h1>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, padding: 3 }}>
                    {(['chart', 'list'] as const).map(v => (
                        <button key={v} onClick={() => setView(v)} style={{
                            padding: '0.35rem 0.75rem', borderRadius: 7, border: 'none', cursor: 'pointer',
                            fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.15s',
                            background: view === v ? 'var(--gradient-accent)' : 'transparent',
                            color: view === v ? '#fff' : 'var(--text-muted)',
                        }}>
                            {v === 'chart' ? '📊 Chart' : '📋 List'}
                        </button>
                    ))}
                </div>
            </div>

            {/* My rank banner */}
            {!loading && myRank > 0 && (
                <div style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.1) 100%)',
                    border: '1px solid rgba(59,130,246,0.25)',
                    borderRadius: 14, padding: '0.875rem 1.125rem',
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                }}>
                    <div style={{ fontSize: '1.5rem' }}>{myRank <= 3 ? MEDAL_ICONS[myRank - 1] : `#${myRank}`}</div>
                    <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>You are ranked #{myRank}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                            Score: {data[myRank - 1]?.score ?? 0} · {data[myRank - 1]?.total ?? 0} sessions logged
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 64 }} />)}
                </div>
            ) : data.length === 0 ? (
                <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                    <Trophy size={36} style={{ color: 'var(--text-muted)', display: 'block', margin: '0 auto 12px', opacity: 0.3 }} />
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No users to rank yet. Start logging!</p>
                </div>
            ) : view === 'chart' ? (
                <>
                    {top3.length >= 2 && (
                        <div className="card" style={{ padding: '1.5rem 1.25rem 1rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 1.25rem', textAlign: 'center' }}>
                                <Medal size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />Top Athletes
                            </p>
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                                {podiumOrder.map((entry, i) => {
                                    const origRank = top3.indexOf(entry);
                                    const h = podiumHeights[i];
                                    const isMe = entry?.userId === user?.id;
                                    return entry ? (
                                        <div key={entry.userId} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: 110 }}>
                                            <div style={{
                                                background: isMe ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.06)',
                                                border: isMe ? 'none' : '1px solid var(--border)',
                                                borderRadius: 999, padding: '0.2rem 0.625rem', marginBottom: 6,
                                                fontSize: '0.72rem', fontWeight: 700,
                                                color: isMe ? '#fff' : 'var(--text-secondary)',
                                                boxShadow: isMe ? '0 2px 10px var(--accent-glow)' : 'none',
                                                maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                            }}>
                                                {entry.name.split(' ')[0]}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: MEDAL_COLORS[origRank] ?? 'var(--text-secondary)', marginBottom: 4 }}>
                                                {entry.score}pts
                                            </div>
                                            <div style={{
                                                width: '100%', height: h, borderRadius: '8px 8px 0 0',
                                                background: origRank < 3
                                                    ? `linear-gradient(180deg, ${MEDAL_COLORS[origRank]}33 0%, ${MEDAL_COLORS[origRank]}11 100%)`
                                                    : 'rgba(255,255,255,0.05)',
                                                border: `1px solid ${origRank < 3 ? MEDAL_COLORS[origRank] : 'var(--border)'}33`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.4rem',
                                            }}>
                                                {MEDAL_ICONS[origRank]}
                                            </div>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                            <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }} />
                        </div>
                    )}

                    {data.length > 0 && (
                        <div className="card" style={{ padding: '1.25rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <TrendingUp size={11} /> Consistency Scores
                            </p>
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={data} barSize={28} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" tick={{ fill: '#3d4a66', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={n => n.split(' ')[0]} />
                                    <YAxis tick={{ fill: '#3d4a66', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} formatter={(val: number | undefined) => [`${val ?? 0} pts`, '']} labelFormatter={() => ''} />
                                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                                        {data.map((entry, index) => (
                                            <Cell key={entry.userId} fill={entry.userId === user?.id ? 'url(#myGrad)' : index < 3 ? BAR_COLORS[index] : DEFAULT_BAR} opacity={index < 3 ? 1 : 0.6} />
                                        ))}
                                    </Bar>
                                    <defs>
                                        <linearGradient id="myGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {data.map((entry, idx) => {
                        const isMe = entry.userId === user?.id;
                        const rank = idx + 1;
                        const maxScore = data[0]?.score || 1;
                        return (
                            <div key={entry.userId} className={`card ${isMe ? '' : 'card-hover'}`}
                                style={{
                                    padding: '0.875rem 1.125rem',
                                    border: isMe ? '1px solid rgba(59,130,246,0.4)' : undefined,
                                    background: isMe ? 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.06) 100%)' : undefined,
                                    animation: `float-up 0.25s ease ${idx * 0.03}s both`,
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                    <div style={{ width: 32, textAlign: 'center', flexShrink: 0 }}>
                                        {rank <= 3
                                            ? <span style={{ fontSize: '1.2rem' }}>{MEDAL_ICONS[rank - 1]}</span>
                                            : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700 }}>#{rank}</span>
                                        }
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <span style={{ fontWeight: isMe ? 700 : 600, color: isMe ? 'var(--accent)' : 'var(--text-primary)', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {entry.name}{isMe && ' (You)'}
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{entry.total} sessions</span>
                                                {entry.last7 > 0 && (
                                                    <span className="badge badge-green" style={{ fontSize: '0.62rem' }}>
                                                        <Flame size={8} style={{ marginRight: 2 }} /> {entry.last7} this week
                                                    </span>
                                                )}
                                                <span style={{ fontWeight: 700, color: rank <= 3 ? MEDAL_COLORS[rank - 1] : 'var(--accent)', fontSize: '0.85rem', minWidth: 48, textAlign: 'right' }}>
                                                    {entry.score}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${(entry.score / maxScore) * 100}%`, background: rank <= 3 ? `linear-gradient(90deg, ${MEDAL_COLORS[rank - 1]}, ${MEDAL_COLORS[rank - 1]}88)` : 'var(--gradient-accent)' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="card-accent" style={{ padding: '0.875rem 1.125rem', display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <Zap size={14} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0, lineHeight: 1.6 }}>
                    Score = total sessions ×2 + last 7 days ×5 + last 30 days ×3 + unique training days. Log consistently to climb the ranks!
                </p>
            </div>
        </div>
    );
}

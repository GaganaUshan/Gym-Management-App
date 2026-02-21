import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, ArrowLeft, Save, ChevronDown } from 'lucide-react';
import api from '../lib/api';

interface ExerciseRow { name: string; sets: number; reps: number; weight: number; }
const emptyRow = (): ExerciseRow => ({ name: '', sets: 3, reps: 10, weight: 0 });

const fieldConfig = [
    { key: 'sets' as const, label: 'Sets' },
    { key: 'reps' as const, label: 'Reps' },
    { key: 'weight' as const, label: 'kg' },
];

export default function NewWorkout() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');
    const [exercises, setExercises] = useState<ExerciseRow[]>([emptyRow()]);
    const [libraryNames, setLibraryNames] = useState<string[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get('/api/exercises').then(r => setLibraryNames(r.data.map((e: any) => e.name)));
    }, []);

    const updateRow = (idx: number, field: keyof ExerciseRow, value: string | number) =>
        setExercises(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));

    const handleSave = async () => {
        const valid = exercises.filter(e => e.name.trim());
        if (!valid.length) { alert('Add at least one exercise'); return; }
        setSaving(true);
        try {
            await api.post('/api/workouts', { name: name || 'My Workout', date, exercises: valid, durationMinutes: duration ? Number(duration) : undefined, notes });
            navigate('/log');
        } catch { alert('Failed to save workout.'); } finally { setSaving(false); }
    };

    const labelStyle = { color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: 6 };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-secondary)', padding: '0.5rem', cursor: 'pointer', display: 'flex' }}>
                    <ArrowLeft size={17} />
                </button>
                <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>New Workout</h1>
            </div>

            {/* Meta info card */}
            <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={labelStyle}>Workout Name</label>
                    <input className="input" placeholder="e.g. Push Day, Leg Day..." value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                        <label style={labelStyle}>Date</label>
                        <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                    <div>
                        <label style={labelStyle}>Duration (min)</label>
                        <input className="input" type="number" placeholder="60" value={duration} onChange={e => setDuration(e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Exercises */}
            <div>
                <h2 className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.75rem' }}>Exercises</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {exercises.map((ex, idx) => {
                        const filtered = libraryNames.filter(n => n.toLowerCase().includes(ex.name.toLowerCase())).slice(0, 8);
                        return (
                            <div key={idx} className="card" style={{ padding: '1rem' }}>
                                {/* Name input with dropdown */}
                                <div style={{ position: 'relative', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        <input className="input" placeholder="Exercise name"
                                            value={ex.name}
                                            onChange={e => { updateRow(idx, 'name', e.target.value); setActiveDropdown(idx); }}
                                            onFocus={() => setActiveDropdown(idx)}
                                            onBlur={() => setTimeout(() => setActiveDropdown(null), 150)}
                                            style={{ paddingRight: '2rem' }}
                                        />
                                        <ChevronDown size={13} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                        {activeDropdown === idx && filtered.length > 0 && (
                                            <div style={{
                                                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                                                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                                                borderRadius: 10, marginTop: 4, maxHeight: 200, overflowY: 'auto',
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                                            }}>
                                                {filtered.map(n => (
                                                    <button key={n} onMouseDown={() => { updateRow(idx, 'name', n); setActiveDropdown(null); }}
                                                        style={{ width: '100%', textAlign: 'left', padding: '0.625rem 0.875rem', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.15s' }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-soft)'; e.currentTarget.style.color = 'var(--accent)'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                                                        {n}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {exercises.length > 1 && (
                                        <button onClick={() => setExercises(p => p.filter((_, i) => i !== idx))}
                                            style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, color: 'var(--danger)', cursor: 'pointer', padding: '0 0.625rem', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                                {/* Set/Rep/Weight */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                    {fieldConfig.map(({ key, label }) => (
                                        <div key={key}>
                                            <label style={{ ...labelStyle, textAlign: 'center' }}>{label}</label>
                                            <input className="input" type="number" min="0" value={ex[key]}
                                                onChange={e => updateRow(idx, key, Number(e.target.value))}
                                                style={{ textAlign: 'center' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    <button onClick={() => setExercises(p => [...p, emptyRow()])}
                        style={{ width: '100%', padding: '0.875rem', background: 'none', border: '1px dashed var(--border)', borderRadius: 12, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                        <Plus size={15} /> Add Exercise
                    </button>
                </div>
            </div>

            {/* Notes */}
            <div className="card" style={{ padding: '1.25rem' }}>
                <label style={labelStyle}>Session Notes</label>
                <textarea className="input" placeholder="How did it feel? Any PRs?" value={notes} onChange={e => setNotes(e.target.value)} rows={3} style={{ resize: 'none' }} />
            </div>

            <button className="btn-primary" onClick={handleSave} disabled={saving}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.875rem', fontSize: '0.95rem' }}>
                {saving ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Workout</>}
            </button>
        </div>
    );
}

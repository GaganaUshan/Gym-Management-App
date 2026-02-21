import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Dumbbell, LogOut, CheckCircle, User, Star } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '../lib/firebase';

const GOALS = ['Build Muscle', 'Lose Fat', 'Increase Strength', 'General Fitness', 'Improve Endurance'];

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState(user?.name || '');
    const [goal, setGoal] = useState('Build Muscle');
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!user || !auth.currentUser) return;
        setSaving(true);
        try {
            await updateProfile(auth.currentUser, { displayName });
            await setDoc(doc(db, 'users', user.id), { name: displayName, goal }, { merge: true });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => { await logout(); navigate('/'); };

    const labelStyle = { color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: 6 };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <User size={20} style={{ color: 'var(--accent)' }} /> Profile
            </h1>

            {/* Avatar card */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.08) 100%)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: 20, padding: '1.5rem',
                display: 'flex', alignItems: 'center', gap: '1.25rem',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: 'var(--accent)', filter: 'blur(60px)', opacity: 0.12 }} />
                <div style={{
                    width: 64, height: 64, borderRadius: 18,
                    background: 'var(--gradient-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px var(--accent-glow)', flexShrink: 0,
                    fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif',
                }}>
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ position: 'relative' }}>
                    <div className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{user?.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 3 }}>
                        <Mail size={12} /> {user?.email}
                    </div>
                </div>
            </div>

            {/* Settings */}
            <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.25rem' }}>
                    <User size={14} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Personal Details</span>
                </div>

                <div>
                    <label style={labelStyle}>Display Name</label>
                    <input className="input" type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} />
                </div>

                <div>
                    <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Star size={10} /> Fitness Goal
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {GOALS.map(g => (
                            <button key={g} onClick={() => setGoal(g)} style={{
                                padding: '0.625rem 0.75rem', borderRadius: 10, border: 'none',
                                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, textAlign: 'left' as const, transition: 'all 0.15s',
                                background: goal === g ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.04)',
                                color: goal === g ? '#fff' : 'var(--text-secondary)',
                                boxShadow: goal === g ? '0 2px 12px var(--accent-glow)' : 'none',
                                outline: goal !== g ? '1px solid var(--border)' : 'none',
                            }}>
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={handleSave} disabled={saving} className={saved ? '' : 'btn-primary'}
                    style={saved ? {
                        width: '100%', padding: '0.75rem', borderRadius: 10, background: 'rgba(16,185,129,0.15)',
                        border: '1px solid rgba(16,185,129,0.3)', color: 'var(--success)', fontWeight: 600, fontSize: '0.875rem',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    } : {
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    }}>
                    {saved ? <><CheckCircle size={15} /> Changes Saved</> : <><Dumbbell size={15} /> {saving ? 'Saving...' : 'Save Changes'}</>}
                </button>
            </div>

            {/* App info */}
            <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {[{ label: 'App', value: 'Horizon Performance' }, { label: 'Version', value: '1.0.0' }, { label: 'Build', value: 'Feb 2026' }].map(item => (
                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.label}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logout */}
            <button onClick={handleLogout} className="btn-danger" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <LogOut size={15} /> Sign Out
            </button>
        </div>
    );
}

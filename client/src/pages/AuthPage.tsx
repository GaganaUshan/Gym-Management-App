import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, Dumbbell, Zap } from 'lucide-react';

function getFirebaseError(code: string): string {
    switch (code) {
        case 'auth/email-already-in-use': return 'An account with this email already exists.';
        case 'auth/invalid-email': return 'Please enter a valid email address.';
        case 'auth/weak-password': return 'Password must be at least 6 characters.';
        case 'auth/user-not-found': return 'No account found with this email.';
        case 'auth/wrong-password': return 'Incorrect password. Please try again.';
        case 'auth/invalid-credential': return 'Invalid email or password.';
        case 'auth/too-many-requests': return 'Too many failed attempts. Please try again later.';
        default: return 'Something went wrong. Please try again.';
    }
}

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
                await register(name, email, password);
            }
            navigate('/dashboard');
        } catch (err: any) {
            setError(getFirebaseError(err?.code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background orbs */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', width: 500, height: 500, borderRadius: '50%',
                    background: 'var(--accent)', filter: 'blur(120px)', opacity: 0.1,
                    top: -150, right: -150,
                }} />
                <div style={{
                    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                    background: 'var(--accent-2)', filter: 'blur(100px)', opacity: 0.08,
                    bottom: -100, left: -100,
                }} />
            </div>

            <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 72, height: 72, borderRadius: 20,
                        background: 'var(--gradient-accent)',
                        boxShadow: '0 8px 32px var(--accent-glow)',
                        marginBottom: '1.25rem',
                    }}>
                        <Dumbbell size={34} color="#fff" />
                    </div>
                    <h1 className="font-display" style={{
                        fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)',
                        margin: '0 0 0.5rem',
                        background: 'var(--gradient-accent)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Horizon
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                        Performance-driven gym tracking
                    </p>
                </div>

                {/* Card */}
                <div className="card" style={{ padding: '2rem' }}>
                    {/* Tabs */}
                    <div style={{
                        display: 'flex', background: 'rgba(255,255,255,0.04)',
                        borderRadius: 10, padding: 4, marginBottom: '1.5rem',
                        border: '1px solid var(--border)',
                    }}>
                        {['Sign In', 'Create Account'].map((tab, i) => (
                            <button
                                key={tab}
                                onClick={() => { setIsLogin(i === 0); setError(''); }}
                                style={{
                                    flex: 1, padding: '0.6rem', borderRadius: 8, border: 'none',
                                    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: (i === 0) === isLogin ? 'var(--gradient-accent)' : 'transparent',
                                    color: (i === 0) === isLogin ? '#fff' : 'var(--text-secondary)',
                                    boxShadow: (i === 0) === isLogin ? '0 2px 12px var(--accent-glow)' : 'none',
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)',
                            borderRadius: 10, padding: '0.75rem 1rem',
                            color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem',
                        }}>
                            <AlertCircle size={15} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {!isLogin && (
                            <div style={{ position: 'relative' }}>
                                <User size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)}
                                    className="input input-icon" />
                            </div>
                        )}
                        <div style={{ position: 'relative' }}>
                            <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
                                required className="input input-icon" />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                                required minLength={6} className="input input-icon" />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary"
                            style={{ width: '100%', marginTop: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            {loading ? (
                                <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} className="animate-spin" /> Please wait...</>
                            ) : (
                                <><Zap size={15} /> {isLogin ? 'Sign In' : 'Create Account'}</>
                            )}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1.5rem' }}>
                    Horizon Performance · Track every rep.
                </p>
            </div>
        </div>
    );
}

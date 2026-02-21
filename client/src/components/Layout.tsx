import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, BookOpen, TrendingUp, User, LogOut, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/log', icon: Dumbbell, label: 'Log' },
    { to: '/library', icon: BookOpen, label: 'Library' },
    { to: '/progress', icon: TrendingUp, label: 'Progress' },
    { to: '/leaderboard', icon: Trophy, label: 'Ranks' },
    { to: '/profile', icon: User, label: 'Profile' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', position: 'relative' }}>
            {/* Glow orbs */}
            <div className="bg-orbs">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
            </div>

            {/* Top header */}
            <header className="top-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: 'var(--gradient-accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--shadow-glow)',
                    }}>
                        <Dumbbell size={16} color="#fff" strokeWidth={2.5} />
                    </div>
                    <span className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Horizon
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {user?.name && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'none' }}
                            className="sm-show">{user.name}</span>
                    )}
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', borderRadius: '6px', display: 'flex', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                        title="Sign out"
                    >
                        <LogOut size={17} />
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main style={{ position: 'relative', zIndex: 1 }}>
                <div className="page-container">
                    {children}
                </div>
            </main>

            {/* Bottom nav */}
            <nav className="bottom-nav">
                <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: 480, margin: '0 auto', padding: '0 0.5rem' }}>
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink key={to} to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                            <Icon size={19} strokeWidth={1.8} />
                            {label}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
}

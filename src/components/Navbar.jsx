import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar" style={{
            width: '100%',
            padding: '1.5rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'transparent',
            zIndex: 100
        }}>
            <Link to="/" className="nav-brand" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                color: 'inherit'
            }}>
                <div className="nav-icon" style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: 'var(--text-color)',
                    mask: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>') no-repeat center`,
                    WebkitMask: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>') no-repeat center`,
                    transition: 'background-color 0.3s ease'
                }} />
                <span className="nav-text" style={{
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    letterSpacing: '-0.05em'
                }}>lua.pw</span>
            </Link>

            <div className="nav-actions" style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
            }}>
                <button onClick={toggleTheme} className="nav-btn btn-base">
                    {theme === 'dark' ? 'Light' : 'Dark'}
                </button>

                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" className="nav-btn btn-base hidden sm:inline-flex">
                            <LayoutDashboard size={14} style={{ marginRight: '8px' }} /> Dashboard
                        </Link>
                        <button onClick={handleLogout} className="nav-btn btn-base btn-primary">
                            <LogOut size={14} />
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="nav-btn btn-base btn-primary">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;


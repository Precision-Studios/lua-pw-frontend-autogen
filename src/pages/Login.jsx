import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Github } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/oauth2/authorization/google';
    };

    const handleGithubLogin = () => {
        window.location.href = 'http://localhost:5000/oauth2/authorization/github';
    };

    const inputStyle = {
        width: '100%',
        background: 'var(--input-bg)',
        border: '2px solid var(--border-color)',
        color: 'var(--text-color)',
        padding: '1rem',
        fontSize: '1rem',
        fontWeight: 400,
        borderRadius: 35,
        outline: 'none',
        fontFamily: 'inherit',
        marginBottom: '1rem',
        transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        textAlign: 'left'
    };

    return (
        <Layout>
            <div className="main-wrapper" style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}>
                <div className="container" style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>

                    {/* Title Section matching Home.jsx style */}
                    <h1 style={{
                        fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.05em',
                        marginBottom: '2rem',
                        lineHeight: 0.9,
                        transition: 'color 0.3s ease'
                    }}>
                        Login
                    </h1>
                    <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-color)',
                        opacity: 0.6,
                        fontWeight: 400,
                        letterSpacing: '0.3em',
                        marginBottom: '3rem',
                        textTransform: 'uppercase',
                        transition: 'color 0.3s ease'
                    }}>
                        Welcome Back
                    </p>

                    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                        {error && (
                            <div style={{
                                marginBottom: '1.5rem',
                                padding: '0.75rem',
                                background: '#ffe5e5',
                                border: '2px solid #ff0000',
                                color: '#ff0000',
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                textAlign: 'left'
                            }}>
                                ! {error}
                            </div>
                        )}

                        <div>
                            <label style={labelStyle}>Email / ID</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="ENTER EMAIL OR ID"
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                a
                                style={inputStyle}
                            />
                        </div>

                        <Button
                            type="submit"
                            isLoading={loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 0,
                                fontSize: '1rem',
                                marginTop: '0.5rem'
                            }}
                            className="action-btn"
                        >
                            Login
                        </Button>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            margin: '2rem 0',
                            opacity: 0.5
                        }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                            <span style={{
                                padding: '0 1rem',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}>
                                Or
                            </span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    background: 'white',
                                    color: 'black',
                                    border: '1px solid var(--border-color)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    width: '100%',
                                    fontFamily: 'inherit'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24-1.19-2.6z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Login with Google
                            </button>

                            <button
                                type="button"
                                onClick={handleGithubLogin}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    background: '#24292F',
                                    color: 'white',
                                    border: '1px solid transparent',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    width: '100%',
                                    fontFamily: 'inherit'
                                }}
                            >
                                <Github size={20} />
                                Login with GitHub
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Login;

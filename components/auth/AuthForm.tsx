'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Chrome, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { LiquidGlass } from '@liquidglass/react';
import { authApi } from '@/lib/api';
import './AuthForm.css';

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    //todo fix hardcoded value from api.ts
    const handleOAuth = (provider: 'google' | 'github') => {
        window.location.href = `http://localhost:5000/oauth2/authorization/${provider}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await authApi.login({
                idOrEmailIdentifier: email,
                userPassword: password,
            });
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Login failed:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container animate-in" style={{ padding: 0 }}>
            <LiquidGlass
                borderRadius={16}
                blur={1}              // Increased significantly (from 2) for real frosting
                contrast={1.3}        // Slight pop
                brightness={1.05}       // Brightens background (classic glass look)
                saturation={1.1}       // Boosts colors behind the glass
                displacementScale={2} // High value makes the "liquid" distortion visible
                elasticity={0.6}       // Adds the "jelly" feel on mouse movement
                shadowIntensity={0.25}
            >
                <div style={{ padding: '2.5rem' }}>
                    <div className="auth-header space-y-3">
                        <h2 className="auth-title">
                            {isLogin ? 'Welcome Back' : 'Join LUA.PW'}
                        </h2>
                        <p className="auth-subtitle">
                            {isLogin
                                ? 'Enter your credentials to access your account'
                                : 'Sign up via Google/GitHub to get started'}
                        </p>
                    </div>

                    {isLogin ? (
                        <form onSubmit={handleSubmit} className="auth-form">
                            {error && (
                                <div className="error-message flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm mb-4">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                            <div className="input-group">
                                <label className="input-label">UserId or Email</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="auth-input"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" />
                                    <input
                                        type="password"
                                        placeholder="Your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="auth-input"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="submit-button"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    ) : (
                        <div className="oauth-signup-notice">
                            <p className="auth-subtitle leading-relaxed">
                                Please sign up using Google or GitHub SSO.
                                <br />
                                We don't support manual email registrations.
                            </p>
                        </div>
                    )}

                    <div className="divider">
                        <div className="divider-line">
                            <div className="divider-line-inner"></div>
                        </div>
                        <div className="divider-text-container">
                            <span className="divider-text">Or continue with</span>
                        </div>
                    </div>

                    <div className="oauth-grid">
                        <button
                            onClick={() => handleOAuth('google')}
                            className="oauth-button"
                        >
                            <Chrome className="w-5 h-5" />
                            <span className="oauth-button-text">Google</span>
                        </button>
                        <button
                            onClick={() => handleOAuth('github')}
                            className="oauth-button"
                        >
                            <Github className="w-5 h-5" />
                            <span className="oauth-button-text">GitHub</span>
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="toggle-auth-button"
                        >
                            {isLogin
                                ? "Don't have an account? Sign up via OAuth"
                                : "Already have an account? Sign In"}
                        </button>
                    </div>
                </div>
            </LiquidGlass>
        </div>
    );
}

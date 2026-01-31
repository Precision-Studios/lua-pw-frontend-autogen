'use client';

import { useState } from 'react';
import { Github, Chrome, Lock, User, ArrowRight } from 'lucide-react';
import { LiquidGlass } from '@liquidglass/react';
import './AuthForm.css';

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //todo fix hardcoded value from api.ts
    const handleOAuth = (provider: 'google' | 'github') => {
        window.location.href = `http://localhost:5000/oauth2/authorization/${provider}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = '/dashboard';
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
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="submit-button"
                            >
                                Sign In
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

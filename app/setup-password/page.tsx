'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import LogoSection from '@/components/layout/LogoSection';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import './SetupPassword.css';

export default function SetupPassword() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if user has already completed setup
        const checkStatus = async () => {
            try {
                const response = await axios.get('/api/v1/user/details');
                if (response.data && response.data.setupComplete) {
                    router.push('/dashboard');
                }
            } catch (err) {
                // If 401, they might need to login or refresh.
                // For now, if we can't check, we let them stay or redirect to login.
                // Ideally the global interceptor handles 401s.
                console.error("Failed to check user status", err);
            }
        };
        checkStatus();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 12) {
            setError('Password must be at least 12 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await axios.post('/api/v1/user/update', {
                newPassword: password
            });
            // On success, redirect to dashboard
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="setup-container">
            {/* Left Section - Hero/Logo (Visible on desktop) */}
            <section className="setup-hero-section">
                <LogoSection />
            </section>

            {/* Right Section - Form */}
            <section className="setup-form-section">
                <div className="setup-card animate-in">
                    <div className="setup-header">
                        <h2 className="setup-title">Secure Your Account</h2>
                        <p className="setup-subtitle">
                            Please set a password to complete your registration.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="setup-form">
                        <div className="setup-input-group">
                            <label className="setup-input-label">New Password</label>
                            <div className="setup-input-wrapper">
                                <Lock className="setup-input-icon" />
                                <input
                                    type="password"
                                    placeholder="Minimum 12 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="setup-input"
                                    required
                                    minLength={12}
                                />
                            </div>
                        </div>

                        <div className="setup-input-group">
                            <label className="setup-input-label">Confirm Password</label>
                            <div className="setup-input-wrapper">
                                <ShieldCheck className="setup-input-icon" />
                                <input
                                    type="password"
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="setup-input"
                                    required
                                />
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button
                            type="submit"
                            className="setup-submit-button"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Set Password'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}

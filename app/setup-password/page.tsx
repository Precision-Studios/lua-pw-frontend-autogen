'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, userApi } from '@/lib/api';
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
                // Use userApi.details() which uses the configured baseURL
                const response = await userApi.details();
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
            // Use authApi.updateUser (which we should double check exists in lib/api or add it)
            // Checking lib/api.ts - we added updateUser in step 55
            await authApi.updateUser({
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
        <main className="main-container">
            {/* Left Section - Hero/Logo (Visible on desktop) */}
            <section className="hero-section">
                <LogoSection />
            </section>

            {/* Mobile Header (Visible on mobile only) */}
            <div className="mobile-header">
                <h1 className="mobile-title">
                    LUA<span>.PW</span>
                </h1>
            </div>

            {/* Right Section - Form */}
            <section className="setup-form-section">
                <div className="setup-card">
                    <div className="setup-header">
                        <h1 className="setup-title">Secure Your Account</h1>
                        <p className="setup-subtitle">
                            Please set a password to complete your registration.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="setup-form">
                        <div className="setup-input-group">
                            <label htmlFor="new-password" title="Set a new password" className="setup-input-label">New Password</label>
                            <div className="setup-input-wrapper">
                                <Lock aria-hidden="true" className="setup-input-icon" />
                                <input
                                    id="new-password"
                                    type="password"
                                    placeholder="Minimum 12 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="setup-input"
                                    required
                                    minLength={12}
                                    aria-required="true"
                                    aria-invalid={error?.includes('match') || error?.includes('12') ? 'true' : 'false'}
                                    aria-describedby={error ? "setup-error" : undefined}
                                />
                            </div>
                        </div>

                        <div className="setup-input-group">
                            <label htmlFor="confirm-password" title="Confirm your new password" className="setup-input-label">Confirm Password</label>
                            <div className="setup-input-wrapper">
                                <ShieldCheck aria-hidden="true" className="setup-input-icon" />
                                <input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="setup-input"
                                    required
                                    aria-required="true"
                                    aria-invalid={error?.includes('match') ? 'true' : 'false'}
                                    aria-describedby={error ? "setup-error" : undefined}
                                />
                            </div>
                        </div>

                        {error && (
                            <div
                                id="setup-error"
                                className="error-message"
                                role="alert"
                                aria-live="polite"
                            >
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="setup-submit-button"
                            disabled={loading}
                            aria-busy={loading}
                        >
                            {loading ? (
                                <span aria-label="Updating password...">Updating...</span>
                            ) : (
                                <>
                                    <span>Set Password</span>
                                    <ArrowRight aria-hidden="true" className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>

            {/* Project & Photo Attribution */}
            <div className="attribution-container">
                <span>Made with ❤️ by <a href="https://precisionstudios.tech/" target="_blank" rel="noopener noreferrer">Precision Studios</a></span>
                <span className="opacity-30">|</span>
                <span>Photo by <a href="https://unsplash.com/@asoggetti?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Alessio Soggetti</a> on <a href="https://unsplash.com/photos/snow-covered-mountain-17_tB-oI0ao?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></span>
            </div>
        </main>
    );
}

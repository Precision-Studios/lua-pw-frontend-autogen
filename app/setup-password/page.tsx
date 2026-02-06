'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, userApi } from '@/lib/api';
import LogoSection from '@/components/layout/LogoSection';
import LoadingAtom from '@/components/common/LoadingAtom';
import { Lock, ArrowRight, ShieldCheck, LogOut, Check, X } from 'lucide-react';
import './SetupPassword.css';

export default function SetupPassword() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
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

    const rules = [
        { id: 'length', label: 'At least 12 characters', isValid: password.length >= 12 },
        { id: 'uppercase', label: 'At least one uppercase letter', isValid: /[A-Z]/.test(password) },
        { id: 'lowercase', label: 'At least one lowercase letter', isValid: /[a-z]/.test(password) },
        { id: 'number', label: 'At least one number', isValid: /[0-9]/.test(password) },
        { id: 'special', label: 'At least one special character', isValid: /[^A-Za-z0-9]/.test(password) },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate all rules
        const firstInvalidRule = rules.find(rule => !rule.isValid);
        if (firstInvalidRule) {
            setError(`Password does not meet requirements: ${firstInvalidRule.label}`);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Use authApi.updateUser
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

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authApi.logout();
            router.push('/');
        } catch (error) {
            console.error("Logout failed", error);
            router.push('/');
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
                <div className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 rounded-[2rem] p-10">
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

                        {/* Password Rules */}
                        <div className="password-rules-container">
                            <p className="rules-label">Password Requirements:</p>
                            <div className="rules-list">
                                {rules.map((rule) => (
                                    <div
                                        key={rule.id}
                                        className={`rule-item ${rule.isValid ? 'valid' : 'invalid'}`}
                                    >
                                        <div className="rule-icon-wrapper">
                                            {rule.isValid ? (
                                                <Check size={12} className="rule-icon check" />
                                            ) : (
                                                <div className="rule-icon-placeholder" />
                                            )}
                                        </div>
                                        <span className="rule-text">{rule.label}</span>
                                    </div>
                                ))}
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

                <button
                    type="button"
                    onClick={handleLogout}
                    className="setup-logout-button"
                    disabled={isLoggingOut}
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </section>

            {isLoggingOut && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070b24]">
                    <LoadingAtom title="Signing Out" subtitle="Cleaning up session" />
                </div>
            )}

            {/* Project & Photo Attribution */}
            <div className="attribution-container">
                <span>Made with ❤️ by <a href="https://precisionstudios.tech/" target="_blank" rel="noopener noreferrer">Precision Studios</a></span>
                <span className="opacity-30">|</span>
                <span>Photo by <a href="https://unsplash.com/@asoggetti?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Alessio Soggetti</a> on <a href="https://unsplash.com/photos/snow-covered-mountain-17_tB-oI0ao?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></span>
            </div>
        </main>
    );
}

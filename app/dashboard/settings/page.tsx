'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, KeyRound, Eye, EyeOff, Loader2, Shield, Calendar, Mail, Hash } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useUser } from '@/lib/UserContext';
import Toast, { ToastType } from '@/components/common/Toast';
import LoadingAtom from '@/components/common/LoadingAtom';
import Card from '@/components/common/Card';

interface ToastState {
    message: string;
    type: ToastType;
}

export default function SettingsPage() {
    const router = useRouter();
    const { user, loading } = useUser();
    const [toast, setToast] = useState<ToastState | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Password Update State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const validatePassword = (): boolean => {
        if (!newPassword) {
            setError('Password is required');
            return false;
        }
        if (newPassword.length < 12) {
            setError('Password must be at least 12 characters');
            return false;
        }
        if (newPassword.length > 16) {
            setError('Password must not exceed 16 characters');
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        setError('');
        return true;
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePassword()) {
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await authApi.updateUser({ newPassword });
            setToast({
                message: 'Password updated successfully',
                type: 'success',
            });
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const getTierName = (tier: number) => {
        const tiers: { [key: number]: string } = {
            0: 'Free',
            1: 'Basic',
            2: 'Pro',
            3: 'Enterprise'
        };
        return tiers[tier] || `Tier ${tier}`;
    };

    return (
        <div className="flex flex-col">
            {isLoggingOut && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070b24]">
                    <Card active padding="p-5" borderRadius="rounded-xl">
                        <LoadingAtom title="Signing Out" subtitle="Cleaning up session" />
                    </Card>
                </div>
            )}
            <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col gap-12">
                {/* Header Section */}
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-5xl md:text-8xl font-black text-[var(--dash-text-main)] uppercase tracking-tighter leading-none">
                        Sett<span>ings</span>
                    </h1>
                    <p className="text-xl text-[var(--dash-text-muted)] max-w-2xl font-light">
                        Manage your account preferences and security.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Card active padding="p-5" borderRadius="rounded-xl">
                            <LoadingAtom title="Loading Settings" subtitle="Fetching your profile" />
                        </Card>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        {/* Account Overview */}
                        <Card className="flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <User size={20} className="text-[var(--dash-text-muted)]" />
                                <h2 className="text-xl font-bold text-[var(--dash-text-main)] uppercase tracking-tight">Account Overview</h2>
                            </div>
                            <div className="space-y-4 flex-grow">
                                <div>
                                    <label className="block text-xs font-medium text-[var(--dash-text-muted)] mb-1 uppercase tracking-wider">User ID</label>
                                    <div className="flex items-center gap-2 p-3 bg-[var(--dash-bg-subtle)] rounded-lg border border-[var(--dash-border-light)]">
                                        <Hash size={16} className="text-[var(--dash-text-muted)]" />
                                        <p className="text-sm text-[var(--dash-text-main)] font-mono truncate">{user?.userId}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--dash-text-muted)] mb-1 uppercase tracking-wider">Email Address</label>
                                    <div className="flex items-center gap-2 p-3 bg-[var(--dash-bg-subtle)] rounded-lg border border-[var(--dash-border-light)]">
                                        <Mail size={16} className="text-[var(--dash-text-muted)]" />
                                        <p className="text-sm text-[var(--dash-text-main)] truncate">{user?.emailAddress}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--dash-text-muted)] mb-1 uppercase tracking-wider">Member Since</label>
                                    <div className="flex items-center gap-2 p-3 bg-[var(--dash-bg-subtle)] rounded-lg border border-[var(--dash-border-light)]">
                                        <Calendar size={16} className="text-[var(--dash-text-muted)]" />
                                        <p className="text-sm text-[var(--dash-text-main)]">{user?.joinedOn ? formatDate(user.joinedOn) : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Account Status */}
                        <Card className="flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield size={20} className="text-[var(--dash-text-muted)]" />
                                <h2 className="text-xl font-bold text-[var(--dash-text-main)] uppercase tracking-tight">Account Status</h2>
                            </div>
                            <div className="space-y-4 flex-grow">
                                <div>
                                    <label className="block text-xs font-medium text-[var(--dash-text-muted)] mb-1 uppercase tracking-wider">Account Tier</label>
                                    <div className="p-3 bg-[var(--dash-bg-subtle)] rounded-lg border border-[var(--dash-border-light)]">
                                        <p className="text-sm text-[var(--dash-text-main)] font-bold">{user?.userTier !== undefined ? getTierName(user.userTier) : 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--dash-text-muted)] mb-1 uppercase tracking-wider">Account Status</label>
                                    <div className="p-3 bg-[var(--dash-bg-subtle)] rounded-lg border border-[var(--dash-border-light)]">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${user?.active ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                            <p className="text-sm text-[var(--dash-text-main)]">{user?.active ? 'Active' : 'Inactive'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--dash-text-muted)] mb-1 uppercase tracking-wider">Initial Setup</label>
                                    <div className="p-3 bg-[var(--dash-bg-subtle)] rounded-lg border border-[var(--dash-border-light)]">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${user?.setupComplete ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                                            <p className="text-sm text-[var(--dash-text-main)]">{user?.setupComplete ? 'Complete' : 'Pending'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Password Update Section */}
                        <Card className="flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <KeyRound size={20} className="text-[var(--dash-text-muted)]" />
                                <h2 className="text-xl font-bold text-[var(--dash-text-main)] uppercase tracking-tight">Update Password</h2>
                            </div>

                            <form onSubmit={handlePasswordUpdate} className="space-y-6 flex flex-col flex-grow">
                                <div className="space-y-4 flex-grow">
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-[var(--dash-text-muted)] mb-2 uppercase tracking-wider">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="newPassword"
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-3.5 rounded-xl text-[var(--dash-text-main)] placeholder-[var(--dash-input-placeholder)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--dash-border-light)] bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)]"
                                                placeholder="Enter new password"
                                                minLength={12}
                                                maxLength={16}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] hover:text-[var(--dash-text-main)] transition-colors"
                                            >
                                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-[var(--dash-text-muted)] mt-2 uppercase tracking-widest">12-16 characters required</p>
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--dash-text-muted)] mb-2 uppercase tracking-wider">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-3.5 rounded-xl text-[var(--dash-text-main)] placeholder-[var(--dash-input-placeholder)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--dash-border-light)] bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)]"
                                                placeholder="Confirm new password"
                                                minLength={12}
                                                maxLength={16}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                                            <p className="text-sm text-red-400 font-medium">{error}</p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 uppercase tracking-[0.2em] text-xs mt-auto"
                                    style={{
                                        background: 'var(--dash-secondary-color)',
                                        color: '#ffffff',
                                    }}
                                >
                                    {isSubmitting ? 'Updating...' : 'Save New Password'}
                                </button>
                            </form>
                        </Card>

                        {/* Profile Actions */}
                        <Card className="flex flex-col h-full">
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[var(--dash-bg-subtle)] border border-[var(--dash-border-light)] text-[var(--dash-text-main)] shadow-xl">
                                    <User size={40} />
                                </div>
                            </div>
                            <div className="flex flex-col items-center mb-6">
                                <h2 className="text-xl font-bold text-[var(--dash-text-main)] truncate max-w-full text-center">
                                    {user?.emailAddress?.split('@')[0]}
                                </h2>
                                <p className="text-[var(--dash-text-muted)] text-sm font-mono truncate max-w-full text-center">{user?.emailAddress}</p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full group flex items-center justify-center gap-3 py-4 rounded-xl bg-[var(--dash-bg-subtle)] hover:bg-[var(--dash-sidebar-item-hover-bg)] text-[var(--dash-text-main)] transition-all duration-300 border border-[var(--dash-border-light)] uppercase tracking-[0.2em] text-xs font-bold mt-auto"
                            >
                                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                                <span>Sign Out</span>
                            </button>
                        </Card>
                    </div>
                )}

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </main>
        </div>
    );
}

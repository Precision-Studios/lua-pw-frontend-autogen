'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, KeyRound, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authApi, userApi } from '@/lib/api';
import Toast, { ToastType } from '@/components/common/Toast';

interface ToastState {
    message: string;
    type: ToastType;
}

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<ToastState | null>(null);

    // Password Update State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await userApi.details();
                setUser(res.data);
            } catch (err) {
                console.error("Failed to load user details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
                <Loader2 size={48} className="text-white/20 animate-spin mb-4" />
                <p className="text-white/40 uppercase tracking-widest text-sm">Loading Settings...</p>
            </div>
        );
    }

    return (
        <main className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16 flex flex-col gap-12">
            {/* Header Section */}
            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                    Sett<span>ings</span>
                </h1>
                <p className="text-xl text-white/60 max-w-2xl font-light">
                    Manage your account preferences and security.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                {/* Profile Section */}
                <div className="md:col-span-5 space-y-8">
                    <div className="glass rounded-2xl p-8 border border-white/10">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white/10 border border-white/20 text-white shadow-xl">
                                <User size={40} />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-bold text-white truncate max-w-[200px]">
                                    {user?.emailAddress?.split('@')[0]}
                                </h2>
                                <p className="text-white/40 text-sm font-mono truncate">{user?.emailAddress}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full group flex items-center justify-center gap-3 py-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 border border-red-500/20 uppercase tracking-[0.2em] text-xs font-bold"
                        >
                            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* Password Update Section */}
                <div className="md:col-span-7">
                    <div className="glass rounded-2xl p-8 border border-white/10 bg-white/[0.02]">
                        <div className="flex items-center gap-3 mb-6">
                            <KeyRound size={20} className="text-white/60" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Update Password</h2>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="newPassword"
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-3.5 rounded-xl text-white placeholder-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/10 bg-white/5 border border-white/10"
                                            placeholder="Enter new password"
                                            minLength={12}
                                            maxLength={16}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-white/30 mt-2 uppercase tracking-widest">12-16 characters required</p>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3.5 rounded-xl text-white placeholder-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/10 bg-white/5 border border-white/10"
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
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                                    <p className="text-sm text-red-400 font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 uppercase tracking-[0.2em] text-xs"
                                style={{
                                    background: 'var(--secondary)',
                                    color: 'var(--secondary-foreground)',
                                }}
                            >
                                {isSubmitting ? 'Updating...' : 'Save New Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </main>
    );
}

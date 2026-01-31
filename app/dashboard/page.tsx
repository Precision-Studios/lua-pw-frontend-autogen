'use client';

import React, { useEffect, useState } from 'react';
import { userApi } from '@/lib/api';
import { Loader2, Link as LinkIcon, BarChart3, QrCode, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/lib/UserContext';


export default function DashboardPage() {
    const [urls, setUrls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: userLoading } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlsRes = await userApi.allUrls();
                setUrls(urlsRes.data);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const stats = [
        {
            label: 'Total Links',
            value: urls.length,
            icon: <LinkIcon className="text-[var(--dash-primary-color)]" size={24} />,
            href: '/dashboard/links'
        },
        {
            label: 'Total Clicks',
            value: urls.reduce((acc, curr) => acc + (curr.clickCount || 0), 0),
            icon: <BarChart3 className="text-[var(--dash-secondary-color)]" size={24} />,
            href: '/dashboard/analytics'
        },
        {
            label: 'QR Codes',
            value: urls.filter(u => u.qrCodeUrl).length,
            icon: <QrCode className="text-[var(--dash-accent-color)]" size={24} />,
            href: '/dashboard/qr-codes'
        }
    ];

    return (
        <div className="flex flex-col">
            <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col gap-12">
                {/* Header Section */}
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-5xl md:text-8xl font-black text-[var(--dash-text-main)] uppercase tracking-tighter leading-none">
                        Dash<span>board</span>
                    </h1>
                    <p className="text-xl text-[var(--dash-text-muted)] max-w-2xl font-light">
                        Welcome back, <Link href="/dashboard/settings" className="text-[var(--dash-text-main)] font-medium hover:text-[var(--dash-primary-color)] transition-colors">{user?.emailAddress?.split('@')[0]}</Link>.
                        Here is an overview of your activity.
                    </p>
                </div>

                {loading || userLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Loader2 size={48} className="text-[var(--dash-text-muted)] animate-spin mb-4" />
                        <p className="text-[var(--dash-text-muted)] uppercase tracking-widest text-sm">Loading...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, idx) => (
                                <Link
                                    key={idx}
                                    href={stat.href}
                                    className="dash-glass p-8 rounded-3xl transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-[var(--dash-bg-subtle)] rounded-2xl group-hover:scale-110 transition-transform">
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="text-4xl font-black text-[var(--dash-text-main)] mb-1">{stat.value}</div>
                                    <div className="text-[var(--dash-text-muted)] uppercase tracking-widest text-xs font-bold">{stat.label}</div>
                                </Link>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="dash-glass p-8 rounded-3xl">
                            <h2 className="text-2xl font-bold text-[var(--dash-text-main)] uppercase tracking-tight mb-8">Quick Actions</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Link
                                    href="/dashboard/links"
                                    className="flex items-center gap-4 p-6 bg-[var(--dash-bg-subtle)] rounded-2xl border border-[var(--dash-border-light)] hover:bg-[var(--dash-sidebar-item-hover-bg)] hover:border-[var(--dash-border-hover)] transition-all text-[var(--dash-text-main)] font-bold uppercase tracking-wider text-sm"
                                >
                                    <PlusCircle size={24} className="text-[var(--dash-primary-color)]" />
                                    New Link
                                </Link>
                                <Link
                                    href="/dashboard/qr-codes"
                                    className="flex items-center gap-4 p-6 bg-[var(--dash-bg-subtle)] rounded-2xl border border-[var(--dash-border-light)] hover:bg-[var(--dash-sidebar-item-hover-bg)] hover:border-[var(--dash-border-hover)] transition-all text-[var(--dash-text-main)] font-bold uppercase tracking-wider text-sm"
                                >
                                    <QrCode size={24} className="text-[var(--dash-secondary-color)]" />
                                    New QR Code
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

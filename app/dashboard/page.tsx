'use client';

import React, { useEffect, useState } from 'react';
import { userApi } from '@/lib/api';
import { Loader2, Link as LinkIcon, BarChart3, QrCode, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/lib/UserContext';
import '@/app/Home.css'; // Import standard styles

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
            icon: <LinkIcon className="text-blue-400" size={24} />,
            href: '/dashboard/links'
        },
        {
            label: 'Total Clicks',
            value: urls.reduce((acc, curr) => acc + (curr.clickCount || 0), 0),
            icon: <BarChart3 className="text-green-400" size={24} />,
            href: '/dashboard/analytics'
        },
        {
            label: 'QR Codes',
            value: urls.filter(u => u.qrCodeUrl).length,
            icon: <QrCode className="text-purple-400" size={24} />,
            href: '/dashboard/qr-codes'
        }
    ];

    return (
        <div className="flex flex-col">
            <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col gap-12">
                {/* Header Section */}
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                        Dash<span>board</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl font-light">
                        Welcome back, <span className="text-white font-medium">{user?.emailAddress?.split('@')[0]}</span>.
                        Here is an overview of your activity.
                    </p>
                </div>

                {loading || userLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Loader2 size={48} className="text-white/20 animate-spin mb-4" />
                        <p className="text-white/40 uppercase tracking-widest text-sm">Loading...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, idx) => (
                                <Link
                                    key={idx}
                                    href={stat.href}
                                    className="glass p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                                    <div className="text-white/40 uppercase tracking-widest text-xs font-bold">{stat.label}</div>
                                </Link>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="glass p-8 rounded-3xl border border-white/10">
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-8">Quick Actions</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Link
                                    href="/dashboard/links"
                                    className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-white font-bold uppercase tracking-wider text-sm"
                                >
                                    <PlusCircle size={24} className="text-blue-400" />
                                    New Link
                                </Link>
                                <Link
                                    href="/dashboard/qr-codes"
                                    className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-white font-bold uppercase tracking-wider text-sm"
                                >
                                    <QrCode size={24} className="text-purple-400" />
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

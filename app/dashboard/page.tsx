'use client';

import React, { useEffect, useState } from 'react';
import { userApi } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import CreateUrlForm from '@/components/dashboard/CreateUrlForm';
import UrlTable from '@/components/dashboard/UrlTable';
import { Loader2 } from 'lucide-react';
import '@/app/Home.css'; // Import standard styles

export default function DashboardPage() {
    const [urls, setUrls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, urlsRes] = await Promise.all([
                    userApi.details(),
                    userApi.allUrls()
                ]);
                setUser(userRes.data);
                setUrls(urlsRes.data);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleUrlCreated = (newUrl: any) => {
        setUrls(prev => [newUrl, ...prev]);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col items-center">
            <Navbar />

            <main className="w-full max-w-7xl px-4 py-8 md:py-16 flex flex-col gap-12">
                {/* Header Section - Matching Homepage Hero Title Style */}
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                        Dash<span>board</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl font-light">
                        Welcome back, <span className="text-white font-medium">{user?.emailAddress?.split('@')[0]}</span>.
                        Manage your links and analytics.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Loader2 size={48} className="text-white/20 animate-spin mb-4" />
                        <p className="text-white/40 uppercase tracking-widest text-sm">Loading...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        {/* Left Column: Create Form */}
                        <div className="lg:col-span-5 space-y-8">
                            <CreateUrlForm onUrlCreated={handleUrlCreated} />
                        </div>

                        {/* Right Column: List */}
                        <div className="lg:col-span-7">
                            <div className="mb-6 flex items-baseline justify-between border-b border-white/10 pb-4">
                                <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Your Links</h2>
                                <span className="text-sm text-white/40 font-mono">
                                    {urls.length} TOTAL
                                </span>
                            </div>
                            <UrlTable urls={urls} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

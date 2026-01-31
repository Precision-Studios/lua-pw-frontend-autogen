'use client';

import React, { useEffect, useState } from 'react';
import { userApi } from '@/lib/api';
import CreateUrlForm from '@/components/dashboard/CreateUrlForm';
import UrlTable from '@/components/dashboard/UrlTable';
import { Loader2 } from 'lucide-react';


export default function LinksPage() {
    const [urls, setUrls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlsRes = await userApi.allUrls();
                setUrls(urlsRes.data);
            } catch (error) {
                console.error("Failed to load links", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleUrlCreated = (newUrl: any) => {
        setUrls(prev => {
            const exists = prev.some(u => u.shortUrl === newUrl.shortUrl);
            if (exists) {
                // Move existing to top
                return [newUrl, ...prev.filter(u => u.shortUrl !== newUrl.shortUrl)];
            }
            return [newUrl, ...prev];
        });
    };

    return (
        <div className="flex flex-col">
            <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col gap-12">
                {/* Header Section */}
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-5xl md:text-8xl font-black text-[var(--dash-text-main)] uppercase tracking-tighter leading-none">
                        My <span>Links</span>
                    </h1>
                    <p className="text-xl text-[var(--dash-text-muted)] max-w-2xl font-light">
                        Create and manage your shortened URLs and custom links.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Loader2 size={48} className="text-[var(--dash-text-muted)] animate-spin mb-4" />
                        <p className="text-[var(--dash-text-muted)] uppercase tracking-widest text-sm">Loading...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        {/* Left Column: Create Form */}
                        <div className="lg:col-span-12 space-y-8">
                            <div className="dash-glass p-8 rounded-3xl border border-[var(--dash-glass-border)]">
                                <h2 className="text-2xl font-bold text-[var(--dash-text-main)] uppercase tracking-tight mb-6">Create New Link</h2>
                                <CreateUrlForm onUrlCreated={handleUrlCreated} />
                            </div>
                        </div>

                        {/* Bottom/Right Column: List */}
                        <div className="lg:col-span-12">
                            <div className="mb-6 flex items-baseline justify-between border-b border-[var(--dash-border-light)] pb-4">
                                <h2 className="text-2xl font-bold text-[var(--dash-text-main)] uppercase tracking-tight">Your Links</h2>
                                <span className="text-sm text-[var(--dash-text-muted)] font-mono">
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

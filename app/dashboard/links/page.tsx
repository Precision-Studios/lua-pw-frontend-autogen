'use client';

import React, { useEffect, useState } from 'react';
import { userApi } from '@/lib/api';
import CreateUrlForm from '@/components/dashboard/CreateUrlForm';
import UrlTable from '@/components/dashboard/UrlTable';
import LoadingAtom from '@/components/common/LoadingAtom';

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
                <div className="flex flex-col gap-2">
                    <h1 className="text-5xl md:text-8xl font-black text-[var(--dash-text-main)] uppercase tracking-tighter leading-none">
                        My <span>Links</span>
                    </h1>
                    <p className="text-xl text-[var(--dash-text-muted)] max-w-2xl font-light">
                        Create and manage your shortened URLs and custom links.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <LoadingAtom />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Create Form */}
                        <div className="lg:col-span-4">
                            <div className="bg-[var(--dash-sidebar-bg)] backdrop-blur-xl border border-[var(--dash-sidebar-border)] shadow-2xl shadow-black/40 rounded-[2rem] p-8 sticky top-24">
                                <h2 className="text-xl font-bold text-[var(--dash-text-main)] uppercase tracking-tight mb-6">Create New Link</h2>
                                <CreateUrlForm onUrlCreated={handleUrlCreated} />
                            </div>
                        </div>

                        {/* Right Column: List */}
                        <div className="lg:col-span-8">
                            <UrlTable urls={urls} title="Your Links" totalCount={urls.length} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

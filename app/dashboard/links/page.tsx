'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { userApi } from '@/lib/api';
import CreateUrlForm from '@/components/dashboard/CreateUrlForm';
import UrlTable from '@/components/dashboard/UrlTable';
import LoadingAtom from '@/components/common/LoadingAtom';
import { motion } from 'framer-motion';

export default function LinksPage() {
    const [urls, setUrls] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const pageSize = 10;

    const fetchData = useCallback(async (page: number) => {
        setLoading(true);
        try {
            const urlsRes = await userApi.allUrls(page, pageSize);
            setUrls(urlsRes.data.content || []);
            setTotalCount(urlsRes.data.page?.totalElements || 0);
            setTotalPages(urlsRes.data.page?.totalPages || 0);
        } catch (error) {
            console.error("Failed to load links", error);
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, fetchData]);

    const handleUrlCreated = (newUrl: any) => {
        if (currentPage === 0) {
            setUrls(prev => {
                const exists = prev.some(u => u.shortUrl === newUrl.shortUrl);
                if (exists) {
                    return [newUrl, ...prev.filter(u => u.shortUrl !== newUrl.shortUrl)];
                }
                return [newUrl, ...prev.slice(0, pageSize - 1)];
            });
        }
        setTotalCount(c => c + 1);
        setTotalPages(Math.ceil((totalCount + 1) / pageSize));
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
        >
            <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col gap-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-2"
                >
                    <h1 className="text-5xl md:text-8xl font-black text-[var(--dash-text-main)] uppercase tracking-tighter leading-none">
                        My <span>Links</span>
                    </h1>
                    <p className="text-xl text-[var(--dash-text-muted)] max-w-2xl font-light">
                        Create and manage your shortened URLs and custom links.
                    </p>
                </motion.div>

                <div className="flex flex-col gap-12">
                    {/* Action Bar: Create Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full"
                    >
                        <CreateUrlForm onUrlCreated={handleUrlCreated} />
                    </motion.div>

                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-full"
                    >
                        {loading && urls.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-40">
                                <div className="p-8 bg-[var(--dash-sidebar-bg)] border border-[var(--dash-border-light)] rounded-3xl">
                                    <LoadingAtom />
                                </div>
                            </div>
                        ) : (
                            <div className={loading ? "opacity-50 pointer-events-none transition-opacity duration-500" : "transition-opacity duration-500"}>
                                <UrlTable
                                    urls={urls}
                                    title="Your Links"
                                    totalCount={totalCount}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>
        </motion.div>
    );
}

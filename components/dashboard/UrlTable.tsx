import React, { useState } from 'react';
import { Copy, QrCode, ExternalLink, ArrowRight, Check, ChevronLeft, ChevronRight, LayoutGrid, ListFilter } from 'lucide-react';
import QrCodeModal from './QrCodeModal';
import UrlCard from './UrlCard';
import { motion, AnimatePresence } from 'framer-motion';

interface UrlData {
    shortUrl: string;
    longUrl: string;
    createdAt: string;
    expireAt: string;
    isQRActivated: boolean;
}

interface UrlTableProps {
    urls: UrlData[];
    title?: string;
    totalCount?: number;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

const UrlTable: React.FC<UrlTableProps> = ({
    urls,
    title,
    totalCount,
    currentPage = 0,
    totalPages = 0,
    onPageChange
}) => {
    const [selectedUrl, setSelectedUrl] = useState<UrlData | null>(null);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    const getFullUrl = (shortUrl: string, isQr: boolean = false) => {
        let url = shortUrl;
        if (!url.startsWith('http')) {
            if (typeof window !== 'undefined') {
                url = `${window.location.origin}/${shortUrl}`;
            } else {
                url = `/${shortUrl}`;
            }
        }

        if (isQr) {
            const separator = url.includes('?') ? '&' : '?';
            url = `${url}${separator}qr=true`;
        }

        return url;
    };

    const handleCopy = (shortUrl: string) => {
        const fullUrl = getFullUrl(shortUrl);
        navigator.clipboard.writeText(fullUrl);
        setCopiedUrl(shortUrl);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    if (!urls || urls.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-20 text-center border-2 border-dashed border-[var(--dash-border-light)] rounded-3xl bg-[var(--dash-sidebar-bg)]/30 backdrop-blur-sm"
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--dash-bg-subtle)] flex items-center justify-center text-[var(--dash-text-muted)] border border-[var(--dash-border-light)]">
                        <LayoutGrid size={32} strokeWidth={1} />
                    </div>
                    <p className="text-[var(--dash-text-muted)] font-light text-lg">
                        No links created yet. Start by pasting a URL above.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-8">
            {(title || totalCount !== undefined) && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black text-[var(--dash-text-main)] uppercase tracking-tighter">{title || 'Your Links'}</h2>
                    </div>
                    {totalCount !== undefined && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest bg-[var(--dash-bg-subtle)] px-4 py-2 rounded-full border border-[var(--dash-border-light)]">
                                {totalCount} TOTAL
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination UI */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between p-6 bg-[var(--dash-sidebar-bg)] backdrop-blur-xl border border-[var(--dash-border-light)] rounded-2xl">
                    <div className="hidden sm:block text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-[0.2em]">
                        Page <span className="text-[var(--dash-text-main)]">{currentPage + 1}</span> / <span className="text-[var(--dash-text-main)]">{totalPages}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            onClick={() => onPageChange?.(currentPage - 1)}
                            disabled={currentPage === 0}
                            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all border ${currentPage === 0
                                ? 'border-transparent text-[var(--dash-text-muted)] opacity-30 cursor-not-allowed'
                                : 'border-[var(--dash-border-light)] bg-[var(--dash-bg-subtle)] text-[var(--dash-text-main)] hover:bg-[var(--dash-primary-color)] hover:text-white hover:border-[var(--dash-primary-color)] shadow-lg hover:shadow-[var(--dash-primary-color)]/20'
                                }`}
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className="flex items-center gap-1.5 px-1">
                            {Array.from({ length: totalPages }, (_, i) => {
                                if (
                                    i === 0 ||
                                    i === totalPages - 1 ||
                                    (i >= currentPage - 1 && i <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => onPageChange?.(i)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all border ${i === currentPage
                                                ? 'bg-[var(--dash-primary-color)] border-[var(--dash-primary-color)] text-white shadow-lg shadow-[var(--dash-primary-color)]/20'
                                                : 'border-[var(--dash-border-light)] text-[var(--dash-text-muted)] hover:bg-[var(--dash-bg-subtle)] hover:text-[var(--dash-text-main)]'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                } else if (
                                    (i === 1 && currentPage > 2) ||
                                    (i === totalPages - 2 && currentPage < totalPages - 3)
                                ) {
                                    return <span key={i} className="text-[var(--dash-text-muted)] px-1">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => onPageChange?.(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all border ${currentPage === totalPages - 1
                                ? 'border-transparent text-[var(--dash-text-muted)] opacity-30 cursor-not-allowed'
                                : 'border-[var(--dash-border-light)] bg-[var(--dash-bg-subtle)] text-[var(--dash-text-main)] hover:bg-[var(--dash-primary-color)] hover:text-white hover:border-[var(--dash-primary-color)] shadow-lg hover:shadow-[var(--dash-primary-color)]/20'
                                }`}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {urls.map((url) => (
                        <UrlCard
                            key={url.shortUrl}
                            url={url}
                            onCopy={handleCopy}
                            onQrClick={setSelectedUrl}
                            copiedUrl={copiedUrl}
                        />
                    ))}
                </AnimatePresence>
            </div>



            {selectedUrl && (
                <QrCodeModal
                    isOpen={!!selectedUrl}
                    onClose={() => setSelectedUrl(null)}
                    shortUrl={getFullUrl(selectedUrl.shortUrl, true)}
                    isQRActivated={selectedUrl.isQRActivated}
                />
            )}
        </div>
    );
};

export default UrlTable;

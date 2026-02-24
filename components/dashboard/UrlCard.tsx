'use client';

import React from 'react';
import { Copy, QrCode, ExternalLink, Check, Calendar, Globe, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface UrlData {
    shortUrl: string;
    longUrl: string;
    createdAt: string;
    expireAt: string;
    isQRActivated: boolean;
}

interface UrlCardProps {
    url: UrlData;
    onCopy: (shortUrl: string) => void;
    onQrClick: (url: UrlData) => void;
    copiedUrl: string | null;
}

const UrlCard: React.FC<UrlCardProps> = ({ url, onCopy, onQrClick, copiedUrl }) => {
    const getFullUrl = (shortUrl: string) => {
        let fullUrl = shortUrl;
        if (!fullUrl.startsWith('http')) {
            if (typeof window !== 'undefined') {
                fullUrl = `${window.location.origin}/${shortUrl}`;
            } else {
                fullUrl = `/${shortUrl}`;
            }
        }
        return fullUrl;
    };

    const fullUrl = getFullUrl(url.shortUrl);
    const displayUrl = fullUrl.replace(/^https?:\/\//, '');

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative"
        >
            <div className="relative bg-[var(--dash-sidebar-bg)] border border-[var(--dash-border-light)] hover:border-[var(--dash-border-hover)] rounded-2xl p-6 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[var(--dash-bg-subtle)] border border-[var(--dash-border-light)] flex items-center justify-center text-[var(--dash-primary-color)]">
                                <Globe size={16} />
                            </div>
                            <span className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">Original Link</span>
                        </div>
                        <h3 className="text-[var(--dash-text-main)] font-medium text-sm truncate mb-4" title={url.longUrl}>
                            {url.longUrl}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2 text-xs font-mono bg-[var(--dash-success)]/10 px-3 py-1.5 rounded-full border border-[var(--dash-success)]/20">
                                <Calendar size={12} className="text-[var(--dash-success)]" />
                                <span className="uppercase text-[9px] mr-1 text-[var(--dash-success)]">Created</span>
                                <span className="text-[var(--dash-text-main)]">{formatDate(url.createdAt)}</span>
                            </div>
                            {url.expireAt && (
                                <div className="flex items-center gap-2 text-xs font-mono bg-[var(--dash-error)]/15 px-3 py-1.5 rounded-full border border-[var(--dash-error)]/35">
                                    <Clock size={12} className="text-[var(--dash-error)]" />
                                    <span className="uppercase text-[9px] mr-1 text-[var(--dash-error)]">Expires</span>
                                    <span className="text-[var(--dash-error)]">{formatDate(url.expireAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Short Link & Actions Section */}
                    <div className="flex flex-col md:items-end gap-4 min-w-[200px]">
                        <div className="flex flex-col md:items-end gap-1">
                            <span className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">Shortened Link</span>
                            <a
                                href={fullUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg font-bold text-[var(--dash-text-main)] hover:text-[var(--dash-primary-color)] transition-colors flex items-center gap-2 font-mono tracking-tight"
                            >
                                {displayUrl}
                                <ExternalLink size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <button
                                onClick={() => onCopy(url.shortUrl)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${copiedUrl === url.shortUrl
                                    ? 'bg-[var(--dash-success)]/10 border-[var(--dash-success)]/30 text-[var(--dash-success)]'
                                    : 'bg-[var(--dash-bg-subtle)] border-[var(--dash-border-light)] text-[var(--dash-text-main)] hover:border-[var(--dash-border-hover)] hover:bg-[var(--dash-sidebar-item-hover-bg)]'
                                    }`}
                            >
                                {copiedUrl === url.shortUrl ? (
                                    <>
                                        <Check size={14} />
                                        <span>Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} />
                                        <span>Copy Link</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => onQrClick(url)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--dash-bg-subtle)] border border-[var(--dash-border-light)] text-[var(--dash-text-main)] hover:border-[var(--dash-border-hover)] hover:bg-[var(--dash-sidebar-item-hover-bg)] transition-all"
                                title="Create QR Code"
                            >
                                <QrCode size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default UrlCard;

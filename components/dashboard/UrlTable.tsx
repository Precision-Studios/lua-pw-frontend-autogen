import React, { useState } from 'react';
import { Copy, QrCode, ExternalLink, ArrowRight, Check } from 'lucide-react';
import QrCodeModal from './QrCodeModal';

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
}

const UrlTable: React.FC<UrlTableProps> = ({ urls, title, totalCount }) => {
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
            <div className="w-full py-12 text-center border border-dashed border-[var(--dash-border-light)] rounded-2xl">
                <p className="text-[var(--dash-text-muted)] font-light">
                    No links created yet. Start by pasting a URL above.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full bg-[var(--dash-sidebar-bg)] backdrop-blur-xl border border-[var(--dash-sidebar-border)] shadow-2xl shadow-black/40 rounded-[2rem] p-8 overflow-hidden">
            {(title || totalCount !== undefined) && (
                <div className="mb-8 flex items-baseline justify-between border-b border-[var(--dash-border-light)] pb-6 mt-2">
                    <h2 className="text-2xl font-bold text-[var(--dash-text-main)] uppercase tracking-tight">{title || 'Your Links'}</h2>
                    {totalCount !== undefined && (
                        <span className="text-sm text-[var(--dash-text-muted)] font-mono">
                            {totalCount} TOTAL
                        </span>
                    )}
                </div>
            )}
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-[var(--dash-border-light)]">
                        <th className="py-4 font-normal text-[10px] text-[var(--dash-text-muted)] uppercase tracking-[0.2em]">Original</th>
                        <th className="py-4 font-normal text-[10px] text-[var(--dash-text-muted)] uppercase tracking-[0.2em]">Short Link</th>
                        <th className="py-4 font-normal text-[10px] text-[var(--dash-text-muted)] uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--dash-border-light)]">
                    {urls.map((url) => (
                        <tr key={url.shortUrl} className="group hover:bg-[var(--dash-bg-subtle)]/50 transition-colors">
                            <td className="py-6 pr-8 max-w-[200px] xl:max-w-[350px]">
                                <div className="truncate text-[var(--dash-text-muted)] font-light text-sm" title={url.longUrl}>
                                    {url.longUrl}
                                </div>
                            </td>
                            <td className="py-6 pr-8">
                                <a
                                    href={getFullUrl(url.shortUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-[var(--dash-text-main)] hover:text-[var(--dash-primary-color)] transition-colors flex items-center gap-2"
                                >
                                    {getFullUrl(url.shortUrl).replace(/^https?:\/\//, '')}
                                    <ExternalLink size={10} className="opacity-30" />
                                </a>
                            </td>
                            <td className="py-6 text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        onClick={() => handleCopy(url.shortUrl)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--dash-sidebar-item-hover-bg)] text-[var(--dash-text-muted)] hover:text-[var(--dash-text-main)] transition-all"
                                        title="Copy Link"
                                    >
                                        {copiedUrl === url.shortUrl ? (
                                            <Check size={14} className="text-[var(--dash-success)]" />
                                        ) : (
                                            <Copy size={14} />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setSelectedUrl(url)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--dash-sidebar-item-hover-bg)] text-[var(--dash-text-muted)] hover:text-[var(--dash-text-main)] transition-all"
                                        title="QR Code"
                                    >
                                        <QrCode size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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

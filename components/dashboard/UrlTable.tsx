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
}

const UrlTable: React.FC<UrlTableProps> = ({ urls }) => {
    const [selectedUrl, setSelectedUrl] = useState<UrlData | null>(null);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    const handleCopy = (shortUrl: string) => {
        navigator.clipboard.writeText(shortUrl);
        setCopiedUrl(shortUrl);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    if (!urls || urls.length === 0) {
        return (
            <div className="w-full py-12 text-center border border-dashed border-white/10 rounded-2xl">
                <p className="text-white/40 font-light">
                    No links created yet. Start by pasting a URL above.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10">
                        <th className="py-4 font-normal text-[10px] text-white/40 uppercase tracking-[0.2em]">Original</th>
                        <th className="py-4 font-normal text-[10px] text-white/40 uppercase tracking-[0.2em]">Short Link</th>
                        <th className="py-4 font-normal text-[10px] text-white/40 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {urls.map((url) => (
                        <tr key={url.shortUrl} className="group hover:bg-white/5 transition-colors">
                            <td className="py-6 pr-8 max-w-[200px] xl:max-w-[300px]">
                                <div className="truncate text-white/60 font-light text-sm" title={url.longUrl}>
                                    {url.longUrl}
                                </div>
                            </td>
                            <td className="py-6 pr-8">
                                <a
                                    href={url.shortUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-white hover:underline decoration-white/30 underline-offset-4 transition-all flex items-center gap-2"
                                >
                                    {url.shortUrl.replace(/^https?:\/\//, '')}
                                    <ExternalLink size={10} className="opacity-30" />
                                </a>
                            </td>
                            <td className="py-6 text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        onClick={() => handleCopy(url.shortUrl)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all"
                                        title="Copy Link"
                                    >
                                        {copiedUrl === url.shortUrl ? (
                                            <Check size={14} className="text-white" />
                                        ) : (
                                            <Copy size={14} />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setSelectedUrl(url)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all"
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
                    shortUrl={selectedUrl.shortUrl}
                    isQRActivated={selectedUrl.isQRActivated}
                />
            )}
        </div>
    );
};

export default UrlTable;

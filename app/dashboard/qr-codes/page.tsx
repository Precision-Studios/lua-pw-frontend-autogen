'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QRCode from 'react-qr-code';
import { QrCode, Link as LinkIcon, Loader2, ArrowRight, Download, Copy, Check } from 'lucide-react';
import { urlApi } from '@/lib/api';

export default function QrCodesPage() {
    const searchParams = useSearchParams();
    const svgRef = useRef<HTMLDivElement>(null);

    const [inputUrl, setInputUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [qrUrl, setQrUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [qrSize, setQrSize] = useState(220);

    useEffect(() => {
        const prefilledUrl = searchParams.get('url');
        if (prefilledUrl) {
            setInputUrl(prefilledUrl);
        }
    }, [searchParams]);

    const buildFullShortUrl = (shortCodeOrUrl: string) => {
        if (shortCodeOrUrl.startsWith('http://') || shortCodeOrUrl.startsWith('https://')) {
            return shortCodeOrUrl;
        }

        if (typeof window === 'undefined') {
            return `/${shortCodeOrUrl.replace(/^\/+/, '')}`;
        }

        return `${window.location.origin}/${shortCodeOrUrl.replace(/^\/+/, '')}`;
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputUrl.trim()) return;

        setLoading(true);
        setError(null);
        setCopied(false);

        try {
            const response = await urlApi.shorten(inputUrl);
            const shortFromApi = response?.data?.shortUrl;

            if (!shortFromApi) {
                throw new Error('Short URL not returned by API');
            }

            const fullShortUrl = buildFullShortUrl(shortFromApi);
            const separator = fullShortUrl.includes('?') ? '&' : '?';
            const qrTargetUrl = `${fullShortUrl}${separator}qr=true`;

            await urlApi.generateQR(fullShortUrl);

            setShortUrl(fullShortUrl);
            setQrUrl(qrTargetUrl);
        } catch (err) {
            console.error('Failed to create short URL for QR', err);
            setError('Failed to create QR target link. Please try again.');
            setShortUrl('');
            setQrUrl('');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!qrUrl) return;
        await navigator.clipboard.writeText(qrUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleDownload = () => {
        if (!svgRef.current || !qrUrl) return;

        const svg = svgRef.current.querySelector('svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const image = new Image();

        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            if (context) {
                context.fillStyle = '#ffffff';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0);
            }

            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `qrcode-${Date.now()}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        image.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-6rem)]">
            <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col gap-10 flex-1">
                <div className="flex flex-col gap-2">
                    <h1 className="text-5xl md:text-8xl font-black text-[var(--dash-text-main)] uppercase tracking-tighter leading-none">
                        QR<span> Codes</span>
                    </h1>
                    <p className="text-xl text-[var(--dash-text-muted)] max-w-2xl font-light">
                        Create a short link and generate a QR code that tracks QR analytics.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[var(--dash-sidebar-bg)] border border-[var(--dash-border-light)] rounded-3xl p-6 md:p-8">
                        <form onSubmit={handleGenerate} className="flex flex-col gap-5">
                            <label className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">
                                URL to generate QR
                            </label>

                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] group-focus-within:text-[var(--dash-primary-color)] transition-colors">
                                    <LinkIcon size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={inputUrl}
                                    onChange={(e) => setInputUrl(e.target.value)}
                                    placeholder="Paste your long link here..."
                                    className="w-full p-4 pl-12 bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] text-[var(--dash-text-main)] placeholder-[var(--dash-input-placeholder)] rounded-2xl focus:outline-none focus:border-[var(--dash-border-hover)]"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">Size</label>
                                <select
                                    value={qrSize}
                                    onChange={(e) => setQrSize(Number(e.target.value))}
                                    className="bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] rounded-xl px-3 py-2 text-sm text-[var(--dash-text-main)]"
                                >
                                    <option value={180}>Small</option>
                                    <option value={220}>Medium</option>
                                    <option value={280}>Large</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[var(--dash-button-bg)] text-[var(--dash-button-text)] font-black rounded-2xl hover:bg-[var(--dash-button-hover-bg)] uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Creating</span>
                                    </>
                                ) : (
                                    <>
                                        <QrCode size={16} />
                                        <span>Create QR</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>

                            {error && (
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--dash-error)]">{error}</p>
                            )}
                        </form>
                    </div>

                    <div className="bg-[var(--dash-sidebar-bg)] border border-[var(--dash-border-light)] rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center gap-5 min-h-[420px]">
                        {qrUrl ? (
                            <>
                                <div ref={svgRef} className="p-4 bg-white rounded-2xl border border-[var(--dash-border-light)]">
                                    <QRCode
                                        value={qrUrl}
                                        size={qrSize}
                                        style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                                        viewBox="0 0 256 256"
                                    />
                                </div>

                                <div className="w-full flex flex-col gap-2">
                                    <span className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">QR URL</span>
                                    <p className="text-sm font-mono break-all text-[var(--dash-text-main)]">{qrUrl}</p>
                                </div>

                                <div className="w-full grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleCopy}
                                        className="py-3 rounded-xl border border-[var(--dash-border-light)] bg-[var(--dash-bg-subtle)] text-[var(--dash-text-main)] hover:border-[var(--dash-border-hover)] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                        {copied ? 'Copied' : 'Copy URL'}
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="py-3 rounded-xl bg-[var(--dash-button-bg)] text-[var(--dash-button-text)] hover:bg-[var(--dash-button-hover-bg)] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <Download size={14} />
                                        Download
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-[var(--dash-bg-subtle)] border border-[var(--dash-border-light)] flex items-center justify-center">
                                    <QrCode size={28} className="text-[var(--dash-text-muted)]" />
                                </div>
                                <p className="text-sm text-[var(--dash-text-muted)]">Your QR code preview will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    QrCode,
    Link as LinkIcon,
    Loader2,
    ArrowRight,
    Download,
    Copy,
    Check,
    Upload,
    Trash2,
} from 'lucide-react';
import { urlApi } from '@/lib/api';

type DotStyle = 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'extra-rounded';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
type ExportFormat = 'png' | 'svg' | 'jpg';

interface QrConfig {
    content: string;
    size: number;
    exportResolution: number;
    foregroundColor: string;
    backgroundColor: string;
    transparentBackground: boolean;
    dotStyle: DotStyle;
    errorCorrectionLevel: ErrorCorrectionLevel;
    margin: number;
    logoDataUrl: string;
    logoMargin: number;
}

interface QrCodeInstance {
    append: (container: HTMLElement) => void;
    update: (options: Record<string, unknown>) => void;
    getRawData: (extension: 'png' | 'jpeg' | 'svg') => Promise<Blob | null>;
}

const DEFAULT_CONFIG: QrConfig = {
    content: '',
    size: 260,
    exportResolution: 1024,
    foregroundColor: '#111827',
    backgroundColor: '#ffffff',
    transparentBackground: false,
    dotStyle: 'rounded',
    errorCorrectionLevel: 'H',
    margin: 12,
    logoDataUrl: '',
    logoMargin: 8,
};

// TODO: Persist and restore `QrConfig` from the API once backend endpoints are ready.
const createQrOptions = (config: QrConfig) => ({
    width: config.size,
    height: config.size,
    type: 'svg' as const,
    data: config.content || ' ',
    qrOptions: {
        errorCorrectionLevel: config.errorCorrectionLevel,
    },
    dotsOptions: {
        color: config.foregroundColor,
        type: config.dotStyle,
    },
    backgroundOptions: {
        color: config.transparentBackground ? 'rgba(0,0,0,0)' : config.backgroundColor,
    },
    image: config.logoDataUrl || undefined,
    imageOptions: {
        crossOrigin: 'anonymous',
        margin: config.logoDataUrl ? config.logoMargin : 0,
        imageSize: 0.22,
        hideBackgroundDots: true,
    },
    margin: config.margin,
});

export default function QrCodesPage() {
    const searchParams = useSearchParams();
    const qrContainerRef = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<QrCodeInstance | null>(null);
    const firstDraftRenderRef = useRef(true);
    const bypassNextDelayRef = useRef(false);

    const [inputUrl, setInputUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [draftConfig, setDraftConfig] = useState<QrConfig>(DEFAULT_CONFIG);
    const [appliedConfig, setAppliedConfig] = useState<QrConfig>(DEFAULT_CONFIG);
    const [applyCountdown, setApplyCountdown] = useState(0);
    const [hasPendingChanges, setHasPendingChanges] = useState(false);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState<ExportFormat | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const updateDraftConfig = <K extends keyof QrConfig>(key: K, value: QrConfig[K]) => {
        setDraftConfig((prev) => {
            if (Object.is(prev[key], value)) {
                return prev;
            }

            return { ...prev, [key]: value };
        });
    };

    useEffect(() => {
        const prefilledUrl = searchParams.get('url');
        if (prefilledUrl) {
            setInputUrl(prefilledUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        if (firstDraftRenderRef.current) {
            firstDraftRenderRef.current = false;
            return;
        }

        if (bypassNextDelayRef.current) {
            bypassNextDelayRef.current = false;
            setHasPendingChanges(false);
            setApplyCountdown(0);
            return;
        }

        setHasPendingChanges(true);
        setApplyCountdown(3);
    }, [draftConfig]);

    useEffect(() => {
        if (!hasPendingChanges) {
            return;
        }

        if (applyCountdown <= 0) {
            setAppliedConfig(draftConfig);
            setHasPendingChanges(false);
            return;
        }

        const timer = window.setTimeout(() => {
            setApplyCountdown((prev) => prev - 1);
        }, 1000);

        return () => {
            window.clearTimeout(timer);
        };
    }, [applyCountdown, draftConfig, hasPendingChanges]);

    useEffect(() => {
        let cancelled = false;

        const renderQrCode = async () => {
            if (!qrContainerRef.current || !appliedConfig.content) {
                return;
            }

            const { default: QRCodeStyling } = await import('qr-code-styling');

            if (cancelled || !qrContainerRef.current) {
                return;
            }

            if (!qrCodeRef.current) {
                qrCodeRef.current = new QRCodeStyling(createQrOptions(appliedConfig)) as QrCodeInstance;
            }

            qrContainerRef.current.innerHTML = '';
            qrCodeRef.current.append(qrContainerRef.current);
            qrCodeRef.current.update(createQrOptions(appliedConfig));
        };

        renderQrCode();

        return () => {
            cancelled = true;
        };
    }, [appliedConfig]);

    useEffect(() => {
        return () => {
            qrCodeRef.current = null;
        };
    }, []);

    const buildFullShortUrl = (shortCodeOrUrl: string) => {
        if (shortCodeOrUrl.startsWith('http://') || shortCodeOrUrl.startsWith('https://')) {
            return shortCodeOrUrl;
        }

        if (typeof window === 'undefined') {
            return `/${shortCodeOrUrl.replace(/^\/+/, '')}`;
        }

        return `${window.location.origin}/${shortCodeOrUrl.replace(/^\/+/, '')}`;
    };

    const isExistingShortLink = (value: string) => {
        const trimmed = value.trim();

        if (!trimmed) {
            return false;
        }

        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
            return /^\/?[A-Za-z0-9_-]{3,}$/.test(trimmed);
        }

        try {
            if (typeof window === 'undefined') {
                return false;
            }

            const parsed = new URL(trimmed);
            const sameHost = parsed.host === window.location.host;
            const cleanPath = parsed.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
            const isSingleSegment = !!cleanPath && !cleanPath.includes('/');
            const reservedPaths = new Set(['dashboard', 'auth', 'create', 'account-suspended', 'setup-password']);

            return sameHost && isSingleSegment && !reservedPaths.has(cleanPath);
        } catch {
            return false;
        }
    };

    const applyNow = () => {
        setAppliedConfig(draftConfig);
        setHasPendingChanges(false);
        setApplyCountdown(0);
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputUrl.trim()) return;

        setLoading(true);
        setError(null);
        setCopied(false);

        try {
            const normalizedInput = inputUrl.trim();
            let fullShortUrl = '';

            if (isExistingShortLink(normalizedInput)) {
                fullShortUrl = buildFullShortUrl(normalizedInput);
            } else {
                const response = await urlApi.shorten(normalizedInput);
                const shortFromApi = response?.data?.shortUrl;

                if (!shortFromApi) {
                    throw new Error('Short URL not returned by API');
                }

                fullShortUrl = buildFullShortUrl(shortFromApi);
            }

            const separator = fullShortUrl.includes('?') ? '&' : '?';
            const qrTargetUrl = `${fullShortUrl}${separator}qr=true`;

            await urlApi.generateQR(fullShortUrl);

            setShortUrl(fullShortUrl);
            const nextConfig = { ...draftConfig, content: qrTargetUrl };
            bypassNextDelayRef.current = true;
            setDraftConfig(nextConfig);
            setAppliedConfig(nextConfig);
            setHasPendingChanges(false);
            setApplyCountdown(0);
        } catch (err) {
            console.error('Failed to create short URL for QR', err);
            setError('Failed to create QR target link. Please try again.');
            setShortUrl('');
            const nextConfig = { ...draftConfig, content: '' };
            bypassNextDelayRef.current = true;
            setDraftConfig(nextConfig);
            setAppliedConfig(nextConfig);
            setHasPendingChanges(false);
            setApplyCountdown(0);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!appliedConfig.content) return;
        await navigator.clipboard.writeText(appliedConfig.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const result = typeof reader.result === 'string' ? reader.result : '';
            updateDraftConfig('logoDataUrl', result);
        };
        reader.readAsDataURL(file);
    };

    const handleDownload = async (format: ExportFormat) => {
        if (!qrCodeRef.current || !appliedConfig.content) {
            return;
        }

        const extension = format === 'jpg' ? 'jpeg' : format;
        setDownloading(format);

        try {
            qrCodeRef.current.update({
                width: appliedConfig.exportResolution,
                height: appliedConfig.exportResolution,
            });

            const rawData = await qrCodeRef.current.getRawData(extension);

            if (!rawData) {
                throw new Error('Download payload unavailable');
            }

            const downloadUrl = URL.createObjectURL(rawData);
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.download = `qrcode-${Date.now()}.${format}`;
            downloadLink.click();
            URL.revokeObjectURL(downloadUrl);
        } catch (downloadError) {
            console.error('Failed to download QR file', downloadError);
            setError('Failed to download QR file. Please try again.');
        } finally {
            qrCodeRef.current.update({
                width: appliedConfig.size,
                height: appliedConfig.size,
            });
            setDownloading(null);
        }
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-6rem)]">
            <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col gap-10 flex-1">
                <div className="flex flex-col gap-2">
                    <h1 className="text-5xl md:text-8xl font-black text-[var(--dash-text-main)] uppercase tracking-tighter leading-none">
                        QR<span> Codes</span>
                    </h1>
                    <p className="text-xl text-[var(--dash-text-muted)] max-w-2xl font-light">
                        Create, style, and export production-ready QR codes.
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8 items-start">
                    <div className="bg-[var(--dash-sidebar-bg)] border border-[var(--dash-border-light)] rounded-3xl p-6 md:p-8 space-y-6">
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
                        </form>

                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">QR Size</label>
                                    <input
                                        type="range"
                                        min={180}
                                        max={640}
                                        step={10}
                                        value={draftConfig.size}
                                        onChange={(e) => updateDraftConfig('size', Number(e.target.value))}
                                        className="w-full"
                                    />
                                    <p className="text-xs text-[var(--dash-text-muted)]">{draftConfig.size}px</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">Export Resolution</label>
                                    <select
                                        value={draftConfig.exportResolution}
                                        onChange={(e) => updateDraftConfig('exportResolution', Number(e.target.value))}
                                        className="w-full bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] rounded-xl px-3 py-2 text-sm text-[var(--dash-text-main)]"
                                    >
                                        <option value={512}>512 px</option>
                                        <option value={1024}>1024 px</option>
                                        <option value={2048}>2048 px</option>
                                        <option value={3072}>3072 px</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">Pattern</label>
                                    <select
                                        value={draftConfig.dotStyle}
                                        onChange={(e) => updateDraftConfig('dotStyle', e.target.value as DotStyle)}
                                        className="w-full bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] rounded-xl px-3 py-2 text-sm text-[var(--dash-text-main)]"
                                    >
                                        <option value="square">Square</option>
                                        <option value="dots">Dots</option>
                                        <option value="rounded">Rounded</option>
                                        <option value="classy">Classy</option>
                                        <option value="classy-rounded">Classy Rounded</option>
                                        <option value="extra-rounded">Extra Rounded</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">Error Correction</label>
                                    <select
                                        value={draftConfig.errorCorrectionLevel}
                                        onChange={(e) => updateDraftConfig('errorCorrectionLevel', e.target.value as ErrorCorrectionLevel)}
                                        className="w-full bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] rounded-xl px-3 py-2 text-sm text-[var(--dash-text-main)]"
                                    >
                                        <option value="L">L - 7%</option>
                                        <option value="M">M - 15%</option>
                                        <option value="Q">Q - 25%</option>
                                        <option value="H">H - 30%</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">Foreground</label>
                                    <input
                                        type="color"
                                        value={draftConfig.foregroundColor}
                                        onChange={(e) => updateDraftConfig('foregroundColor', e.target.value)}
                                        className="w-full h-11 bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] rounded-xl p-1"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">Background</label>
                                    <input
                                        type="color"
                                        value={draftConfig.backgroundColor}
                                        onChange={(e) => updateDraftConfig('backgroundColor', e.target.value)}
                                        className="w-full h-11 bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] rounded-xl p-1 disabled:opacity-50"
                                        disabled={draftConfig.transparentBackground}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">Outer Margin</label>
                                    <input
                                        type="range"
                                        min={4}
                                        max={32}
                                        step={1}
                                        value={draftConfig.margin}
                                        onChange={(e) => updateDraftConfig('margin', Number(e.target.value))}
                                        className="w-full"
                                    />
                                    <p className="text-xs text-[var(--dash-text-muted)]">{draftConfig.margin}px safe zone</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">Logo Margin</label>
                                    <input
                                        type="range"
                                        min={0}
                                        max={20}
                                        step={1}
                                        value={draftConfig.logoMargin}
                                        onChange={(e) => updateDraftConfig('logoMargin', Number(e.target.value))}
                                        className="w-full"
                                        disabled={!draftConfig.logoDataUrl}
                                    />
                                    <p className="text-xs text-[var(--dash-text-muted)]">{draftConfig.logoMargin}px</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    id="transparent-bg"
                                    type="checkbox"
                                    checked={draftConfig.transparentBackground}
                                    onChange={(e) => updateDraftConfig('transparentBackground', e.target.checked)}
                                    className="w-4 h-4 rounded border-[var(--dash-input-border)]"
                                />
                                <label htmlFor="transparent-bg" className="text-xs font-bold uppercase tracking-widest text-[var(--dash-text-main)]">
                                    Transparent background
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">QR Content</label>
                                <input
                                    type="text"
                                    value={draftConfig.content}
                                    onChange={(e) => updateDraftConfig('content', e.target.value)}
                                    placeholder="URL or text encoded in QR"
                                    className="w-full p-3 bg-[var(--dash-input-bg)] border border-[var(--dash-input-border)] text-[var(--dash-text-main)] placeholder-[var(--dash-input-placeholder)] rounded-xl focus:outline-none focus:border-[var(--dash-border-hover)]"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-3">
                                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--dash-border-light)] bg-[var(--dash-bg-subtle)] text-xs font-bold uppercase tracking-widest text-[var(--dash-text-main)] cursor-pointer hover:border-[var(--dash-border-hover)]">
                                        <Upload size={14} />
                                        Upload Logo
                                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => updateDraftConfig('logoDataUrl', '')}
                                        disabled={!draftConfig.logoDataUrl}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--dash-border-light)] bg-[var(--dash-bg-subtle)] text-xs font-bold uppercase tracking-widest text-[var(--dash-text-main)] disabled:opacity-40"
                                    >
                                        <Trash2 size={14} />
                                        Remove Logo
                                    </button>
                                </div>
                                {draftConfig.logoDataUrl && <p className="text-xs text-[var(--dash-text-muted)]">Logo embedded in center with safe margin.</p>}
                            </div>

                            <button
                                type="button"
                                onClick={applyNow}
                                className="w-full py-3 rounded-xl border border-[var(--dash-border-light)] bg-[var(--dash-bg-subtle)] text-[var(--dash-text-main)] hover:border-[var(--dash-border-hover)] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <Loader2 size={14} className={hasPendingChanges ? 'animate-spin' : ''} />
                                {hasPendingChanges ? `Applying changes in... ${applyCountdown}` : 'Apply changes now'}
                            </button>
                        </div>

                        {error && <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--dash-error)]">{error}</p>}
                    </div>

                    <div className="bg-[var(--dash-sidebar-bg)] border border-[var(--dash-border-light)] rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center gap-5 min-h-[420px]">
                        {appliedConfig.content ? (
                            <>
                                <div
                                    className="p-4 rounded-2xl border border-[var(--dash-border-light)]"
                                    style={{ backgroundColor: appliedConfig.transparentBackground ? 'transparent' : appliedConfig.backgroundColor }}
                                >
                                    <div ref={qrContainerRef} style={{ width: appliedConfig.size, height: appliedConfig.size, maxWidth: '100%' }} />
                                </div>

                                <div className="w-full flex flex-col gap-2">
                                    <span className="text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest">QR URL</span>
                                    <p className="text-sm font-mono break-all text-[var(--dash-text-main)]">{appliedConfig.content}</p>
                                </div>

                                {!!shortUrl && (
                                    <p className="w-full text-xs text-[var(--dash-text-muted)] break-all">
                                        Short link source: <span className="font-mono">{shortUrl}</span>
                                    </p>
                                )}

                                <div className="w-full grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleCopy}
                                        className="py-3 rounded-xl border border-[var(--dash-border-light)] bg-[var(--dash-bg-subtle)] text-[var(--dash-text-main)] hover:border-[var(--dash-border-hover)] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                        {copied ? 'Copied' : 'Copy URL'}
                                    </button>
                                    <button
                                        onClick={() => handleDownload('png')}
                                        className="py-3 rounded-xl bg-[var(--dash-button-bg)] text-[var(--dash-button-text)] hover:bg-[var(--dash-button-hover-bg)] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                        disabled={downloading !== null}
                                    >
                                        <Download size={14} />
                                        {downloading === 'png' ? 'Exporting...' : 'PNG'}
                                    </button>
                                    <button
                                        onClick={() => handleDownload('svg')}
                                        className="py-3 rounded-xl bg-[var(--dash-button-bg)] text-[var(--dash-button-text)] hover:bg-[var(--dash-button-hover-bg)] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                        disabled={downloading !== null}
                                    >
                                        <Download size={14} />
                                        {downloading === 'svg' ? 'Exporting...' : 'SVG'}
                                    </button>
                                    <button
                                        onClick={() => handleDownload('jpg')}
                                        className="py-3 rounded-xl bg-[var(--dash-button-bg)] text-[var(--dash-button-text)] hover:bg-[var(--dash-button-hover-bg)] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                        disabled={downloading !== null}
                                    >
                                        <Download size={14} />
                                        {downloading === 'jpg' ? 'Exporting...' : 'JPG'}
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

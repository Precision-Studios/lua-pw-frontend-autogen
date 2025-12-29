import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../api/axios';
import { Link, Copy, QrCode as QrIcon, ExternalLink } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [longUrl, setLongUrl] = useState('');
    const [qrUrl, setQrUrl] = useState('');

    const [shortenResult, setShortenResult] = useState(null);
    const [qrResult, setQrResult] = useState(null);

    const [loadingShorten, setLoadingShorten] = useState(false);
    const [loadingQr, setLoadingQr] = useState(false);
    const [error, setError] = useState('');

    const handleShorten = async (e) => {
        e.preventDefault();
        setError('');
        setShortenResult(null);
        setLoadingShorten(true);

        try {
            const response = await api.post('/generate_short_url', {
                longUrl: longUrl
            });
            setShortenResult(response.data);
            setLongUrl('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to shorten URL');
        } finally {
            setLoadingShorten(false);
        }
    };

    const handleGenerateQr = async (e) => {
        e.preventDefault();
        setError('');
        setQrResult(null);
        setLoadingQr(true);

        try {
            const response = await api.post('/generate_qr_code', {
                urlForQR: qrUrl
            });
            setQrResult(response.data);
            setQrUrl('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate QR code');
        } finally {
            setLoadingQr(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    return (
        <Layout>
            <div className="py-8">
                <h1 className="text-4xl font-black mb-8 uppercase border-b-4 border-black inline-block pr-6">
                    Dashboard
                </h1>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="bg-black text-white">
                        <h3 className="text-lg uppercase opacity-80">Total Short URLs</h3>
                        <p className="text-5xl font-black mt-2">{user?.totalShortUrls || 0}</p>
                    </Card>
                    <Card className="bg-black text-white">
                        <h3 className="text-lg uppercase opacity-80">Total QR Codes</h3>
                        <p className="text-5xl font-black mt-2">{user?.totalQRCodes || 0}</p>
                    </Card>
                    <Card className="bg-slate-200">
                        <h3 className="text-lg uppercase opacity-80">Account Tier</h3>
                        <p className="text-5xl font-black mt-2 text-slate-500">
                            {user?.userTier === 0 ? 'FREE' : 'PRO'}
                        </p>
                    </Card>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* URL Shortener */}
                    <div>
                        <Card title="Shorten URL" className="h-full">
                            <form onSubmit={handleShorten} className="flex flex-col gap-4">
                                <Input
                                    placeholder="HTTPS://EXAMPLE.COM/VERY-LONG-URL"
                                    value={longUrl}
                                    onChange={(e) => setLongUrl(e.target.value)}
                                    required
                                    type="url"
                                />
                                <Button type="submit" isLoading={loadingShorten} className="w-full">
                                    <Link size={18} /> Shorten It
                                </Button>
                            </form>

                            {shortenResult && (
                                <div className="mt-6 p-4 border-2 border-black bg-slate-50">
                                    <p className="text-sm uppercase font-bold text-slate-500 mb-1">Short Link Created:</p>
                                    <div className="flex items-center gap-2">
                                        <a href={shortenResult.shortUrl} target="_blank" rel="noopener noreferrer" className="font-mono font-bold text-lg hover:underline truncate flex-1">
                                            {shortenResult.shortUrl}
                                        </a>
                                        <Button variant="secondary" onClick={() => copyToClipboard(shortenResult.shortUrl)} className="px-2 py-1 text-xs">
                                            <Copy size={16} />
                                        </Button>
                                    </div>
                                    <div className="mt-2 text-xs text-slate-400">
                                        Expires: {new Date(shortenResult.expireAt).toLocaleDateString()}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* QR Generator */}
                    <div>
                        <Card title="Generate QR" className="h-full">
                            <form onSubmit={handleGenerateQr} className="flex flex-col gap-4">
                                <Input
                                    placeholder="HTTPS://EXAMPLE.COM/FOR-QR"
                                    value={qrUrl}
                                    onChange={(e) => setQrUrl(e.target.value)}
                                    required
                                    type="url"
                                />
                                <Button type="submit" isLoading={loadingQr} className="w-full">
                                    <QrIcon size={18} /> Generate QR
                                </Button>
                            </form>

                            {qrResult && (
                                <div className="mt-6 p-4 border-2 border-black bg-slate-50">
                                    <p className="text-sm uppercase font-bold text-slate-500 mb-2">QR Code Ready:</p>
                                    <div className="flex bg-white border-2 border-black p-4 justify-center">
                                        {/* Assuming the QR code is available at shortUrl?qr=true */}
                                        <img
                                            src={`${qrResult.shortUrl}?qr=true`}
                                            alt="QR Code"
                                            className="w-48 h-48 rendering-pixelated"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://placehold.co/200x200?text=QR+Valid'; // Fallback if image doesn't load directly
                                            }}
                                        />
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <a href={qrResult.shortUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold flex items-center gap-1 hover:underline">
                                            <ExternalLink size={14} /> Test Link
                                        </a>
                                        <div className="text-xs text-slate-400">
                                            Expires: {new Date(qrResult.expireAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;

import React, { useState } from 'react';
import { urlApi } from '@/lib/api';
import { Link, Loader2, ArrowRight } from 'lucide-react';

interface CreateUrlFormProps {
    onUrlCreated: (newUrl: any) => void;
}

const CreateUrlForm: React.FC<CreateUrlFormProps> = ({ onUrlCreated }) => {
    const [longUrl, setLongUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!longUrl) return;

        setLoading(true);
        setError(null);

        try {
            const response = await urlApi.shorten(longUrl);
            onUrlCreated(response.data);
            setLongUrl('');
        } catch (err) {
            console.error("Failed to shorten URL", err);
            setError("Failed to create short URL. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium mb-4 ml-1">
                Create New Link
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors">
                        <Link size={20} />
                    </div>
                    <input
                        type="text"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        placeholder="Paste your long URL here"
                        className="w-full p-4 pl-12 bg-[var(--input)] border border-[var(--input-border)] text-white placeholder-white/20 rounded-xl focus:outline-none focus:border-white/30 transition-all font-light"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-4 bg-white text-[var(--background)] font-bold rounded-xl hover:bg-gray-100 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Processing</span>
                        </>
                    ) : (
                        <>
                            <span>Shorten Link</span>
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>

            {error && (
                <p className="mt-3 text-red-400 text-xs animate-in fade-in slide-in-from-top-1 text-center font-mono">
                    {error}
                </p>
            )}
        </div>
    );
};

export default CreateUrlForm;

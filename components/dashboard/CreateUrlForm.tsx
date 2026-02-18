import React, { useState } from 'react';
import { urlApi } from '@/lib/api';
import { Link, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                <div className="relative group flex-1">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] group-focus-within:text-[var(--dash-primary-color)] transition-colors">
                        <Link size={18} />
                    </div>
                    <input
                        type="text"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        placeholder="Paste your long link here..."
                        className="w-full p-5 pl-14 bg-[var(--dash-input-bg)] backdrop-blur-md border border-[var(--dash-input-border)] text-[var(--dash-text-main)] placeholder-[var(--dash-input-placeholder)] rounded-2xl focus:outline-none focus:border-[var(--dash-primary-color)] hover:border-[var(--dash-border-hover)] transition-all font-light text-base lg:text-lg"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="md:px-10 py-5 bg-[var(--dash-button-bg)] text-[var(--dash-button-text)] font-black rounded-2xl hover:bg-[var(--dash-button-hover-bg)] uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg active:scale-[0.98]"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Processing</span>
                        </>
                    ) : (
                        <>
                            <span>Shorten</span>
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-red-400 text-[10px] text-center font-bold uppercase tracking-widest"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default CreateUrlForm;

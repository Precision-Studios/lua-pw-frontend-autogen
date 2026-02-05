'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface RedirectClientProps {
    longUrl: string;
}

export default function RedirectClient({ longUrl }: RedirectClientProps) {
    useEffect(() => {
        if (longUrl) {
            window.location.href = longUrl;
        }
    }, [longUrl]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <h1 className="text-2xl font-semibold animate-pulse">Redirecting you...</h1>
                <p className="text-gray-400">Taking you to your destination</p>
            </div>
        </div>
    );
}

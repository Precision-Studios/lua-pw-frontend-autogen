'use client';

import React from 'react';
import { QrCode, Construction, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import '@/app/Home.css';

export default function QrCodesPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-6rem)]">
            <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col gap-12 flex-1">
                {/* Header Section */}
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                        QR<span> Codes</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl font-light">
                        Generate and manage custom QR codes for your short links.
                    </p>
                </div>

                {/* Simplified Content (No Cards) */}
                <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 text-center py-12">
                    <div className="relative mb-10 group">
                        <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full scale-150 group-hover:bg-purple-500/30 transition-all duration-500"></div>
                        <div className="relative p-8 bg-white/5 rounded-full border border-white/10">
                            <QrCode size={80} className="text-purple-400 animate-pulse" />
                            <Construction size={28} className="absolute -bottom-2 -right-2 text-yellow-500 bg-[var(--background)] rounded-full p-1.5 border-2 border-[var(--background)]" />
                        </div>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6">
                        Feature Under<br /><span className="text-purple-400">Development</span>
                    </h2>

                    <p className="text-xl text-white/50 mb-12 max-w-xl font-medium leading-relaxed">
                        This feature is not available yet, sorry! We're building a seamless way to generate and track QR codes for your links.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/20"
                        >
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </Link>

                        <div className="px-10 py-5 bg-white/5 border border-white/10 text-white/40 rounded-full font-bold uppercase tracking-wider text-sm">
                            Coming Soon
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

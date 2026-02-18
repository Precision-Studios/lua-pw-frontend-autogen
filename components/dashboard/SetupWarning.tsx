'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, X, ArrowRight } from 'lucide-react';
import { useUser } from '@/lib/UserContext';
import { useRouter } from 'next/navigation';

export default function SetupWarning() {
    const { user, loading } = useUser();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [hasBeenShown, setHasBeenShown] = useState(false);

    useEffect(() => {
        if (!loading && user && user.setupComplete === false && !hasBeenShown) {
            setIsOpen(true);
            setHasBeenShown(true);
        }
    }, [user, loading, hasBeenShown]);

    if (!isOpen) return null;

    const handleGoToSettings = () => {
        setIsOpen(false);
        router.push('/dashboard/settings');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--dash-modal-overlay)] backdrop-blur-xl animate-in fade-in duration-700" onClick={() => setIsOpen(false)}>
            <div
                className="relative bg-[var(--dash-modal-bg)] p-10 md:p-14 rounded-[3rem] w-full max-w-lg flex flex-col items-center gap-8 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] scale-95 animate-in zoom-in-95 duration-500 border border-[var(--dash-border-light)] transform-gpu hover:scale-[0.98] transition-transform"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-8 right-8 text-[var(--dash-modal-close)] hover:text-[var(--dash-modal-close-hover)] transition-all p-2 hover:bg-[var(--dash-bg-subtle)] rounded-full group"
                >
                    <X size={24} className="group-rotate-90 transition-transform duration-300" />
                </button>

                <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                    <div className="relative w-24 h-24 rounded-[2rem] bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white shadow-2xl rotate-3">
                        <ShieldAlert size={48} />
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <h3 className="text-3xl font-black text-[var(--dash-modal-text)] uppercase tracking-tight leading-none">
                        Security <span className="text-amber-600">Action</span> Required
                    </h3>
                    <p className="text-[var(--dash-modal-text-muted)] text-base font-medium leading-relaxed max-w-sm mx-auto">
                        Your account is currently using a temporary initial password. For your security, please update it now.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-4 mt-2">
                    <button
                        onClick={handleGoToSettings}
                        className="w-full py-5 bg-[var(--dash-modal-text)] text-[var(--dash-modal-bg)] font-black rounded-2xl hover:opacity-90 transition-all uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 shadow-2xl hover:translate-y-[-4px] active:translate-y-0"
                    >
                        Change Password Now
                        <ArrowRight size={16} />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3 bg-transparent text-[var(--dash-modal-text-muted)] font-bold rounded-2xl hover:text-[var(--dash-modal-text)] transition-all uppercase tracking-widest text-[10px]"
                    >
                        I'll do it later
                    </button>
                </div>
            </div>
        </div>
    );
}

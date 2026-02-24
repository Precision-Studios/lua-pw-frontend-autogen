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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--dash-modal-overlay)] animate-in fade-in duration-700" onClick={() => setIsOpen(false)}>
            <div
                className="relative bg-[var(--dash-modal-bg)] p-10 md:p-14 rounded-[3rem] w-full max-w-lg flex flex-col items-center gap-8 scale-95 animate-in zoom-in-95 duration-500 border border-[var(--dash-border-light)]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-8 right-8 text-[var(--dash-modal-close)] hover:text-[var(--dash-modal-close-hover)] transition-all p-2 hover:bg-[var(--dash-bg-subtle)] rounded-full group"
                >
                    <X size={24} className="group-rotate-90 transition-transform duration-300" />
                </button>

                <div className="relative">
                    <div className="relative w-24 h-24 rounded-[2rem] bg-[var(--dash-bg-subtle)] border border-[var(--dash-border-light)] flex items-center justify-center text-[var(--dash-text-main)]">
                        <ShieldAlert size={48} />
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <h3 className="text-3xl font-black text-[var(--dash-modal-text)] uppercase tracking-tight leading-none">
                        Security Action Required
                    </h3>
                    <p className="text-[var(--dash-modal-text-muted)] text-base font-medium leading-relaxed max-w-sm mx-auto">
                        Your account is currently using a temporary initial password. For your security, please update it now.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-4 mt-2">
                    <button
                        onClick={handleGoToSettings}
                        className="w-full py-5 bg-[var(--dash-button-bg)] text-[var(--dash-button-text)] font-black rounded-2xl hover:bg-[var(--dash-button-hover-bg)] transition-all uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3"
                    >
                        Change Password Now
                        <ArrowRight size={16} />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3 bg-transparent text-[var(--dash-modal-text-muted)] font-bold rounded-2xl hover:text-[var(--dash-modal-text)] transition-all uppercase tracking-widest text-[10px]"
                    >
                        I&apos;ll do it later
                    </button>
                </div>
            </div>
        </div>
    );
}

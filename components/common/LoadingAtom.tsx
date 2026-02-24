'use client';

import React from 'react';

interface LoadingAtomProps {
    title?: string;
    subtitle?: string;
}

const LoadingAtom = ({
    title = "Initializing",
    subtitle = "Connecting to LUA Core"
}: LoadingAtomProps) => {
    return (
        <div className="inline-flex flex-col items-center justify-center gap-2 text-center">
            <div className="relative w-8 h-8" aria-hidden="true">
                <div className="absolute inset-0 rounded-full border-2 border-black/20" />
                <div
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-black border-r-black animate-spin"
                    style={{ animationDuration: '0.85s' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black/85" />
                </div>
            </div>

            <div className="flex flex-col items-center gap-1 animate-in fade-in zoom-in duration-700">
                <h2 className="text-black text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em]">
                    {title}
                </h2>
                <p className="text-black/70 text-[9px] uppercase tracking-[0.1em] font-medium max-w-[16rem]">
                    {subtitle}
                </p>
            </div>
        </div>
    );
};

export default LoadingAtom;

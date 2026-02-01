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
        <div className="flex flex-col items-center justify-center gap-10">
            <div className="relative w-40 h-40">
                {/* Subtle outer glow */}
                <div className="absolute inset-0 bg-blue-500/5 blur-[60px] rounded-full scale-150" />

                {/* Nucleus */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        <div className="w-5 h-5 bg-white rounded-full shadow-[0_0_25px_rgba(255,255,255,0.9)] z-10" />
                        <div className="absolute inset-0 w-5 h-5 bg-white rounded-full animate-ping opacity-20" />
                        <div className="absolute inset-[-8px] border border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
                    </div>
                </div>

                {/* SVG Orbits and Electrons */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
                            <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                        </linearGradient>
                    </defs>

                    {/* Orbit 1 - Horizontal */}
                    <ellipse
                        cx="50" cy="50" rx="48" ry="18"
                        fill="none"
                        stroke="url(#orbitGradient)"
                        strokeWidth="0.75"
                    />
                    {/* Orbit 2 - 60deg */}
                    <ellipse
                        cx="50" cy="50" rx="48" ry="18"
                        fill="none"
                        stroke="url(#orbitGradient)"
                        strokeWidth="0.75"
                        transform="rotate(60 50 50)"
                    />
                    {/* Orbit 3 - 120deg */}
                    <ellipse
                        cx="50" cy="50" rx="48" ry="18"
                        fill="none"
                        stroke="url(#orbitGradient)"
                        strokeWidth="0.75"
                        transform="rotate(120 50 50)"
                    />

                    {/* Electron 1 */}
                    <circle r="2.2" fill="white" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                        <animateMotion
                            dur="2.5s"
                            repeatCount="indefinite"
                            path="M 2,50 A 48,18 0 1,1 98,50 A 48,18 0 1,1 2,50"
                        />
                    </circle>

                    {/* Electron 2 */}
                    <g transform="rotate(60 50 50)">
                        <circle r="2.2" fill="white" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                            <animateMotion
                                dur="3.2s"
                                repeatCount="indefinite"
                                path="M 2,50 A 48,18 0 1,1 98,50 A 48,18 0 1,1 2,50"
                            />
                        </circle>
                    </g>

                    {/* Electron 3 */}
                    <g transform="rotate(120 50 50)">
                        <circle r="2.2" fill="white" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                            <animateMotion
                                dur="4.1s"
                                repeatCount="indefinite"
                                path="M 2,50 A 48,18 0 1,1 98,50 A 48,18 0 1,1 2,50"
                            />
                        </circle>
                    </g>
                </svg>
            </div>

            <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-1000">
                <div className="flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-white/30" />
                    <h2 className="text-white text-base font-black uppercase tracking-[0.5em] ml-[0.5em]">
                        {title}
                    </h2>
                    <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-white/30" />
                </div>
                <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] font-medium animate-pulse">
                    {subtitle}
                </p>
            </div>
        </div>
    );
};

export default LoadingAtom;

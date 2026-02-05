'use client';

import React, { useEffect, useState } from 'react';
import { Monitor, X } from 'lucide-react';

const MobileWarning: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if it's mobile and if warning has already been shown in this session
        const isMobile = window.innerWidth < 1024; // Aligning with hero-section breakpoint
        const hasBeenShown = sessionStorage.getItem('mobile-warning-shown');

        if (isMobile && !hasBeenShown) {
            setIsVisible(true);
            sessionStorage.setItem('mobile-warning-shown', 'true');
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 lg:hidden">
            {/* Backdrop / Overlay */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-500"
                onClick={() => setIsVisible(false)}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-[#0f172a] border border-white/10 shadow-2xl p-8 rounded-[2.5rem] overflow-hidden group animate-in zoom-in-95 fade-in duration-300">
                {/* Rotating decorative glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px] group-hover:bg-blue-600/30 transition-all duration-700" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-[80px] group-hover:bg-purple-600/30 transition-all duration-700" />

                <div className="flex flex-col gap-6 relative z-10 text-center items-center">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
                        <Monitor size={32} />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tight">
                            Desktop Optimized Site
                        </h3>
                        <p className="text-sm text-white/60 leading-relaxed font-medium">
                            This platform is designed for professional desktop workflows and may not exhibit optimal performance or rendering on mobile devices.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="w-full py-4 bg-white text-black hover:bg-white/90 text-sm font-bold rounded-2xl transition-all duration-300 active:scale-[0.98] shadow-xl shadow-white/5"
                    >
                        PROCEED ANYWAY
                    </button>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-xs text-white/40 hover:text-white/60 font-semibold tracking-widest uppercase transition-colors"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileWarning;

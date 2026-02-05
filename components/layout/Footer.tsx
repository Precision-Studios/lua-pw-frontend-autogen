'use client';

import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="w-full flex justify-center items-center py-6 px-6 mt-auto">
            <Link
                href="https://precisionstudios.tech/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Made with love by Precision Studios - Visit their website"
                className="group relative flex items-center gap-2 px-5 py-2.5 rounded-[1.25rem] border border-black/10 dark:border-white/10 bg-white/20 dark:bg-black/40 backdrop-blur-2xl hover:bg-white/30 dark:hover:bg-black/60 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
            >
                {/* Subtle Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-[1.25rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                <span className="relative z-10 text-[10px] md:text-[12px] font-bold tracking-[0.05em] text-black/70 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors flex items-center gap-2 uppercase">
                    Made with
                    <span className="text-red-500 inline-block transform group-hover:scale-125 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">❤️</span>
                    by
                    <span className="text-black/90 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors underline decoration-blue-500/30 underline-offset-4 decoration-2">
                        Precision Studios
                    </span>
                </span>
            </Link>
        </footer>
    );
};

export default Footer;

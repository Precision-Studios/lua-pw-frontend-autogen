import Image from 'next/image';

export default function LogoSection() {
    return (
        <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden bg-black lg:p-20">
            {/* Background Blend/Gradient */}
            <div className="absolute inset-0 opacity-40">
                <Image
                    src="/logo_full.jpg"
                    alt="Background Texture"
                    fill
                    className="object-cover blur-2xl scale-110"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/80 to-transparent" />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                <div className="relative w-48 h-48 lg:w-64 lg:h-64 mb-4">
                    <Image
                        src="/logo_full.jpg"
                        alt="LUA PW Logo"
                        fill
                        className="object-contain rounded-2xl shadow-2xl shadow-white/10"
                        priority
                    />
                </div>

                <div className="space-y-2">
                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-white">
                        LUA<span className="text-primary">.PW</span>
                    </h1>
                    <p className="text-xl lg:text-2xl text-zinc-400 font-light max-w-md">
                        The next generation of URL management. Simple, fast, and secure.
                    </p>
                </div>

                <div className="flex gap-8 pt-8 border-t border-white/10 w-full justify-center lg:justify-start">
                    <div className="text-center lg:text-left">
                        <div className="text-2xl font-bold text-white">100k+</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-widest">URLs Shortened</div>
                    </div>
                    <div className="text-center lg:text-left">
                        <div className="text-2xl font-bold text-white">50k+</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-widest">QR Codes</div>
                    </div>
                    <div className="text-center lg:text-left">
                        <div className="text-2xl font-bold text-white">99.9%</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-widest">Uptime</div>
                    </div>
                </div>
            </div>

            {/* Ambient background elements */}
            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/20 blur-[120px] rounded-full pointer-events-none" />
        </div>
    );
}

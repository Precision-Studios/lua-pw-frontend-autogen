import Image from 'next/image';

export default function LogoSection() {
    return (
        <div className="relative h-full w-full flex flex-col items-center justify-center bg-[#2c02ac] lg:p-20">
            {/* Hero Content */}
            <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">

                <div className="relative w-48 h-48 lg:w-64 lg:h-64 mb-2 lg:-ml-7">
                    <Image
                        src="/logo_full.jpg"
                        alt="LUA PW Logo"
                        fill
                        className="object-contain rounded-2xl"
                        priority
                    />
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl lg:text-8xl font-bold tracking-tighter text-white uppercase lg:-ml-2">
                        LUA<span className="opacity-60">.PW</span>
                    </h1>
                    <p className="text-xl lg:text-2xl text-white/80 font-normal max-w-md">
                        The next generation of URL management. Simple, fast, and secure.
                    </p>
                </div>

                <div className="flex gap-10 pt-10 border-t border-white/20 w-full justify-center lg:justify-start">
                    <div className="text-center lg:text-left">
                        <div className="text-3xl font-bold text-white">100k+</div>
                        <div className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-normal">URLs Shortened</div>
                    </div>
                    <div className="text-center lg:text-left">
                        <div className="text-3xl font-bold text-white">25k+</div>
                        <div className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-normal">QR Codes</div>
                    </div>
                    <div className="text-center lg:text-left">
                        <div className="text-3xl font-bold text-white">99.9%</div>
                        <div className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-normal">Uptime</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

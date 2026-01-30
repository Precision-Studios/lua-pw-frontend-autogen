'use client';

import { LogOut } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

const TopNav = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await authApi.logout();
            router.push('/');
        } catch (error) {
            console.error("Logout failed", error);
            router.push('/');
        }
    };

    return (
        <nav className="w-full py-6 px-4 md:px-8 flex items-center justify-end z-40">
            <button
                onClick={handleLogout}
                className="group flex items-center gap-5 px-5 py-3 rounded-full glass border border-white/10 hover:border-white/30 text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95"
            >
                <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="opacity-100">Sign Out</span>
            </button>
        </nav>
    );
};

export default TopNav;

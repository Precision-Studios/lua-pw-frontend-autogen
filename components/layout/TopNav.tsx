'use client';

import React from 'react';
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
                className="group flex items-center gap-3 px-6 py-3 rounded-xl glass border border-white/20 hover:border-white/40 text-xs font-bold text-white hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-95 uppercase tracking-widest shadow-none bg-white/5"
            >
                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Sign Out</span>
            </button>
        </nav>
    );
};

export default TopNav;

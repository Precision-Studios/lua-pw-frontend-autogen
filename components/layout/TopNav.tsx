'use client';

import { LogOut } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoadingAtom from '../common/LoadingAtom';

const TopNav = () => {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authApi.logout();
            router.push('/');
        } catch (error) {
            console.error("Logout failed", error);
            router.push('/');
        }
    };

    return (
        <>
            {isLoggingOut && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070b24]">
                    <LoadingAtom title="Signing Out" subtitle="Cleaning up session" />
                </div>
            )}
            <nav className="w-full py-6 px-4 md:px-8 flex items-center justify-end z-40">
                <button
                    onClick={handleLogout}
                    className="group flex items-center gap-5 px-5 py-3 rounded-full border border-[var(--dash-border-light)] hover:border-[var(--dash-border-hover)] text-[10px] font-black text-[var(--dash-text-main)] uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span className="opacity-100">Sign Out</span>
                </button>
            </nav>
        </>
    );
};

export default TopNav;

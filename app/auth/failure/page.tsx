'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingAtom from '@/components/common/LoadingAtom';
import '../../Home.css';

export default function AuthFailurePage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 3000); // 3 seconds to show the error
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <main className="main-container flex items-center justify-center bg-[#070b24]">
            <LoadingAtom title="Auth Failed" subtitle="Redirecting you to login..." />
        </main>
    );
}

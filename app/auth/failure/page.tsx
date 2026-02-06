'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingAtom from '@/components/common/LoadingAtom';
import Card from '@/components/common/Card';
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
            <Card active padding="p-5" borderRadius="rounded-xl">
                <LoadingAtom title="Auth Failed" subtitle="Redirecting you to login..." />
            </Card>
        </main>
    );
}

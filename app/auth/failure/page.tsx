'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthFailurePage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/login');
        }, 1000); // Small delay to show the message
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="glass rounded-2xl p-8 text-center backdrop-blur-xl max-w-md w-full mx-4">
                <h1 className="text-2xl font-bold text-red-400 mb-4 drop-shadow-md">Authentication Failed</h1>
                <p className="text-[var(--foreground-muted)]">Redirecting you to login...</p>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, userApi } from '@/lib/api';

export default function AuthSuccessPage() {
    const router = useRouter();
    const [status, setStatus] = useState<string>('Initializing session...');

    useEffect(() => {
        const initSession = async () => {
            try {
                // 1. Refresh Token Exchange
                await authApi.refresh();
                setStatus('Fetching user details...');

                // 2. Fetch User Details
                const response = await userApi.details();
                const user = response.data;

                // 3. Routing Logic
                setStatus('Redirecting...');
                if (!user.active) {
                    router.push('/account-suspended');
                } else if (!user.setupComplete) {
                    router.push('/setup-password');
                } else {
                    router.push('/dashboard');
                }
            } catch (err: any) {
                console.error('Auth initialization failed:', err);
                let errorMessage = 'Authentication failed. Redirecting to login...';

                if (err.response) {
                    errorMessage = `Auth Failed: ${err.response.status} ${err.response.statusText}`;
                    if (err.response.data && typeof err.response.data === 'string') {
                        errorMessage += ` - ${err.response.data}`;
                    } else if (err.response.data && err.response.data.message) {
                        errorMessage += ` - ${err.response.data.message}`;
                    }
                } else if (err.message) {
                    errorMessage = `Error: ${err.message}`;
                }

                setStatus(errorMessage);
                // Increase timeout to allow reading the error
                setTimeout(() => router.push('/login'), 25000);
            }
        };

        initSession();
    }, [router]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            {/* Background is handled by globals.css on body, but we can enforce or add overlay if needed. 
                Using the glass effect for the status card. */}
            <div className="glass flex flex-col items-center space-y-6 rounded-2xl p-8 backdrop-blur-xl">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--secondary)] border-t-transparent shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                <p className="text-[var(--foreground)] text-lg font-medium tracking-wide animate-pulse">{status}</p>
            </div>
        </div>
    );
}

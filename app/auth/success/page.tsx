'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, userApi } from '@/lib/api';
import LoadingAtom from '@/components/common/LoadingAtom';
import '../../Home.css';

export default function AuthSuccessPage() {
    const router = useRouter();
    const [status, setStatus] = useState<string>('Initializing session...');
    const [subStatus, setSubStatus] = useState<string>('Connecting to LUA Core');

    useEffect(() => {
        const initSession = async () => {
            try {
                // 1. Refresh Token Exchange
                await authApi.refresh();
                setStatus('Fetching user details...');
                setSubStatus('Retrieving profile from secure vault');

                // 2. Fetch User Details
                const response = await userApi.details();
                const user = response.data;

                // 3. Routing Logic
                setStatus('Redirecting...');
                setSubStatus('Syncing your dashboard');
                if (!user.active) {
                    router.push('/account-suspended');
                } else if (!user.setupComplete) {
                    router.push('/setup-password');
                } else {
                    router.push('/dashboard');
                }
            } catch (err: any) {
                console.error('Auth initialization failed:', err);
                let errorMessage = 'Authentication failed';
                let subError = 'Redirecting to login...';

                if (err.response) {
                    errorMessage = `Auth Failed: ${err.response.status}`;
                    subError = err.response.statusText;
                    if (err.response.data && typeof err.response.data === 'string') {
                        subError = err.response.data;
                    } else if (err.response.data && err.response.data.message) {
                        subError = err.response.data.message;
                    }
                } else if (err.message) {
                    subError = `Error: ${err.message}`;
                }

                setStatus(errorMessage);
                setSubStatus(subError);
                // Increase timeout to allow reading the error
                setTimeout(() => router.push('/'), 5000);
            }
        };

        initSession();
    }, [router]);

    return (
        <main className="main-container flex items-center justify-center bg-[#070b24]">
            <LoadingAtom title={status} subtitle={subStatus} />
        </main>
    );
}

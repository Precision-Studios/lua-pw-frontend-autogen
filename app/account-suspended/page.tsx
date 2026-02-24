'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import '../PublicPage.css';

export default function AccountSuspended() {
    return (
        <main className="public-page">
            <div className="public-card">
                <div className="public-icon-wrap">
                    <ShieldAlert className="w-10 h-10 text-[var(--public-text)]" />
                </div>

                <h1 className="public-title">Account Suspended</h1>

                <p className="public-subtitle">
                    Your account is currently inactive due to an administrative action. Dashboard features and new link creation are unavailable.
                </p>

                <div className="public-actions">
                    <Link
                        href="mailto:support@lua.pw"
                        className="public-btn public-btn-primary"
                    >
                        Contact Support
                    </Link>
                    <Link href="/" className="public-btn public-btn-secondary">
                        Back to Home
                    </Link>
                </div>
            </div>

            <div className="public-attribution">
                Made with ❤️ by <a href="https://precisionstudios.tech/" target="_blank" rel="noopener noreferrer">Precision Studios</a>
            </div>
        </main>
    );
}

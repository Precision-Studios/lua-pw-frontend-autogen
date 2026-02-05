'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function AccountSuspended() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg max-w-md w-full animate-in fade-in zoom-in duration-300">
                <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-red-500/20 text-red-400">
                        <ShieldAlert className="w-12 h-12" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-3 text-white">Account Suspended</h1>

                <p className="text-gray-400 mb-8 leading-relaxed">
                    Your account has been deactivated due to a violation of our terms or by administrative action.
                    You cannot access the dashboard or generate new links.
                </p>

                <Link
                    href="mailto:support@lua.pw"
                    className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-medium text-black transition-colors bg-white rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20"
                >
                    Contact Support
                </Link>

                <div className="mt-6 pt-6 border-t border-white/10">
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                        Back to Home
                    </Link>
                </div>
            </div>

            <div className="mt-8 text-[10px] text-gray-500 uppercase tracking-widest opacity-50">
                Made with ❤️ by <a href="https://precisionstudios.tech/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Precision Studios</a>
            </div>
        </div>
    );
}

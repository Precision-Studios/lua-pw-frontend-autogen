import { redirect } from 'next/navigation';
import { urlApi } from '@/lib/api';
import RedirectClient from '@/components/RedirectClient';

interface RedirectPageProps {
    params: { shortCode: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function RedirectPage({ params, searchParams }: RedirectPageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const { shortCode } = resolvedParams;
    const isQr = resolvedSearchParams.qr === 'true';

    // Logic for deciding whether to show the redirection page
    // Defaulting to false (instant redirect) as per requirement
    const shouldShowRedirectPage = false;

    let longUrl: string | null = null;
    let error: string | null = null;

    try {
        const response = await urlApi.getLongUrl({
            shortCode,
            fromQr: isQr,
            recordAnalytics: true,
        });

        if (response.data && response.data.longUrl) {
            longUrl = response.data.longUrl;
        } else {
            error = 'Invalid long URL received from server.';
        }
    } catch (err: any) {
        console.error('Redirection error:', err);
        if (err.response?.status === 404) {
            error = 'The link you are looking for does not exist.';
        } else {
            error = 'Something went wrong while resolving the link.';
        }
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white p-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <h1 className="text-4xl font-bold text-red-500">Oops!</h1>
                    <p className="text-xl text-gray-400">{error}</p>
                    <a
                        href="/"
                        className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                    >
                        Go to Homepage
                    </a>
                </div>
                <div className="absolute bottom-8 text-[10px] text-gray-500 uppercase tracking-widest opacity-50">
                    Made with ❤️ by <a href="https://precisionstudios.tech/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Precision Studios</a>
                </div>
            </div>
        );
    }

    if (longUrl) {
        if (shouldShowRedirectPage) {
            return <RedirectClient longUrl={longUrl} />;
        }

        // Instant Server-Side Redirect
        redirect(longUrl);
    }

    return null;
}

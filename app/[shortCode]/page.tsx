import RedirectClient from '@/components/RedirectClient';
import Link from 'next/link';
import '../PublicPage.css';

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

    let safeRedirectUrl: string | null = null;
    let error: string | null = null;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    console.log(`[RedirectPage] Resolving shortCode: "${shortCode}"`);

    // Skip resolution for common non-link paths that might fall through
    const reservedPaths = ['404', 'favicon.ico', 'robots.txt', 'sitemap.xml'];
    if (reservedPaths.includes(shortCode)) {
        console.log(`[RedirectPage] Skipping reserved path: ${shortCode}`);
        return (
            <main className="public-page">
                <div className="public-card">
                    <span className="public-tag">404</span>
                    <h1 className="public-title mt-6">Page Not Found</h1>
                    <p className="public-subtitle">The route you requested is not a short-link endpoint.</p>
                    <div className="public-actions">
                        <Link href="/" className="public-btn public-btn-primary">Go Home</Link>
                    </div>
                </div>
                <div className="public-attribution">
                    Made with ❤️ by <a href="https://precisionstudios.tech/" target="_blank" rel="noopener noreferrer">Precision Studios</a>
                </div>
            </main>
        );
    }

    try {
        if (!apiBaseUrl) {
            throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured.');
        }

        const endpoint = new URL('/api/v1/urls/get_long_url', apiBaseUrl);
        endpoint.searchParams.set('shortCode', shortCode);
        endpoint.searchParams.set('fromQr', String(isQr));
        endpoint.searchParams.set('recordAnalytics', 'true');

        const response = await fetch(endpoint.toString(), {
            cache: 'no-store',
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status === 404) {
                error = 'The link you are looking for does not exist.';
            } else {
                error = 'Something went wrong while resolving the link.';
            }
        } else {
            const data = (await response.json()) as { longUrl?: string };

            if (data?.longUrl) {
            try {
                const parsedUrl = new URL(data.longUrl);
                if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
                    error = 'This link uses an unsupported protocol.';
                } else {
                    safeRedirectUrl = parsedUrl.toString();
                }
            } catch {
                error = 'Invalid long URL received from server.';
            }
            } else {
                error = 'Invalid long URL received from server.';
            }
        }
    } catch (err: any) {
        console.error(`[RedirectPage] Error resolving "${shortCode}":`, err.message);
        error = 'Something went wrong while resolving the link.';
    }

    if (error) {
        return (
            <main className="public-page">
                <div className="public-card">
                    <span className="public-tag">Link Error</span>
                    <h1 className="public-title mt-6">Oops</h1>
                    <p className="public-subtitle">{error}</p>
                    <div className="public-actions">
                        <Link
                            href="/"
                            className="public-btn public-btn-primary"
                        >
                            Go to Homepage
                        </Link>
                    </div>
                </div>
                <div className="public-attribution">
                    Made with ❤️ by <a href="https://precisionstudios.tech/" target="_blank" rel="noopener noreferrer">Precision Studios</a>
                </div>
            </main>
        );
    }

    if (safeRedirectUrl) {
        if (shouldShowRedirectPage) {
            return <RedirectClient longUrl={safeRedirectUrl} />;
        }

        return <RedirectClient longUrl={safeRedirectUrl} />;
    }

    return null;
}

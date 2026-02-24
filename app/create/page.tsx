import Link from 'next/link';
import '../PublicPage.css';

export default function CreatePage() {
    return (
        <main className="public-page">
            <div className="public-card">
                <span className="public-tag">New Endpoint</span>
                <h1 className="public-title mt-6">
                    Create
                </h1>
                <p className="public-subtitle">
                    This endpoint is reserved for upcoming creation workflows and is currently being finalized.
                </p>
                <div className="public-actions">
                    <Link href="/dashboard" className="public-btn public-btn-primary">
                        Open Dashboard
                    </Link>
                    <Link href="/" className="public-btn public-btn-secondary">
                        Back Home
                    </Link>
                </div>
            </div>
            <div className="public-attribution">
                Made with ❤️ by <a href="https://precisionstudios.tech/" target="_blank" rel="noopener noreferrer">Precision Studios</a>
            </div>
        </main>
    );
}

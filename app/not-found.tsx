import Link from 'next/link'
import './PublicPage.css'

export default function NotFound() {
    return (
        <main className="public-page">
            <div className="public-card">
                <span className="public-tag">404</span>
                <h1 className="public-title mt-6">Page Not Found</h1>
                <p className="public-subtitle">
                    The page you are looking for does not exist or has been moved.
                </p>
                <div className="public-actions">
                    <Link href="/" className="public-btn public-btn-primary">Return Home</Link>
                </div>
            </div>
            <div className="public-attribution">
                Made with ❤️ by <a href="https://precisionstudios.tech/" target="_blank" rel="noopener noreferrer">Precision Studios</a>
            </div>
        </main>
    )
}

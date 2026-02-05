import Link from 'next/link'
import './globals.css'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white p-4">
            <div className="max-w-md w-full text-center space-y-6 relative z-10">
                <h1 className="text-6xl font-bold text-blue-600">404</h1>
                <h2 className="text-2xl font-semibold">Page Not Found</h2>
                <p className="text-gray-400">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-all transform hover:scale-105"
                >
                    Return Home
                </Link>
            </div>
            <div className="absolute bottom-8 text-[10px] text-gray-500 uppercase tracking-widest opacity-50 z-0">
                Made with ❤️ by <a href="https://precisionstudios.tech/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Precision Studios</a>
            </div>
        </div>
    )
}

import Image from 'next/image';
import './LogoSection.css';

export default function LogoSection() {
    return (
        <div className="logo-hero-container">
            {/* Hero Content */}
            <div className="logo-content">

                <div className="logo-image-wrapper">
                    <Image
                        src="/logo_full.png"
                        alt="LUA PW Logo"
                        fill
                        className="object-contain rounded-2xl"
                        priority
                    />
                </div>

                <div className="hero-text-container">
                    <h1 className="hero-title">
                        LUA<span>.PW</span>
                    </h1>
                    <p className="hero-description">
                        The next generation of URL management. Simple, fast, and secure.
                    </p>
                </div>

                <div className="stats-container">
                    <div className="stat-item">
                        <div className="stat-value">100k+</div>
                        <div className="stat-label">URLs Shortened</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">25k+</div>
                        <div className="stat-label">QR Codes</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">99.9%</div>
                        <div className="stat-label">Uptime</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

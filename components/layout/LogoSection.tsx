import Image from 'next/image';
import Card from '@/components/common/Card';
import './LogoSection.css';

export default function LogoSection() {
    return (
        <div className="logo-hero-container">
            {/* Hero Content */}
            <div className="logo-content">

                <div className="logo-image-wrapper">
                    <Image
                        src="/logo_full_compressed.png"
                        alt="LUA PW Logo"
                        fill
                        sizes="(max-width: 1024px) 128px, 192px"
                        className="object-contain rounded-2xl"
                        priority
                    />
                </div>

                <div className="hero-text-container">
                    <h1 className="hero-title">
                        LUA<span>.PW</span>
                    </h1>
                    <p className="hero-description">
                        The next generation of URL management. <span className="cycling-glow simple">Simple</span>, <span className="cycling-glow fast">fast</span>, and <span className="cycling-glow secure">secure</span>.
                    </p>
                </div>

                <Card active hoverable shadow={false} blur="md" padding="p-6" borderRadius="rounded-3xl" className="stats-card-main">
                    <div className="stats-container-inner">
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
                            <div className="stat-label">Observed Uptime</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

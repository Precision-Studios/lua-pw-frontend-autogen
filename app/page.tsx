import AuthForm from '@/components/auth/AuthForm';
import LogoSection from '@/components/layout/LogoSection';
import './Home.css';

export default function Home() {
  return (
    <main className="main-container">
      {/* Left Section - Hero/Logo  (Visible on desktop) */}
      <section className="hero-section">
        <LogoSection />
      </section>

      {/* Mobile Header (Visible on mobile only) */}
      <div className="mobile-header">
        <h1 className="mobile-title">
          LUA<span>.PW</span>
        </h1>
      </div>

      {/* Right Section - Auth */}
      <section className="auth-section">
        <AuthForm />
      </section>
    </main>
  );
}

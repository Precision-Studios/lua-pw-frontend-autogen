'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import LogoSection from '@/components/layout/LogoSection';
import { authApi, userApi } from '@/lib/api';
import LoadingAtom from '@/components/common/LoadingAtom';
import Card from '@/components/common/Card';
import './Home.css';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to refresh the session
        await authApi.refresh();

        // If refresh works, get user details for routing logic
        const response = await userApi.details();
        const user = response.data;

        if (!user.active) {
          router.push('/account-suspended');
        } else if (!user.setupComplete) {
          router.push('/setup-password');
        } else {
          router.push('/dashboard');
        }
      } catch {
        // If refresh fails, show the login page
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <main className="main-container flex items-center justify-center p-12">
        <Card active blur="none" padding="p-5" borderRadius="rounded-xl" className="home-flat-card">
          <LoadingAtom />
        </Card>
      </main>
    );
  }

  return (
    <main className="main-container">
      {/* Left Section - Hero/Logo  (Visible on desktop) */}
      <section className="hero-section">
        <LogoSection />
      </section>

      {/* Mobile Header (Visible on mobile only) */}
      <div className="mobile-header">
        <h1 className="mobile-title">Lua.pw</h1>
      </div>

      {/* Right Section - Auth */}
      <section className="auth-section">
        <AuthForm />
      </section>

      {/* Project Attribution */}
      <div className="attribution-container">
        <span>Made with ❤️ by <a href="https://precisionstudios.tech/" target="_blank" rel="noopener noreferrer">Precision Studios</a></span>
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import LogoSection from '@/components/layout/LogoSection';
import { authApi, userApi } from '@/lib/api';
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
      } catch (error) {
        // If refresh fails, show the login page
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <main className="main-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
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

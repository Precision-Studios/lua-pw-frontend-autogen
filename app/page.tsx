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
  const [shouldPreloadBg, setShouldPreloadBg] = useState(false);

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

  useEffect(() => {
    // Lazy preload dashboard background after landing page finishes
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 2000));
    idleCallback(() => setShouldPreloadBg(true));
  }, []);

  if (loading) {
    return (
      <main className="main-container flex items-center justify-center p-12 bg-[#070b24]">
        <Card active padding="p-5" borderRadius="rounded-xl">
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
        <h1 className="mobile-title">
          LUA<span>.PW</span>
        </h1>
      </div>

      {/* Right Section - Auth */}
      <section className="auth-section">
        <AuthForm />
      </section>

      {/* Project & Photo Attribution */}
      <div className="attribution-container">
        <span>Made with ❤️ by <a href="https://precisionstudios.tech/" target="_blank" rel="noopener noreferrer">Precision Studios</a></span>
        <span className="opacity-30">|</span>
        <span>Photo by <a href="https://unsplash.com/@peter_mc_greats?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Pietro De Grandi</a> on <a href="https://unsplash.com/photos/three-brown-wooden-boat-on-blue-lake-water-taken-at-daytime-T7K4aEPoGGk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></span>
      </div>

      {/* Preload and decode dashboard background after landing page finishes */}
      {shouldPreloadBg && (
        <div
          style={{ display: 'none', backgroundImage: "url('/ken-cheung-KonWFWUaAuk-unsplash.jpg')" }}
          aria-hidden="true"
        />
      )}
    </main>
  );
}

import AuthForm from '@/components/auth/AuthForm';
import LogoSection from '@/components/layout/LogoSection';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row bg-black">
      {/* Left Section - Hero/Logo (Visible on desktop) */}
      <section className="hidden lg:flex lg:w-3/5 xl:w-[65%] border-r border-white/5">
        <LogoSection />
      </section>

      {/* Mobile Header (Visible on mobile only) */}
      <div className="lg:hidden w-full p-8 flex justify-center bg-black border-b border-white/5">
        <h1 className="text-3xl font-bold tracking-tighter text-white">
          LUA<span className="text-primary">.PW</span>
        </h1>
      </div>

      {/* Right Section - Auth */}
      <section className="flex-1 flex items-center justify-center p-6 relative">
        {/* Decorative background for mobile/small screens */}
        <div className="lg:hidden absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/30 blur-[100px] rounded-full" />
        </div>

        <AuthForm />
      </section>
    </main>
  );
}

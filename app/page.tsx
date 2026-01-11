import AuthForm from '@/components/auth/AuthForm';
import LogoSection from '@/components/layout/LogoSection';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row bg-[#2c02ac]">
      {/* Left Section - Hero/Logo (Visible on desktop) */}
      <section className="hidden lg:flex lg:w-3/5 xl:w-[65%]">
        <LogoSection />
      </section>

      {/* Mobile Header (Visible on mobile only) */}
      <div className="lg:hidden w-full p-8 flex justify-center border-b border-white/10">
        <h1 className="text-4xl font-black tracking-tighter text-white">
          LUA<span className="opacity-70">.PW</span>
        </h1>
      </div>

      {/* Right Section - Auth */}
      <section className="flex-1 flex items-center justify-center p-6 relative">
        <AuthForm />
      </section>
    </main>
  );
}

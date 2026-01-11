'use client';

import { useState } from 'react';
import { Github, Chrome, Lock, User, ArrowRight } from 'lucide-react';

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleOAuth = (provider: 'google' | 'github') => {
        window.location.href = `http://localhost:5000/oauth2/authorization/${provider}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = '/create';
    };

    return (
        <div className="w-full max-w-md space-y-8 p-10 glass rounded-[2rem] animate-in">
            <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
                    {isLogin ? 'Welcome Back' : 'Join LUA.PW'}
                </h2>
                <p className="text-white/60 text-sm font-normal">
                    {isLogin
                        ? 'Enter your credentials to access your account'
                        : 'Sign up via OAuth to get started'}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleOAuth('google')}
                    className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white"
                >
                    <Chrome className="w-5 h-5" />
                    <span className="text-xs font-normal uppercase tracking-widest">Google</span>
                </button>
                <button
                    onClick={() => handleOAuth('github')}
                    className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white"
                >
                    <Github className="w-5 h-5" />
                    <span className="text-xs font-normal uppercase tracking-widest">GitHub</span>
                </button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-normal">
                    <span className="bg-black/20 px-4 text-white/40">Or continue with</span>
                </div>
            </div>

            {isLogin ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-normal text-white/50 uppercase tracking-widest ml-1">UserId or Email</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="text"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-all text-white placeholder:text-white/20 font-normal"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-normal text-white/50 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="password"
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-all text-white placeholder:text-white/20 font-normal"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-5 bg-white text-[#2c02ac] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 mt-4 text-sm"
                    >
                        Sign In
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            ) : (
                <div className="text-center py-10 px-6 border border-white/10 rounded-2xl bg-white/5">
                    <p className="text-white/60 text-sm font-normal leading-relaxed">
                        Please sign up using Google or GitHub OAuth.
                        <br />
                        We don't support manual email registrations.
                    </p>
                </div>
            )}

            <div className="text-center">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[10px] font-normal text-white/40 hover:text-white uppercase tracking-widest transition-colors hover:underline underline-offset-4"
                >
                    {isLogin
                        ? "Don't have an account? Sign up via OAuth"
                        : "Already have an account? Sign In"}
                </button>
            </div>
        </div>
    );
}

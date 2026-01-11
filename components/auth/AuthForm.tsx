'use client';

import { useState } from 'react';
import { Github, Chrome, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleOAuth = (provider: 'google' | 'github') => {
        window.location.href = `http://localhost:5000/oauth2/authorization/${provider}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Implementation for login will go here
        console.log('Logging in with:', { email, password });
        window.location.href = '/create'; // Redirecting to empty create page as requested
    };

    return (
        <div className="w-full max-w-md space-y-8 p-8 glass rounded-3xl animate-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    {isLogin ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-zinc-400">
                    {isLogin
                        ? 'Enter your credentials to access your account'
                        : 'Sign up via OAuth to get started'}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleOAuth('google')}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass hover:bg-white/10 transition-all active:scale-95"
                >
                    <Chrome className="w-5 h-5" />
                    <span className="text-sm font-medium">Google</span>
                </button>
                <button
                    onClick={() => handleOAuth('github')}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass hover:bg-white/10 transition-all active:scale-95"
                >
                    <Github className="w-5 h-5" />
                    <span className="text-sm font-medium">GitHub</span>
                </button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-4 text-zinc-500">Or continue with</span>
                </div>
            </div>

            {isLogin ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300 ml-1">UserId or Email</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-white"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                    >
                        Sign In
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
            ) : (
                <div className="text-center py-8 glass rounded-2xl border-dashed">
                    <p className="text-zinc-400 italic">
                        Manual registration is disabled. <br />
                        Please use Google or GitHub to create an account.
                    </p>
                </div>
            )}

            <div className="text-center">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                    {isLogin
                        ? "Don't have an account? Sign up via OAuth"
                        : "Already have an account? Sign In"}
                </button>
            </div>
        </div>
    );
}

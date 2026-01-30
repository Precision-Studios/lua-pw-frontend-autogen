'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import UserAvatar from './UserAvatar';
import PasswordUpdateModal from '../profile/PasswordUpdateModal';
import Toast, { ToastType } from '../common/Toast';

interface ToastState {
    message: string;
    type: ToastType;
}

const Navbar = () => {
    const router = useRouter();
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);

    const handleLogout = async () => {
        try {
            await authApi.logout();
            router.push('/');
        } catch (error) {
            console.error("Logout failed", error);
            router.push('/');
        }
    };

    const handlePasswordUpdateSuccess = () => {
        setToast({
            message: 'Password updated successfully',
            type: 'success',
        });
    };

    return (
        <>
            <nav className="w-full py-6 px-4 md:px-8 flex items-center justify-end z-40">
                {/* Logo removed - now in Sidebar */}

                <div className="flex items-center gap-4">
                    {/* User Avatar with Dropdown */}
                    <UserAvatar onUpdatePassword={() => setIsPasswordModalOpen(true)} />

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white uppercase tracking-widest transition-colors"
                    >
                        <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </nav>

            {/* Password Update Modal */}
            <PasswordUpdateModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSuccess={handlePasswordUpdateSuccess}
            />

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
};

export default Navbar;

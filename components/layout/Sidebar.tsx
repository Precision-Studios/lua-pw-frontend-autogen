'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Link as LinkIcon,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    QrCode
} from 'lucide-react';

interface SidebarItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isCollapsed: boolean;
    isActive: boolean;
}

const SidebarItem = ({ href, icon, label, isCollapsed, isActive }: SidebarItemProps) => {
    return (
        <Link
            href={href}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive
                    ? 'bg-white text-primary'
                    : 'text-white/60 hover:text-white hover:bg-white/10'}`}
        >
            <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {icon}
            </div>
            {!isCollapsed && (
                <span className="font-semibold uppercase tracking-wider text-sm whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                    {label}
                </span>
            )}
        </Link>
    );
};

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { href: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { href: '/dashboard/links', icon: <LinkIcon size={20} />, label: 'My Links' },
        { href: '/dashboard/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
        { href: '/dashboard/qr-codes', icon: <QrCode size={20} />, label: 'QR Codes' },
        { href: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden fixed top-6 left-4 z-[60] p-2 rounded-lg bg-white/10 text-white backdrop-blur-md border border-white/20"
            >
                {isMobileOpen ? <ChevronLeft size={20} /> : <div className="flex flex-col gap-1 w-5"><div className="h-0.5 w-full bg-white"></div><div className="h-0.5 w-full bg-white"></div><div className="h-0.5 w-full bg-white"></div></div>}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                className={`fixed left-6 top-6 bottom-6 transition-all duration-500 ease-in-out z-50 flex flex-col glass rounded-[2.5rem] border border-white/10 shadow-2xl shadow-black/40
                    ${isCollapsed ? 'w-24' : 'w-72'}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-[calc(100%+3rem)] md:translate-x-0'}
                `}
            >
                {/* Logo/Header */}
                <div className="p-6 h-24 flex items-center justify-between border-b border-white/10">
                    {!isCollapsed && (
                        <Link href="/dashboard" className="text-2xl font-black text-white uppercase tracking-tight">
                            LUA<span className="opacity-70">.PW</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors ml-auto"
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.href}
                            {...item}
                            isCollapsed={isCollapsed}
                            isActive={pathname === item.href}
                        />
                    ))}
                </nav>

                {/* Footer / User Info could go here */}
                <div className="p-6 border-t border-white/10">
                    {!isCollapsed && (
                        <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
                            V 1.0.0
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

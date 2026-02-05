'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import { UserProvider } from '@/lib/UserContext';

import './dashboard.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <UserProvider>
            <div className="flex min-h-screen dashboard-wrapper">
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <div
                    className={`flex-1 transition-all duration-500 ease-in-out ${isCollapsed ? 'md:pl-32' : 'md:pl-80'
                        } w-full flex flex-col`}
                >
                    <TopNav />
                    <main className="flex-1 w-full relative z-10">
                        {children}
                    </main>
                    <div className="dash-attribution">
                        <span>Made with ❤️ by <a href="https://precisionstudios.tech/" target="_blank" rel="noopener noreferrer">Precision Studios</a></span>
                        <span className="opacity-30">|</span>
                        <span>Photo by <a href="https://unsplash.com/@kencheungphoto?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ken Cheung</a> on <a href="https://unsplash.com/photos/tree-on-body-of-water-near-mountains-KonWFWUaAuk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></span>
                    </div>
                </div>
            </div>
        </UserProvider>
    );
}

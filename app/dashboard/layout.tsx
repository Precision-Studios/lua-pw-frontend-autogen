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
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <UserProvider>
            <div className="flex min-h-screen dashboard-wrapper">
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <div
                    className={`flex-1 transition-all duration-500 ease-in-out ${isCollapsed ? 'md:pl-20' : 'md:pl-72'
                        } w-full flex flex-col`}
                >
                    <TopNav />
                    {children}
                    <div className="dash-attribution">
                        Photo by <a href="https://unsplash.com/@zamax?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Gustavo Zambelli</a> on <a href="https://unsplash.com/photos/night-sky-filled-with-stars-and-silhouettes--JMK4lyhnGM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                    </div>
                </div>
            </div>
        </UserProvider>
    );
}

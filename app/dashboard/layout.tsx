'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import { UserProvider } from '@/lib/UserContext';
import SetupWarning from '@/components/dashboard/SetupWarning';

import './dashboard.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <UserProvider>
            <SetupWarning />
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
                </div>
            </div>
        </UserProvider>
    );
}

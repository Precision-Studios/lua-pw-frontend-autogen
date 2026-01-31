'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import { UserProvider } from '@/lib/UserContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <UserProvider>
            <div className="flex min-h-screen bg-transparent">
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <div
                    className={`flex-1 transition-all duration-500 ease-in-out ${isCollapsed ? 'md:pl-20' : 'md:pl-72'
                        } w-full flex flex-col`}
                >
                    <TopNav />
                    {children}
                </div>
            </div>
        </UserProvider>
    );
}

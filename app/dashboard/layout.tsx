'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-[var(--background)]">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div
                className={`flex-1 transition-all duration-500 ease-in-out ${isCollapsed ? 'md:pl-20' : 'md:pl-72'
                    } w-full`}
            >
                {children}
            </div>
        </div>
    );
}

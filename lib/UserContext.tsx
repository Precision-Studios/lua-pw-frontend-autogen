'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userApi } from '@/lib/api';

export interface SecureUserResponse {
    userId: string;
    joinedOn: string;
    userTier: number;
    emailAddress: string;
    totalShortUrls: number;
    totalQRCodes: number;
    active: boolean;
    setupComplete: boolean;
}

interface UserContextType {
    user: SecureUserResponse | null;
    loading: boolean;
    refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SecureUserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await userApi.details();
            setUser(res.data);
        } catch (err) {
            console.error('Failed to load user details', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const refetchUser = async () => {
        setLoading(true);
        await fetchUser();
    };

    return (
        <UserContext.Provider value={{ user, loading, refetchUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

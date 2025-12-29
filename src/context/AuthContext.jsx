import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('jwtToken'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('jwtToken');

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setIsLoading(false);
    }, []);

    const login = async (idOrEmail, password) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', {
                idOrEmailIdentifier: idOrEmail,
                userPassword: password,
            });

            // API returns { secureUserResponse: {...}, jwtKey: "..." }
            const { secureUserResponse, jwtKey } = response.data;

            setToken(jwtKey);
            setUser(secureUserResponse);
            localStorage.setItem('jwtToken', jwtKey);
            localStorage.setItem('user', JSON.stringify(secureUserResponse));
            return { success: true };
        } catch (error) {
            console.error('Login failed', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        } finally {
            setIsLoading(false);
        }
    };



    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
    };

    const updateUser = async (userId, newPassword) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/update', {
                userId: userId,
                newPassword: newPassword
            });

            // Expected response: { secureUserResponse: {...} }
            const { secureUserResponse } = response.data;

            // Update local user state
            setUser(secureUserResponse);
            localStorage.setItem('user', JSON.stringify(secureUserResponse));

            return { success: true };
        } catch (error) {
            console.error('Update failed', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Update failed'
            };
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token,
            isLoading,
            login,
            updateUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Layout from '../components/Layout';

const AuthSuccess = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { updateUser } = useAuth(); // We need to update user password
    const navigate = useNavigate();

    // Helper to get cookie by name
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    useEffect(() => {
        const token = getCookie('auth_token');
        if (token) {
            localStorage.setItem('jwtToken', token);
            // We might need to decode the token to get userId if it's not in the token response for some reason,
            // but usually the next API call will work with just the token.
            // However, updateUser needs userId.
            // If the backend doesn't provide user info in cookie (just token), we might need to fetch user profile first.
            // But wait, the previous Context logic fetched user from localStorage or had it from login response.
            // Here we only have a token.
            // We probably need a way to "fetch current user" with the token if we don't have the user object.
            // But the 'updateUser' function I wrote takes userId.
            // Let's assume for a moment we can get userId from the decoded token or we need to hit a /me endpoint?
            // The API doesn't show a /me endpoint.
            // It shows /api/v1/auth/update requires userId.

            // WORKAROUND: For now, I'll rely on the fact that maybe the Backend is okay if I don't send userId if the token implies it?
            // checking API spec: UserUpdateRequest requires userId.
            // I'll need to extract userId from the JWT token.

        } else {
            // If no token in cookie, maybe we already have it in localStorage from a previous session?
            // Or redirect to failure?
            const localToken = localStorage.getItem('jwtToken');
            if (!localToken) {
                navigate('/auth/failure');
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 12 || password.length > 16) {
            return setError('Password must be between 12 and 16 characters');
        }

        setLoading(true);

        // We need userId. Decode token to find it.
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError("Session expired. Please login again.");
            setLoading(false);
            return;
        }

        let userId = '';
        try {
            // Basic jwt decode
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const decoded = JSON.parse(jsonPayload);
            // Adjust this based on your actual JWT structure. Commonly 'sub' or 'id'.
            userId = decoded.sub || decoded.id || decoded.userId;
        } catch (e) {
            console.error("Failed to decode token", e);
            setError("Invalid session.");
            setLoading(false);
            return;
        }

        const result = await updateUser(userId, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto mt-10">
                <Card title="Set Password">
                    <p className="mb-4 text-sm text-gray-600">
                        Please set a password for your account to complete registration.
                    </p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block font-bold mb-2 uppercase">New Password (12-16 chars)</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={12}
                                maxLength={16}
                                placeholder="••••••••••••"
                            />
                        </div>

                        <div>
                            <label className="block font-bold mb-2 uppercase">Confirm Password</label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="••••••••••••"
                            />
                        </div>

                        <Button type="submit" isLoading={loading} className="mt-4 w-full">
                            Set Password & Continue
                        </Button>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default AuthSuccess;

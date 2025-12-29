import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

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

        const result = await register(email, password);

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
                <Card title="Register">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block font-bold mb-2 uppercase">Email Address</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="YOUR@EMAIL.COM"
                            />
                        </div>

                        <div>
                            <label className="block font-bold mb-2 uppercase">Password (12-16 chars)</label>
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
                            Create Account
                        </Button>

                        <p className="mt-4 text-center text-sm">
                            ALREADY HAVE AN ACCOUNT? <Link to="/login" className="underline font-bold">LOGIN HERE</Link>
                        </p>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default Register;

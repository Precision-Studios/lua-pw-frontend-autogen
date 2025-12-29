import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

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
                <Card title="Login">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block font-bold mb-2 uppercase">Email / ID</label>
                            <Input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="ENTER EMAIL OR ID"
                            />
                        </div>

                        <div>
                            <label className="block font-bold mb-2 uppercase">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <Button type="submit" isLoading={loading} className="mt-4 w-full">
                            Login
                        </Button>

                        <p className="mt-4 text-center text-sm">
                            DON'T HAVE AN ACCOUNT? <Link to="/register" className="underline font-bold">REGISTER HERE</Link>
                        </p>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default Login;

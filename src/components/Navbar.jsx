import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { LogOut, User, LayoutDashboard, Home } from 'lucide-react';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="border-b-4 border-black p-4 mb-8 bg-white">
            <div className="container flex justify-between items-center">
                <Link to="/" className="text-2xl font-black tracking-tighter hover:underline decoration-4">
                    LUA.URL
                </Link>

                <div className="flex gap-4 items-center">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard">
                                <Button variant="secondary" className="hidden sm:inline-flex">
                                    <LayoutDashboard size={18} /> Dashboard
                                </Button>
                            </Link>
                            <div className="font-bold hidden sm:block">
                                {user?.emailAddress}
                            </div>
                            <Button onClick={handleLogout} className="bg-black text-white px-3">
                                <LogOut size={18} />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="secondary">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Register</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

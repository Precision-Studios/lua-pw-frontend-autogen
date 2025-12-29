import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { ArrowRight } from 'lucide-react';

const Home = () => {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-3xl mx-auto">
                <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none">
                    LUA.URL
                </h1>
                <p className="text-xl md:text-2xl font-bold mb-10 uppercase tracking-widest">
                    Brutally Simple URL Shortener
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/register">
                        <Button className="text-xl px-8 py-4 border-4 shadow-[8px_8px_0_0_#000000] hover:shadow-[10px_10px_0_0_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                            Get Started <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="secondary" className="text-xl px-8 py-4 border-4">
                            Login
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full text-left">
                    <div className="border-l-4 border-black pl-4">
                        <h3 className="font-black text-xl mb-2">FAST</h3>
                        <p>Lightning quick redirection for your links.</p>
                    </div>
                    <div className="border-l-4 border-black pl-4">
                        <h3 className="font-black text-xl mb-2">SIMPLE</h3>
                        <p>No clutter. Just the tools you need.</p>
                    </div>
                    <div className="border-l-4 border-black pl-4">
                        <h3 className="font-black text-xl mb-2">SECURE</h3>
                        <p>Protected user accounts and data.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;

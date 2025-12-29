import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <main className="container flex-grow">
                {children}
            </main>
            <footer className="border-t-4 border-black p-6 mt-12 text-center uppercase font-bold text-sm">
                <p>&copy; {new Date().getFullYear()} LUA.PW // BRUTALIST SHORTENER</p>
            </footer>
        </div>
    );
};

export default Layout;

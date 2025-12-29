import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            {children}
            {/* Optional Footer if needed, keeping it minimal/empty for now as per sample */}
        </>
    );
};

export default Layout;


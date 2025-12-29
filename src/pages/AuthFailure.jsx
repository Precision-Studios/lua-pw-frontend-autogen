import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

const AuthFailure = () => {
    return (
        <Layout>
            <div className="max-w-md mx-auto mt-10">
                <Card className="text-center pt-8 pb-8">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-black uppercase mb-4">Authentication Failed</h2>
                    <p className="mb-8 text-gray-600">
                        We couldn't sign you in with that provider. Please try again.
                    </p>
                    <Link to="/login">
                        <Button className="w-full">Back to Login</Button>
                    </Link>
                </Card>
            </div>
        </Layout>
    );
};

export default AuthFailure;

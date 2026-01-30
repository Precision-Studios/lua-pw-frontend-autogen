'use client';

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="fixed top-4 right-4 z-[100] animate-in">
            <div
                className="flex items-center gap-3 px-4 py-3 rounded-lg glass min-w-[300px] max-w-md"
                style={{
                    borderLeft: `3px solid var(${type === 'success' ? '--success' : '--error'})`,
                }}
            >
                {type === 'success' ? (
                    <CheckCircle size={20} className="text-success flex-shrink-0" />
                ) : (
                    <XCircle size={20} className="text-error flex-shrink-0" />
                )}
                <p className="text-sm text-white flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="text-white/50 hover:text-white transition-colors flex-shrink-0"
                    aria-label="Close notification"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Toast;

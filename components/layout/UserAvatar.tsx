'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, KeyRound } from 'lucide-react';

interface UserAvatarProps {
    onUpdatePassword: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ onUpdatePassword }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
            buttonRef.current?.focus();
        } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen(!isOpen);
        }
    };

    const handleMenuItemClick = () => {
        onUpdatePassword();
        setIsOpen(false);
    };

    const handleMenuItemKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleMenuItemClick();
        } else if (event.key === 'Escape') {
            setIsOpen(false);
            buttonRef.current?.focus();
        }
    };

    return (
        <div className="relative">
            {/* Avatar Button */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
                aria-label="User menu"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <User size={18} className="text-white" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 rounded-lg glass animate-in"
                    style={{
                        zIndex: 50,
                    }}
                >
                    <div className="py-1">
                        <button
                            onClick={handleMenuItemClick}
                            onKeyDown={handleMenuItemKeyDown}
                            className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                            tabIndex={0}
                        >
                            <KeyRound size={16} />
                            <span>Update Password</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAvatar;

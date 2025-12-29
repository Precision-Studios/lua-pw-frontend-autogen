import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    className,
    isLoading,
    disabled,
    type = 'button',
    ...props
}) => {
    return (
        <button
            type={type}
            disabled={isLoading || disabled}
            className={clsx(
                'btn-base',
                variant === 'primary' && 'btn-primary',
                (isLoading || disabled) && 'opacity-50 cursor-not-allowed',
                className
            )}
            {...props}
        >
            {isLoading && <Loader2 className="animate-spin mr-2" size={18} />}
            {children}
        </button>
    );
};

export default Button;


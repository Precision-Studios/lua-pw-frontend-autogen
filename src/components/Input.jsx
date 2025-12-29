import React, { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({ className, error, ...props }, ref) => {
    return (
        <div className="w-full">
            <input
                ref={ref}
                className={clsx(
                    'brutalist-input',
                    error && 'border-red-500', // Simple red border for errors even in b/w theme can be effective, or keep it black? Let's stick to standard warning. 
                    // Actually requirements said Muted Blue accent. Maybe Error should be just bold text below? 
                    // Let's stick to base class. If error, maybe add a specific style.
                    className
                )}
                {...props}
            />
            {error && (
                <span className="text-sm font-bold mt-1 block uppercase text-red-600">
                    ! {error}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;

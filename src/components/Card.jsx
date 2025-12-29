import React from 'react';
import clsx from 'clsx';

const Card = ({ children, className, title, ...props }) => {
    return (
        <div className={clsx('brutalist-card', className)} {...props}>
            {title && (
                <h3 className="text-xl font-black mb-4 uppercase border-b-2 border-black pb-2">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};

export default Card;

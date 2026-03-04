import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    hoverable?: boolean;
    active?: boolean;
    padding?: string;
    borderRadius?: string;
    href?: string;
    shadow?: boolean;
    blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

/**
 * A reusable premium glassmorphic card component.
 * Features a deep blur, subtle borders, and an optional hover interaction 
 * consistent with the dashboard's design system.
 * 
 * @param active - If true, the card will permanently display its 'hover' styling (static state).
 * @param hoverable - If true, the card will react to mouse hover with scaling and glow effects.
 * @param borderRadius - Tailwind class for border radius (default: "rounded-[2rem]").
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ children, className, hoverable = false, active = false, padding = "p-8", borderRadius = "rounded-[2rem]", href, shadow = true, blur = 'xl', ...props }, ref) => {
        const blurClasses = {
            'none': '',
            'sm': '',
            'md': '',
            'lg': '',
            'xl': '',
            '2xl': '',
        };

        const cardClass = cn(
            // Base styling: Glassmorphic background
            "bg-[var(--dash-card-bg)] border border-[var(--dash-sidebar-border)] transition-all duration-300 ease-in-out relative overflow-hidden",
            blurClasses[blur],
            shadow && "shadow-none",
            padding,
            borderRadius,

            // Interaction/State styles
            hoverable && "group hover:bg-[var(--dash-sidebar-item-hover-bg)] hover:border-[var(--dash-border-hover)] cursor-pointer",

            // Pinned 'Active' state (Static hover look)
            active && "bg-[var(--dash-card-bg)] border-[var(--dash-border-hover)]",

            className
        );

        const content = (
            <div
                ref={ref}
                className={cardClass}
                {...props}
            >
                <div className="relative z-10 w-full h-full">
                    {children}
                </div>
            </div>
        );

        if (href) {
            return (
                <Link href={href} className="block no-underline">
                    {content}
                </Link>
            );
        }

        return content;
    }
);

Card.displayName = 'Card';

export default Card;

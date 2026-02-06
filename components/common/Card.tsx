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
    ({ children, className, hoverable = false, active = false, padding = "p-8", borderRadius = "rounded-[2rem]", href, ...props }, ref) => {
        const cardClass = cn(
            // Base styling: Glassmorphic background with heavy shadow
            "bg-[var(--dash-sidebar-bg)] backdrop-blur-xl border border-[var(--dash-sidebar-border)] shadow-2xl shadow-black/40 transition-all duration-500 ease-in-out relative overflow-hidden",
            padding,
            borderRadius,

            // Interaction/State styles
            hoverable && "group hover:bg-black/40 hover:border-[var(--dash-border-hover)] hover:scale-[1.02] hover:shadow-black/60 cursor-pointer",

            // Pinned 'Active' state (Static hover look)
            active && "bg-black/40 border-[var(--dash-border-hover)] scale-[1.02] shadow-black/60",

            className
        );

        const content = (
            <div
                ref={ref}
                className={cardClass}
                {...props}
            >
                {/* Subtle inner glow */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-500 pointer-events-none",
                    (hoverable || active) && "group-hover:opacity-100",
                    active && "opacity-100"
                )} />

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

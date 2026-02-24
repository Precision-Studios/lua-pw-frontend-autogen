import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const parsedDebugDelay = Number(process.env.NEXT_PUBLIC_DEBUG_LOADING_DELAY_MS ?? '2500');
export const DEBUG_LOADING_DELAY_MS = Number.isFinite(parsedDebugDelay) ? Math.max(0, parsedDebugDelay) : 1200;

export const debugDelay = async (ms: number = DEBUG_LOADING_DELAY_MS) => {
    if (ms <= 0) {
        return;
    }

    await new Promise((resolve) => setTimeout(resolve, ms));
};

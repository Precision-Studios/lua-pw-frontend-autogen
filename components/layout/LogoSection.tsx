"use client";

import { useEffect, useState } from 'react';
import './LogoSection.css';

const INITIAL_URL = 'http://site.com/path';

const ALNUM_CHARSET = 'abcdefghijklmnopqrstuvwxyz0123456789';

const randomInt = (max: number) => {
    if (max <= 0) {
        return 0;
    }

    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
        const buffer = new Uint32Array(1);
        crypto.getRandomValues(buffer);
        return buffer[0] % max;
    }

    return Math.floor(Math.random() * max);
};

const randomAlnumChar = () => ALNUM_CHARSET[randomInt(ALNUM_CHARSET.length)];

const createToken = (minLength: number, maxLength: number) => {
    const length = minLength + randomInt(maxLength - minLength + 1);
    let value = '';

    for (let index = 0; index < length; index += 1) {
        value += randomAlnumChar();
    }

    return value;
};

const createShortCode = () => {
    return createToken(3, 5);
};

const createSourceUrl = () => `http://${createToken(3, 8)}.com/${createToken(3, 8)}`;

const buildCollapsedFrame = (source: string, target: string, step: number) => {
    const maxLength = Math.max(source.length, target.length);
    let value = '';

    for (let index = 0; index < maxLength; index += 1) {
        const sourceChar = source[index] ?? '';
        const targetChar = target[index] ?? '';

        value += index < step ? targetChar : sourceChar;
    }

    return value;
};

export default function LogoSection() {
    const [animatedUrl, setAnimatedUrl] = useState(INITIAL_URL);
    const [isPulseActive, setIsPulseActive] = useState(false);

    useEffect(() => {
        let isCancelled = false;
        let cycleInterval: number | undefined;
        let pulseTimeout: number | undefined;
        let repeatTimeout: number | undefined;

        const clearTimers = () => {
            if (cycleInterval) {
                window.clearInterval(cycleInterval);
            }
            if (pulseTimeout) {
                window.clearTimeout(pulseTimeout);
            }
            if (repeatTimeout) {
                window.clearTimeout(repeatTimeout);
            }
        };

        const runCycle = () => {
            if (isCancelled) {
                return;
            }

            const finalUrl = `Lua.pw/${createShortCode()}`;
            const sourceUrl = createSourceUrl();
            setIsPulseActive(false);
            setAnimatedUrl(sourceUrl);

            console.log('[LogoSection] cycle:start', {
                initialUrl: sourceUrl,
                finalUrl,
            });

            let frame = 0;
            const totalFrames = Math.max(sourceUrl.length, finalUrl.length) + 1;

            cycleInterval = window.setInterval(() => {
                frame += 1;
                const nextValue = buildCollapsedFrame(sourceUrl, finalUrl, frame);

                setAnimatedUrl(nextValue);

                if (frame >= totalFrames) {
                    if (cycleInterval) {
                        window.clearInterval(cycleInterval);
                    }
                    setAnimatedUrl(finalUrl);
                    console.log('[LogoSection] cycle:end', { finalUrl });
                    setIsPulseActive(true);

                    pulseTimeout = window.setTimeout(() => {
                        setIsPulseActive(false);
                        repeatTimeout = window.setTimeout(runCycle, 500);
                    }, 250);
                }
            }, 42);
        };

        runCycle();

        return () => {
            isCancelled = true;
            clearTimers();
        };
    }, []);

    return (
        <div className="logo-hero-container">
            {/* Hero Content */}
            <div className="logo-content">
                <div className={`logo-mark logo-mark-animated ${isPulseActive ? 'logo-mark-pulse' : ''}`} aria-live="polite">
                    {animatedUrl}
                    <span className="url-morph-cursor" aria-hidden="true"></span>
                </div>

                <div className="hero-text-container">
                    <p className="hero-description">
                        The next generation of URL management. Simple, fast, and secure.
                    </p>
                </div>

                <div className="stats-card-main stats-strip" role="presentation">
                    <div className="stats-container-inner">
                        <div className="stat-item">
                            <div className="stat-value">100k+</div>
                            <div className="stat-label">URLs Shortened</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">25k+</div>
                            <div className="stat-label">QR Codes</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">99.9%</div>
                            <div className="stat-label">Observed Uptime</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

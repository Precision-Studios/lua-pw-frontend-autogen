export const BRAND_COLORS = {
    // Brand Palette
    primary: '#2c02ac',
    blue: '#0051e5',
    sky: '#007dff',
    cyan: '#00a2fb',
    teal: '#00c4e0',
    mint: '#00e3bb',

    // Semantic / Feedback
    success: '#10b981',
    error: '#ef4444',

    // UI Surfaces & Accents
    glassBg: 'rgba(255, 255, 255, 0.03)',
    glassBorder: 'rgba(255, 255, 255, 0.05)',
    inputBg: 'rgba(0, 0, 0, 0.2)',
    glow: 'rgba(255, 255, 255, 0.5)',
    btnHoverLight: '#f4f4f5',

    // Subtle Overlays & Highlights
    whiteSubtle: 'rgba(255, 255, 255, 0.1)',
    whiteDim: 'rgba(255, 255, 255, 0.2)',
    whiteTrace: 'rgba(255, 255, 255, 0.3)',
    whiteMuted: 'rgba(255, 255, 255, 0.6)',
    whiteFaint: 'rgba(255, 255, 255, 0.05)',
    blackSubtle: 'rgba(0, 0, 0, 0.2)',
    blackMuted: 'rgba(0, 0, 0, 0.4)',
} as const;

export type BrandColor = keyof typeof BRAND_COLORS;

// Design System Tokens based on UX Design Specification

export const colors = {
    // Primary
    primary: "#FFB800",
    primaryDark: "#E6A600",
    primaryLight: "#FFCC4D",
    secondary: "#10B981",
    secondaryDark: "#059669",
    accent: "#F59E0B",

    // Neutral
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",

    // Gray Scale (Slate)
    gray: {
        50: "#F8FAFC",
        100: "#F1F5F9",
        200: "#E2E8F0",
        300: "#CBD5E1",
        400: "#94A3B8",
        500: "#64748B",
        600: "#475569",
        700: "#334155",
        800: "#1E293B",
        900: "#0F172A",
    },

    // Green Scale
    green: {
        50: "#ECFDF5",
        100: "#D1FAE5",
        500: "#10B981",
        600: "#059669",
    },

    // Amber/Yellow Scale
    amber: {
        50: "#FFFBEB",
        100: "#FEF3C7",
        500: "#F59E0B",
    },

    // Semantic
    success: "#22C55E",
    warning: "#EAB308",
    error: "#EF4444",
    info: "#3B82F6",

    // Light Mode
    light: {
        background: "#FFFFFF",
        surface: "#F8FAFC",
        textPrimary: "#1E293B",
        textSecondary: "#64748B",
        border: "#E2E8F0",
    },

    // Dark Mode
    dark: {
        background: "#0F172A", // Slate 900
        surface: "#1E293B",    // Slate 800
        textPrimary: "#F8FAFC", // Slate 50
        textSecondary: "#94A3B8", // Slate 400
        border: "#334155",      // Slate 700
    },

    // New Tokens from Design Audit
    primaryContainer: "rgba(255, 184, 0, 0.1)", // For badges/backgrounds
    primaryTransparent: "rgba(255, 184, 0, 0.2)",

    glass: {
        light: "rgba(255, 255, 255, 0.1)",
        medium: "rgba(255, 255, 255, 0.2)",
        dark: "rgba(0, 0, 0, 0.05)",
        stroke: "rgba(255, 255, 255, 0.3)",
    },

    gradients: {
        success: ['#10B981', '#059669'], // Emerald 500 -> 600
        primary: ['#FFB800', '#E6A600'],
    },

    // Semantics from Benchmark - SIMPLIFIED (One Point Color)
    rings: {
        move: '#FFB800',     // Primary
        exercise: '#E6A600', // Primary Dark
        stand: '#FFCC4D',    // Primary Light
    },
    performance: {
        excellent: '#FFB800',
        good: '#E2E8F0', // Neutral
        average: '#94A3B8', // Neutral
        slow: '#64748B', // Neutral
    },
    badges: {
        // Keep metallic feel but desaturated
        gold: '#FFD700',
        silver: '#E2E8F0',
        bronze: '#CD7F32',
    },
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48, // Added for generous spacing
    "2xl": 48,
    "3xl": 64,
    "4xl": 80,
    "5xl": 96,
};

export const layout = {
    tabBarBottom: 100,
    gutter: 16,
};

export const sizes = {
    icon: {
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32,
    },
    button: {
        height: 56,
        radius: 16,
    },
    card: {
        radius: 24,
    }
};

export const borderRadius = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

export const typography = {
    // Display - Hero numbers
    display: {
        fontFamily: "Inter_800ExtraBold",
        fontSize: 48,
        lineHeight: 48 * 1.1,
    },
    // Counter - For workout counts
    counter: {
        fontFamily: "Inter_800ExtraBold",
        fontSize: 120,
        lineHeight: 120,
        fontVariant: ["tabular-nums"] as const,
    },
    counterLarge: {
        fontFamily: "Inter_800ExtraBold",
        fontSize: 150,
        lineHeight: 150,
        fontVariant: ["tabular-nums"] as const,
    },
    timerLarge: {
        fontFamily: "Inter_800ExtraBold",
        fontSize: 80,
        lineHeight: 100,
        fontVariant: ["tabular-nums"] as const,
    },
    // Headings
    h1: {
        fontFamily: "Inter_700Bold",
        fontSize: 32,
        lineHeight: 32 * 1.2,
    },
    h2: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 24,
        lineHeight: 24 * 1.3,
    },
    h3: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 20,
        lineHeight: 20 * 1.4,
    },
    h4: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 18,
        lineHeight: 18 * 1.4,
    },
    // Body
    body: {
        fontFamily: "Inter_400Regular",
        fontSize: 16,
        lineHeight: 16 * 1.5,
    },
    bodySmall: {
        fontFamily: "Inter_400Regular",
        fontSize: 14,
        lineHeight: 14 * 1.5,
    },
    // Caption & Labels
    caption: {
        fontFamily: "Inter_500Medium",
        fontSize: 12,
        lineHeight: 12 * 1.4,
    },
    captionSmall: {
        fontFamily: "Inter_500Medium",
        fontSize: 10,
        lineHeight: 10 * 1.4,
    },
    label: {
        fontFamily: "Inter_600SemiBold",
        fontSize: 11,
        lineHeight: 11 * 1.3,
        letterSpacing: 0.5,
    },
};


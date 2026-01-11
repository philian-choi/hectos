// Design System Tokens based on UX Design Specification

export const colors = {
    // Primary
    primary: "#3B82F6",
    primaryDark: "#1E40AF",
    secondary: "#10B981",
    accent: "#F59E0B",

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
        background: "#0F172A",
        surface: "#1E293B",
        textPrimary: "#F8FAFC",
        textSecondary: "#94A3B8",
        border: "#334155",
    },
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
};

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
};

export const typography = {
    display: {
        fontFamily: "Inter_800ExtraBold",
        fontSize: 48,
        lineHeight: 48 * 1.1,
    },
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
    caption: {
        fontFamily: "Inter_500Medium",
        fontSize: 12,
        lineHeight: 12 * 1.4,
    },
    counter: {
        fontFamily: "Inter_800ExtraBold",
        fontSize: 120,
        lineHeight: 120,
        fontVariant: ["tabular-nums"] as const,
    },
};

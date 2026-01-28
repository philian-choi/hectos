# Hectos Design System Audit

**Date:** 2026-01-18
**Method:** Bmad Design Audit
**Status:** 🔴 Issues Found

---

## 🚨 Executive Summary
A comprehensive audit of the codebase reveals several hardcoded design elements that deviate from the `constants/theme.ts` design system. These inconsistencies can lead to visual fragmentation and make future style updates difficult.

## 🔍 Findings by Category

### 1. Hardcoded Colors (Colors)
Several files use raw Hex codes or RGBA values instead of semantic tokens.
*   **Primary Opacity**: `rgba(255, 184, 0, 0.1)`, `rgba(255, 184, 0, 0.2)` are used frequently for backgrounds/badges.
    *   *Recommendation*: Add `colors.primaryContainer` or `colors.primaryTransparent`.
*   **Surface/Card Backgrounds**: `rgba(255,255,255,0.05)`, `rgba(0,0,0,0.05)`, `rgba(255, 255, 255, 0.2)`.
    *   *Recommendation*: Define `colors.surfaceHighlight` or `colors.glass`.
*   **Text Colors**: `#FFF`, `#000` hardcoded in many places.
    *   *Recommendation*: Use `colors.white`, `colors.black` or `colors.textInverse`.
*   **Gradients**: Linear gradient colors (`#10B981`, `#059669`) are hardcoded.
    *   *Recommendation*: Add `colors.gradients.success` arrays.

### 2. Hardcoded Typography (Fonts)
Font sizes and weights are manually defined in styles.
*   **Sizes**: `fontSize: 32`, `48`, `12`, `14`, `20` are hardcoded.
    *   *Recommendation*: Use `typography.h1`, `typography.body`, `typography.caption` etc.
*   **Weights**: `fontWeight: '700'`, `'800'` are hardcoded.
    *   *Recommendation*: Included in `typography` objects.

### 3. Hardcoded Spacing & Layout
Pixel values are used directly for margins, paddings, and dimensions.
*   **Tab Bar Safe Area**: `paddingBottom: 100` is repeated in all main screens.
    *   *Recommendation*: Define `spacing.tabBarBottom` or similar constant.
*   **Gap/Margin**: `gap: 6`, `gap: 8`, `marginBottom: 4`, `width: 2`.
    *   *Recommendation*: Use `spacing.xs` (4), `spacing.sm` (8).
*   **Component Dimensions**: Fixed matching width/height for circles (32, 40, 48, 56, 100, 140).
    *   *Recommendation*: Define standard icon/badge sizes in a new `layout` or `componentSizes` constant if they are reused.

---

## 📂 Affected Files
*   `app/(tabs)/index.tsx` (Heavy hardcoding)
*   `app/(tabs)/progress.tsx` (Heavy hardcoding)
*   `app/(tabs)/settings.tsx`
*   `components/ui/BadgeGrid.tsx`
*   `components/ui/StreakBadge.tsx`
*   `components/workout/CompletionView.tsx`

## ✅ Proposed Action Plan (Bmad Method)
1.  **Enhance Theme**: Update `constants/theme.ts` with identified missing tokens (opacity variants, gradients, component sizes).
2.  **Refactor**:SYSTEMATICALLY replace hardcoded values in the affected files with the new theme tokens.
3.  **Verify**: Ensure no visual regression occurs.

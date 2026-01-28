# Project Context: Hectos

## 1. Project Overview
**Name**: Hectos
**Vision**: A premium, "touch-free" push-up counter that frees the user's mind from counting via AI/Sensor technology, wrapped in a beautiful glassmorphism interface.
**Core Value**: "Set Your Mind Free. We Count for You."
**Current Phase**: 70_experiment_analysis -> 80_creative_optimization (Scale-up & Product Polish)

## 2. Strategic Direction (Based on Research)
The project is driven by the results of the "LMF (Language Market Fit)" experiment (Jan 2026).
- **Winning Hypothesis**: **H01 (Automatic Counting)**. Users have a "burning problem" with counting manually. This is the primary acquisition hook.
- **Secondary Value**: **H03 (6-Week Program)**. High click-through but lower conversion. This is a *Retention* feature, not an acquisition hook.
- **Ineffective Value**: **H06 (Privacy)**. Trust signal only, not a driver.

**Implication**:
- The "Auto-Counting" feature must be front-and-center.
- Onboarding should immediately demonstrate the counting capability ("Try 10 counts") before asking for long-term commitment.

## 3. Technology Stack
- **Framework**: React Native (Expo SDK 52)
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: Expo Router
- **Styling**: Standard React Native Styles + Linear Gradient (Glassmorphism)
- **Internationalization**: i18next (Korean/English)
- **Sensors**: `expo-sensors`, `expo-proximity` (Note: Brief mentions Face Recognition, but current dependencies suggest Proximity/Motion).
- **IAP**: `react-native-iap`

## 4. Design Guidelines
- **Theme**: Premium Dark Mode.
- **Key Color**: Hectos Orange (`#FFB800`) - Used for active states, calls to action.
- **Style**: **Glassmorphism**. Use blur, translucency, and subtle gradients.
- **Typography**: Inter (Google Fonts).

## 5. Implementation Rules
1. **Aesthetics First**: The app must look premium. No "MVP" designs. Animations and micro-interactions are required.
2. **Global & Local**: Support English and Korean.
3. **Optimized Onboarding**:
    - **Old**: Welcome -> 6 Week Intro -> ...
    - **New (Required)**: Welcome -> **"Test 10 Counts"** (Instant gratification) -> Program Setup.

## 6. Key Files
- `research/outputs/70_experiment_analysis/2026-01-18__experiment-analysis-report__v1.md`: The source of truth for the current strategy.
- `landing/app/page.tsx`: The marketing landing page (needs to reflect H01 strategy).
- `app/_layout.tsx`, `app/index.tsx`: Main app entry points.

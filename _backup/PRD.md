# Product Requirements Document (PRD): Hectos

## 1. Product Overview
**Product Name**: Hectos
**Vision**: The "Touchless" Push-up Coach. A premium, glassmorphism-designed app that uses on-device vision to count push-ups automatically, freeing the user's mind to focus on the workout.
**Core Value Proposition**: "Set Your Mind Free. We Count for You."
**Target Audience**: "Kevin" - The Efficient Achiever. Wants structure, automated tracking, and premium aesthetics.

## 2. Strategic Context (Research Findings)
Based on Jan 2026 Experiment Analysis:
- **Winning Feature**: Auto-Counting (H01). This is the primary driver for downloads (CPI < ₩2,000, CVR 34%).
- **Retention Feature**: 6-Week Program (H03). Users are interested but need conversion proof first.
- **Support Feature**: Privacy (H06). A trust signal, not a header.

## 3. User Stories & Functional Requirements

### Epic 1: Auto-Counting Experience (The "Hook")
*Priority: Critical (P0)*
- **Story 1.1**: As a user, I want the app to detect my push-ups using the front camera so I don't have to count manually.
- **Story 1.2**: As a user, I want clear visual/haptic feedback for each count so I know the app is working without looking at the screen.
- **Story 1.3**: As a user, I want a "Try It Now" mode during onboarding to experience the auto-counting magic immediately (before signing up).

### Epic 2: The 6-Week Program (Retention)
*Priority: High (P1)*
- **Story 2.1**: As a user, I want a structured 6-week plan that adjusts to my level (Placement Test) so I can progress safely.
- **Story 2.2**: As a user, I want a rest timer between sets to optimize recovery.

### Epic 3: Premium Aesthetics (Brand)
*Priority: High (P1)*
- **Story 3.1**: As a user, I want a beautiful dark-mode interface with glassmorphism effects so I feel motivated to open the app.
- **Story 3.2**: As a user, I want smooth animations (reanimated) for interactions.

## 4. Technical Constraints & Architecture
- **Framework**: React Native (Expo).
- **Vision**: On-device detection (Privacy-first).
- **State**: Zustand for global store.
- **Storage**: AsyncStorage for progress (initially).
- **Monetization**: Freemium (Week 1 Free, IAP for Full Program).

## 5. Success Metrics
- **Acquisition**: CPI < ₩2,000.
- **Activation**: > 60% of installers complete the "10 Count Test".
- **Conversion**: > 5% conversion to IAP after Week 1.

## 6. Design System
- **Colors**: Hectos Orange (`#FFB800`), Slate 900 (Background), Slate 50 (Text).
- **Typography**: Inter.
- **Components**: GlassCards, Neumorphic Buttons (Subtle).

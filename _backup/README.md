# 💪 Hectos - AI Pushup Coach

> **Your personal AI-powered pushup trainer. Count reps automatically using Face Detection.**

Hectos involves a 6-week systematic pushup program designed to take you from 0 to 100 consecutive pushups. It utilizes on-device Vision AI to detect your face position, automatically counting reps so you can focus entirely on your form.

---

## ✨ Key Features

### 🤖 Smart AI Counting (Vision Support)
- **Touchless Experience**: Place your phone on the floor/mat. The front camera detects your face.
- **Privacy First**: All detection happens on-device using a native mobile vision module. No video is recorded or uploaded.
- **Haptic Feedback**: Get vibration feedback on every successful rep.

### 📅 6-Week Systematic Program
- **Personalized Difficulty**: Initial placement test assigns you to the right difficulty column (Beginner, Intermediate, Advanced).
- **Progressive Overload**: Automatically increases intensity over 6 weeks.
- **Rest Timer**: Built-in dynamic rest timer between sets.

### 💎 Premium User Experience
- **Glassmorphism UI**: Modern, clean interface with frosted glass effects (`expo-blur`).
- **Smooth Animations**: High-performance interactions using `react-native-reanimated`.
- **Dynamic Themes**: Fully supported Dark Mode and Light Mode.
- **Immersive Overlay**: Context-aware pause screens and celebration effects.

### 📈 Growth & Retention Mechanics
- **Freemium Model**: Try Week 1 (Day 1-3) for free. Unlock the full 6-week journey via IAP.
- **Smart Reminders**: Local notifications scheduled to keep you consistent.
- **Gamification**: Badges, confetti celebrations, and shake feedback animations.

---

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (Expo SDK 52)
- **Language**: TypeScript
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Styling**: StyleSheet + Custom Design Tokens (`@/constants/theme`)
- **Native Modules**:
  - Custom Face Detector Module (Objective-C/Swift) for iOS
  - `expo-haptics`, `expo-blur`, `expo-notifications`
- **I18n**: `react-i18next` (English & Korean support)
- **Monetization**: `react-native-iap`

---

## 📂 Project Structure

```
hectos/
├── app/                 # Expo Router Screens
│   ├── (auth)/          # Onboarding & Authentication flows
│   ├── (tabs)/          # Main App Tabs (Home, Progress, Settings)
│   └── workout/         # Active Workout Session Screen
├── components/          # Reusable UI Components
│   ├── ui/              # Atoms (Buttons, Cards, Badges)
│   └── workout/         # Workout-specific Logic (RestTimer, PauseOverlay)
├── hooks/               # Custom React Hooks
│   ├── useFaceDetector  # Bridge to Native Vision Module
│   ├── useNotifications # Push Notification Logic
│   └── useProgramData   # 6-Week Program Logic
├── stores/              # Zustand State Stores
├── constants/           # Design Tokens (Colors, Spacing, Typography)
├── locales/             # I18n JSON files
└── ios/                 # Native iOS Code (FaceDetectorModule)
```

---

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```
   *Note: This project relies on native modules (`expo-blur`, custom iOS module). You must run it as a development build or prebuild.*

2. **Run on iOS Simulator/Device**
   ```bash
   npx expo run:ios
   ```

3. **Build for Production**
   ```bash
   eas build --profile production --platform ios
   ```

---

## 🔒 Privacy & Permissions

- **Camera**: Required solely for face detection during workouts.
- **Notifications**: Used for daily practice reminders.

---

© 2026 Hectos. All rights reserved.

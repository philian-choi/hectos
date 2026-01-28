# App Store Review Notes for Hectos

## App Overview
Hectos is a 6-week systematic pushup training program that uses the device's **Front Camera (TrueDepth system)** to automatically count pushups. Users place their phone on the floor and the app utilizes on-device face detection to count repetitions when the user lowers their body.

## How to Test the App

### 1. Core Functionality (Pushup Counting)
1. Launch the app and complete the onboarding flow.
2. The app uses a **Freemium model**: You can test Week 1 (Day 1-3) workouts for free without purchasing.
3. Start "Day 1" workout.
4. Grant the **Camera Permission** when prompted.
5. Place the iPhone on the floor or a table.
6. **Lower your face towards the screen/camera**. You will see a "Face Active" indicator.
7. Perform a pushup motion. The count will increment as your face moves down and up.
8. **Backup**: You can also **tap the screen** manually to count reps if testing is difficult.

### 2. In-App Purchase Testing (sandbox)
- The app offers a **Non-Consumable** product (`com.hectos.app.program`) to unlock the full 6-week program.
- Go to Home screen and try to select Day 4, or click a locked card.
- The Purchase Screen will appear.
- Initiate a purchase using a Sandbox Apple ID.
- Verify that all content is unlocked (Lock icons disappear).
- **Restore Testing**: Delete and reinstall the app, go to Purchase screen, and tap "Restore Purchases". The content should unlock again.

### 3. Localization
- The app fully supports **English** and **Korean**.
- Language is detected automatically based on device settings.

## Technical Notes & Privacy
- **Privacy First**: All face detection processing happens **locally on the device**. No video or image data is recorded, stored, or transmitted to any server.
- **Permissions**: The app requests `NSCameraUsageDescription` solely for this face detection feature.
- **Data Storage**: User progress is stored locally (and potentially in CloudKit if enabled in future updates).

## Contact Information
(Please provide your contact info here)
support@hectos.app

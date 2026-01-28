# App Store Release Checklist: Hectos v1.2.0

## 📋 Pre-Submission Checklist

### 1. Version & Build Configuration
- [x] `app.json` version: `1.2.0` → **Ready for Submission**
- [x] `app.json` buildNumber: `17` → Auto-increment on build
- [x] Bundle ID: `com.hectos.app` ✅
- [x] iOS runtimeVersion matches app version ✅

### 2. App Store Metadata (To prepare in App Store Connect)

#### 2.1 App Name & Subtitle
- **App Name**: Hectos - AI 푸쉬업 코치 / Hectos - AI Pushup Coach
- **Subtitle (30 chars)**: 
  - KO: `숫자는 앱이, 집중은 당신이`
  - EN: `We count. You push.`

#### 2.2 Description (H01 Focused)
```
[EN]
Stop counting in your head. Start pushing.

Hectos is a touchless pushup counter that uses your phone's camera to track reps automatically. Just drop your phone on the floor and focus on your muscles — we handle the rest.

✓ TOUCHLESS COUNTING
No more losing track. AI face detection counts every rep so you can focus on form.

✓ 6-WEEK PROGRAM
From wherever you are today to 100 pushups. Personalized difficulty that grows with you.

✓ PRIVACY FIRST
All processing happens on your device. No video is ever recorded or uploaded.

✓ ONE-TIME PURCHASE
No subscriptions. Pay once, own forever.

Place your phone. Do the work. Get results.
```

```
[KO]
숫자 세는 건 저희가 할게요. 당신은 근육에만 집중하세요.

Hectos는 카메라로 푸쉬업을 자동으로 세는 터치리스 운동 앱입니다. 폰을 바닥에 놓고 운동에만 몰입하세요.

✓ 터치 없이 자동 카운팅
AI 얼굴 인식으로 정확하게 셉니다. 숫자는 저희가 셀게요.

✓ 6주 완성 프로그램
지금 몇 개든 상관없어요. 6주면 100개까지 갈 수 있습니다.

✓ 프라이버시 제일주의
모든 처리는 기기에서만. 영상은 절대 녹화되거나 전송되지 않습니다.

✓ 한 번 결제, 평생 이용
구독 없이 한 번만 결제하세요.

폰을 놓고, 밀어 올리고, 결과를 얻으세요.
```

#### 2.3 Keywords (100 chars max)
- **EN**: `pushup,counter,workout,home gym,fitness,AI,touchless,exercise,calisthenics,6 week`
- **KO**: `푸쉬업,홈트,운동,피트니스,AI,자동카운팅,맨몸운동,6주챌린지,팔굽혀펴기,홈트레이닝`

#### 2.4 Screenshots (Required: 6.7" & 6.5" iPhones)
Refer to research campaign plan for messaging:
1. **Shot 1**: Hero - "숫자는 앱이. 집중은 당신이." + Counter UI
2. **Shot 2**: How It Works - 3-step (Phone → Face → Count)
3. **Shot 3**: Progress Chart - 6-week journey visualization
4. **Shot 4**: Privacy Badge - "No Cloud. On-device AI."
5. **Shot 5**: Celebration - Workout Complete screen

### 3. Legal & Compliance
- [x] Privacy Policy URL: `https://hectos.app/privacy` (or GitHub Pages)
- [x] Terms of Service URL: `https://hectos.app/terms`
- [x] `ITSAppUsesNonExemptEncryption`: `false` ✅
- [x] Camera Usage Description present ✅
- [x] Motion Usage Description present ✅

### 4. In-App Purchases
- [ ] Product ID: `com.hectos.app.program` (Non-Consumable)
- [ ] Verify product is approved in App Store Connect
- [ ] Test Sandbox purchase flow
- [ ] Test Restore Purchases flow

### 5. Build & Submit
```bash
# 1. Bump version
# Update app.json: version → "1.1.0"

# 2. Build for production
eas build --profile production --platform ios

# 3. Submit to App Store
eas submit --platform ios
```

---

## 🔧 Action Items Before Submission

| Priority | Task | Status |
|:--------:|------|:------:|
| **P0** | Update `app.json` version to `1.1.0` | ⏳ |
| **P0** | Update Privacy Policy with Camera usage clarification | ✅ |
| **P0** | Prepare App Store screenshots with H01 messaging | ⏳ |
| **P1** | Prepare promotional text (170 chars) | ⏳ |
| **P1** | Prepare "What's New" release notes | ⏳ |

---

## 📝 What's New (Release Notes) - v1.1.0

```
[EN]
• Redesigned onboarding: Experience auto-counting magic instantly
• Updated messaging: "We count. You push."
• Simplified test results: Focus on your journey to 100
• Performance improvements

[KO]
• 온보딩 개선: 자동 카운팅을 바로 체험하세요
• 새로운 메시지: "숫자는 앱이. 집중은 당신이."
• 테스트 결과 화면 간소화
• 성능 개선
```

---

*Created: 2026-01-18*

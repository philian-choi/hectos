---
stepsCompleted: ["step-01-init", "step-02-context", "step-03-decisions", "step-04-structure", "step-05-complete"]
inputDocuments:
  - "prd.md"
  - "product-brief-hectos-2026-01-11.md"
  - "ux-design-specification.md"
status: "complete"
---

# System Architecture - Hectos

**Author:** Minki  
**Date:** 2026-01-11  
**Version:** 1.0  
**Status:** Complete

---

## Executive Summary

Hectos는 React Native + Expo 기반의 크로스 플랫폼 푸쉬업 트레이닝 앱입니다. 
서버리스 아키텍처를 채택하여 백엔드 없이 로컬 데이터 저장과 스토어 IAP만으로 구현됩니다.

### 핵심 아키텍처 결정

| 결정 | 선택 | 이유 |
|------|------|------|
| **Framework** | React Native + Expo | 크로스 플랫폼, 빠른 개발 |
| **Backend** | 없음 (Serverless) | MVP 단순화, 비용 절감 |
| **Storage** | 로컬 (MMKV) | 오프라인 우선, 프라이버시 |
| **IAP** | react-native-iap | 스토어 통합 |

---

## System Context

```
┌─────────────────────────────────────────────────────────────┐
│                        Hectos App                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    React Native                          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │ │
│  │  │   UI     │  │  State   │  │  Data    │              │ │
│  │  │ (Screens)│  │ (Zustand)│  │ (MMKV)   │              │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘              │ │
│  │       │             │             │                      │ │
│  │       └─────────────┴─────────────┘                      │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │App Store│   │Play     │   │PostHog  │
   │   IAP   │   │Store IAP│   │Analytics│
   └─────────┘   └─────────┘   └─────────┘
```

---

## Technology Stack

### Core

| 레이어 | 기술 | 버전 |
|--------|------|------|
| **Framework** | React Native | 0.76+ |
| **Platform** | Expo | SDK 52 |
| **Language** | TypeScript | 5.0+ |
| **Build** | EAS Build | Latest |

### State & Storage

| 용도 | 기술 | 설명 |
|------|------|------|
| **Global State** | Zustand | 경량 상태 관리 |
| **Persistence** | MMKV | 빠른 로컬 저장소 |
| **State Persist** | zustand/persist + MMKV | 자동 저장/복원 |

### Navigation & UI

| 용도 | 기술 | 설명 |
|------|------|------|
| **Navigation** | Expo Router | 파일 기반 라우팅 |
| **Styling** | NativeWind | Tailwind for RN |
| **Animations** | Reanimated 3 | 네이티브 애니메이션 |
| **Haptics** | expo-haptics | 진동 피드백 |

### Localization & IAP

| 용도 | 기술 | 설명 |
|------|------|------|
| **i18n** | i18next + react-i18next | 다국어 |
| **Locale Detection** | expo-localization | 시스템 언어 감지 |
| **IAP** | react-native-iap | 인앱 결제 |

### Analytics (Optional)

| 용도 | 기술 | 설명 |
|------|------|------|
| **Analytics** | PostHog | 이벤트 트래킹 |
| **Crash** | Sentry | 크래시 리포팅 |

---

## Project Structure

```
hectos/
├── app/                          # Expo Router 페이지
│   ├── (tabs)/                   # 탭 네비게이션
│   │   ├── index.tsx             # 홈 (Today)
│   │   ├── progress.tsx          # 진도
│   │   └── settings.tsx          # 설정
│   ├── (auth)/                   # 온보딩/인증 플로우
│   │   ├── welcome.tsx           # 환영 화면
│   │   ├── initial-test.tsx      # 초기 테스트
│   │   └── test-result.tsx       # 결과/구매
│   ├── workout/                  # 운동 플로우
│   │   ├── [session].tsx         # 운동 세션
│   │   └── exhaustion-test.tsx   # Exhaustion Test
│   └── _layout.tsx               # 루트 레이아웃
│
├── components/                   # 재사용 컴포넌트
│   ├── ui/                       # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   └── Counter.tsx           # 대형 카운터
│   ├── workout/                  # 운동 관련
│   │   ├── SetCard.tsx
│   │   ├── RestTimer.tsx
│   │   └── SessionComplete.tsx
│   └── layout/                   # 레이아웃
│       └── SafeScreen.tsx
│
├── stores/                       # Zustand 스토어
│   ├── useUserStore.ts           # 사용자 상태
│   ├── useWorkoutStore.ts        # 운동 진행
│   └── usePurchaseStore.ts       # 구매 상태
│
├── data/                         # 정적 데이터
│   └── program.ts                # 6주 프로그램 데이터
│
├── lib/                          # 유틸리티
│   ├── storage.ts                # MMKV 래퍼
│   ├── iap.ts                    # IAP 헬퍼
│   ├── i18n.ts                   # i18n 설정
│   └── haptics.ts                # 진동 헬퍼
│
├── locales/                      # 번역 파일
│   ├── ko.json
│   └── en.json
│
├── constants/                    # 상수
│   ├── theme.ts                  # 디자인 토큰
│   └── program.ts                # 프로그램 상수
│
└── types/                        # TypeScript 타입
    ├── program.ts
    └── user.ts
```

---

## Data Architecture

### 1. Program Data (정적)

6주 프로그램 데이터는 앱 번들에 포함됩니다.

```typescript
// data/program.ts
export interface ProgramWeek {
  week: number;
  days: ProgramDay[];
  restBetweenSets: number; // 60, 90, 120
}

export interface ProgramDay {
  day: number;
  columns: {
    column1: DayWorkout;
    column2: DayWorkout;
    column3: DayWorkout;
  };
}

export interface DayWorkout {
  sets: number[];      // [10, 12, 7, 7] 
  lastSetMax: boolean; // 마지막 세트 Max 여부
}

export const PROGRAM_DATA: ProgramWeek[] = [
  // Week 1-6 데이터
];
```

### 2. User State (동적)

사용자 상태는 MMKV에 저장됩니다.

```typescript
// stores/useUserStore.ts
interface UserState {
  // 기본 정보
  hasCompletedOnboarding: boolean;
  hasPurchased: boolean;
  language: 'ko' | 'en';
  
  // 프로그램 상태
  currentColumn: 1 | 2 | 3;
  currentWeek: number;  // 1-6
  currentDay: number;   // 1-3
  
  // 기록
  initialTestResult: number;
  exhaustionTests: ExhaustionTest[];
  completedSessions: CompletedSession[];
  totalPushups: number;
  
  // 설정
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}
```

### 3. Workout Session (임시)

운동 세션 중 상태는 메모리에만 유지됩니다.

```typescript
// stores/useWorkoutStore.ts
interface WorkoutState {
  isActive: boolean;
  currentSet: number;       // 1-5
  currentReps: number;      // 현재 카운트
  targetReps: number;       // 목표 카운트
  completedSets: number[];  // 각 세트 완료 개수
  isResting: boolean;
  restTimeRemaining: number;
}
```

---

## Key Flows

### 1. 온보딩 플로우

```
App Launch
    │
    ▼
hasCompletedOnboarding?
    │
    ├── No ──▶ Welcome ──▶ Initial Test ──▶ Result
    │                                          │
    │                                          ▼
    │                                    Column 배정
    │                                          │
    │                                          ▼
    │                                    Purchase Screen
    │                                          │
    │                                          ▼
    │                                    hasPurchased?
    │                                          │
    │                            ├── No ──▶ 제한된 기능
    │                            │
    └── Yes ─────────────────────┴── Yes ──▶ Home (Tabs)
```

### 2. 운동 세션 플로우

```
Home (Today's Workout)
    │
    ▼
"Start Workout" 탭
    │
    ▼
┌───────────────────────────────────┐
│         Workout Session           │
│  ┌─────────────────────────────┐  │
│  │   Set 1/5                   │  │
│  │   [Counter: 0 / 10]         │  │
│  │   (Touch to count)          │  │
│  └─────────────────────────────┘  │
│              │                     │
│              ▼                     │
│     Set Complete?                  │
│       │                            │
│       ├── No ──▶ Continue counting │
│       │                            │
│       ▼                            │
│     Rest Timer (60s)               │
│              │                     │
│              ▼                     │
│     Next Set?                      │
│       │                            │
│       ├── Yes ──▶ Back to counting │
│       │                            │
│       ▼                            │
│     Session Complete!              │
└───────────────────────────────────┘
    │
    ▼
Save to completedSessions
    │
    ▼
Home (Updated Progress)
```

### 3. IAP 플로우

```
Purchase Screen
    │
    ▼
react-native-iap.requestPurchase()
    │
    ├── Success ──▶ Validate Receipt
    │                    │
    │                    ▼
    │              Set hasPurchased = true
    │                    │
    │                    ▼
    │              Unlock Full Program
    │
    └── Failure ──▶ Show Error ──▶ Retry/Cancel
```

---

## Component Architecture

### 1. Counter Component

가장 핵심적인 컴포넌트로, 운동 세션에서 사용됩니다.

```typescript
// components/ui/Counter.tsx
interface CounterProps {
  count: number;
  target: number;
  onTap: () => void;
  disabled?: boolean;
}

const Counter: React.FC<CounterProps> = ({ count, target, onTap }) => {
  const handlePress = () => {
    // 1. 진동 피드백
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // 2. 카운트 증가 애니메이션
    // (Reanimated scale animation)
    
    // 3. 콜백
    onTap();
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.target}>/ {target}</Text>
    </Pressable>
  );
};
```

### 2. RestTimer Component

휴식 시간 카운트다운을 담당합니다.

```typescript
// components/workout/RestTimer.tsx
interface RestTimerProps {
  duration: number; // 60, 90, 120
  onComplete: () => void;
  onSkip: () => void;
}

const RestTimer: React.FC<RestTimerProps> = ({ duration, onComplete, onSkip }) => {
  const [remaining, setRemaining] = useState(duration);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      <ProgressRing progress={(duration - remaining) / duration} />
      <Text>{remaining}s</Text>
      <Button onPress={onSkip}>Skip</Button>
    </View>
  );
};
```

---

## State Management

### Zustand Store 구조

```typescript
// stores/useUserStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/storage';

interface UserState {
  // State
  currentWeek: number;
  currentDay: number;
  currentColumn: 1 | 2 | 3;
  hasPurchased: boolean;
  totalPushups: number;
  
  // Actions
  setColumn: (column: 1 | 2 | 3) => void;
  completeDay: (pushups: number) => void;
  nextDay: () => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentWeek: 1,
      currentDay: 1,
      currentColumn: 1,
      hasPurchased: false,
      totalPushups: 0,
      
      setColumn: (column) => set({ currentColumn: column }),
      
      completeDay: (pushups) => set((state) => ({
        totalPushups: state.totalPushups + pushups,
      })),
      
      nextDay: () => set((state) => {
        if (state.currentDay >= 3) {
          return { currentDay: 1, currentWeek: state.currentWeek + 1 };
        }
        return { currentDay: state.currentDay + 1 };
      }),
      
      reset: () => set({
        currentWeek: 1,
        currentDay: 1,
        currentColumn: 1,
        totalPushups: 0,
      }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
```

---

## Localization

### i18n 설정

```typescript
// lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import ko from '@/locales/ko.json';
import en from '@/locales/en.json';

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
  },
  lng: Localization.locale.startsWith('ko') ? 'ko' : 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
```

### 번역 파일 구조

```json
// locales/ko.json
{
  "common": {
    "start": "시작하기",
    "next": "다음",
    "skip": "건너뛰기",
    "done": "완료"
  },
  "onboarding": {
    "welcome": {
      "title": "100개 푸쉬업",
      "subtitle": "6주면 충분합니다"
    },
    "test": {
      "title": "지금 최대 몇 개 할 수 있나요?",
      "instruction": "화면을 터치해서 카운트하세요"
    }
  },
  "workout": {
    "set": "세트 {{current}}/{{total}}",
    "rest": "{{seconds}}초 휴식",
    "complete": "운동 완료!"
  }
}
```

---

## IAP Integration

### 상품 구성

```typescript
// lib/iap.ts
import * as RNIap from 'react-native-iap';

export const PRODUCT_ID = 'com.hectos.fullprogram';

export const initIAP = async () => {
  await RNIap.initConnection();
  
  if (Platform.OS === 'ios') {
    await RNIap.clearTransactionIOS();
  }
};

export const getProduct = async () => {
  const products = await RNIap.getProducts({ skus: [PRODUCT_ID] });
  return products[0];
};

export const purchaseProduct = async () => {
  try {
    await RNIap.requestPurchase({ sku: PRODUCT_ID });
    return true;
  } catch (error) {
    console.error('Purchase failed:', error);
    return false;
  }
};

export const restorePurchases = async () => {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    return purchases.some(p => p.productId === PRODUCT_ID);
  } catch (error) {
    console.error('Restore failed:', error);
    return false;
  }
};
```

---

## Security Considerations

### 1. 데이터 보안

| 항목 | 접근 방식 |
|------|----------|
| **사용자 데이터** | 로컬 저장만 (서버 전송 없음) |
| **결제 정보** | 앱에서 저장하지 않음 (스토어 처리) |
| **분석 데이터** | 익명화된 이벤트만 수집 |

### 2. IAP 보안

| 항목 | 접근 방식 |
|------|----------|
| **영수증 검증** | 스토어 자체 검증 (서버 없음) |
| **구매 상태** | 로컬 + 스토어 복원으로 검증 |
| **탈옥/루팅** | 감지하지 않음 (MVP) |

---

## Performance Considerations

### 1. 앱 시작 최적화

- Expo Router의 lazy loading 활용
- 초기 번들 크기 최소화
- MMKV로 빠른 상태 복원

### 2. 운동 세션 최적화

- 카운터 애니메이션: Reanimated (UI 스레드)
- 진동 피드백: 네이티브 모듈
- 타이머: useEffect 최적화

### 3. 메모리 관리

- 운동 완료 후 세션 상태 정리
- 이미지 최적화 (expo-image)
- 불필요한 리렌더링 방지

---

## Testing Strategy

### 1. Unit Tests

```typescript
// __tests__/program.test.ts
describe('Program Data', () => {
  it('should have 6 weeks', () => {
    expect(PROGRAM_DATA.length).toBe(6);
  });
  
  it('should have 3 days per week', () => {
    PROGRAM_DATA.forEach(week => {
      expect(week.days.length).toBe(3);
    });
  });
});
```

### 2. Component Tests

```typescript
// __tests__/Counter.test.tsx
describe('Counter', () => {
  it('should increment on tap', () => {
    const onTap = jest.fn();
    const { getByTestId } = render(<Counter count={0} target={10} onTap={onTap} />);
    
    fireEvent.press(getByTestId('counter'));
    expect(onTap).toHaveBeenCalled();
  });
});
```

### 3. E2E Tests (Future)

- Detox 또는 Maestro
- 온보딩 플로우
- 운동 완료 플로우
- IAP 플로우 (샌드박스)

---

## Deployment

### EAS Build Configuration

```json
// eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id",
        "ascAppId": "your-app-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

---

## Architecture Decision Records

### ADR-001: Serverless Architecture

**결정:** 백엔드 서버 없이 완전 로컬 앱으로 구현

**이유:**
- MVP 단순화 및 빠른 출시
- 서버 비용 제거
- 오프라인 우선 UX
- 프라이버시 보장

**대안:** Firebase, Supabase 등 BaaS 사용
- 소셜 기능, 클라우드 동기화 필요 시 v2.0에서 고려

### ADR-002: MMKV over AsyncStorage

**결정:** AsyncStorage 대신 MMKV 사용

**이유:**
- 10배 이상 빠른 성능
- 동기 API 지원
- Zustand persist와 좋은 호환

### ADR-003: Expo Router over React Navigation

**결정:** Expo Router 사용

**이유:**
- 파일 기반 라우팅으로 직관적
- Expo SDK 52+와 최적화
- 딥링크 자동 처리

---

*Architecture 완료: 2026-01-11*

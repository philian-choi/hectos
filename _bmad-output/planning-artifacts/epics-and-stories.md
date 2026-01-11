---
stepsCompleted: ["complete"]
inputDocuments:
  - "prd.md"
  - "architecture.md"
  - "ux-design-specification.md"
status: "complete"
totalEpics: 5
totalStories: 20
---

# Epics & Stories - Hectos

**Author:** Minki  
**Date:** 2026-01-11  
**Version:** 1.0  
**Status:** Ready for Implementation

---

## Epic Overview

| # | Epic | Stories | Priority | Sprint |
|---|------|---------|----------|--------|
| E1 | 프로젝트 셋업 | 4 | 🔴 Critical | Sprint 1 |
| E2 | 온보딩 & 초기 테스트 | 4 | 🔴 Critical | Sprint 1 |
| E3 | 운동 세션 | 5 | 🔴 Critical | Sprint 2 |
| E4 | 프로그램 진행 & 추적 | 4 | 🟡 High | Sprint 2-3 |
| E5 | 결제 & 설정 | 3 | 🔴 Critical | Sprint 3 |

---

# Epic 1: 프로젝트 셋업

**목표:** 개발 환경 구축 및 기본 앱 구조 생성

**예상 기간:** 3일

---

## Story 1.1: Expo 프로젝트 초기화

**Priority:** 🔴 Critical  
**Estimate:** 2 hours

### Description
Expo SDK 52 기반 React Native 프로젝트를 생성하고 기본 의존성을 설치합니다.

### Acceptance Criteria
- [ ] `npx create-expo-app hectos --template expo-template-blank-typescript` 실행
- [ ] Expo Router 설정 완료
- [ ] TypeScript 설정 확인
- [ ] iOS Simulator 및 Android Emulator에서 앱 실행 확인

### Technical Notes
```bash
npx create-expo-app hectos --template expo-template-blank-typescript
cd hectos
npx expo install expo-router expo-linking expo-constants expo-status-bar
```

---

## Story 1.2: 디자인 시스템 구축

**Priority:** 🔴 Critical  
**Estimate:** 4 hours

### Description
UX Design Specification 기반으로 디자인 토큰과 기본 UI 컴포넌트를 구현합니다.

### Acceptance Criteria
- [ ] `constants/theme.ts` 생성 (colors, typography, spacing)
- [ ] NativeWind 또는 StyleSheet 기반 스타일 시스템 구축
- [ ] `Button`, `Card`, `Text` 기본 컴포넌트 생성
- [ ] 다크 모드 지원 설정

### Technical Notes
```typescript
// constants/theme.ts
export const colors = {
  primary: '#3B82F6',
  secondary: '#10B981',
  // ...
};
```

---

## Story 1.3: 상태 관리 설정

**Priority:** 🔴 Critical  
**Estimate:** 3 hours

### Description
Zustand와 MMKV를 설정하고 기본 스토어 구조를 생성합니다.

### Acceptance Criteria
- [ ] `zustand` 및 `react-native-mmkv` 설치
- [ ] MMKV storage adapter 구현 (`lib/storage.ts`)
- [ ] `useUserStore` 기본 구조 생성
- [ ] 앱 재시작 시 상태 복원 확인

### Technical Notes
```bash
npm install zustand react-native-mmkv
```

---

## Story 1.4: 다국어 설정

**Priority:** 🟡 High  
**Estimate:** 2 hours

### Description
i18next를 설정하고 한국어/영어 번역 파일 구조를 생성합니다.

### Acceptance Criteria
- [ ] `i18next` 및 `react-i18next` 설치
- [ ] `expo-localization` 설정
- [ ] `locales/ko.json`, `locales/en.json` 생성
- [ ] 시스템 언어 자동 감지 동작 확인

### Technical Notes
```bash
npx expo install expo-localization
npm install i18next react-i18next
```

---

# Epic 2: 온보딩 & 초기 테스트

**목표:** 신규 사용자 온보딩 플로우 및 초기 푸쉬업 테스트 구현

**예상 기간:** 5일

---

## Story 2.1: Welcome 화면

**Priority:** 🔴 Critical  
**Estimate:** 3 hours

### Description
앱 첫 실행 시 표시되는 환영 화면을 구현합니다.

### Acceptance Criteria
- [ ] `app/(auth)/welcome.tsx` 생성
- [ ] 앱 로고 및 태그라인 표시
- [ ] "100개 푸쉬업, 6주면 충분합니다" 텍스트
- [ ] [시작하기] CTA 버튼
- [ ] 버튼 탭 시 Initial Test Intro로 이동

### UI Reference
- UX Design: Screen 1.1 Welcome Screen

---

## Story 2.2: 초기 테스트 안내 화면

**Priority:** 🔴 Critical  
**Estimate:** 2 hours

### Description
초기 테스트 시작 전 안내 화면을 구현합니다.

### Acceptance Criteria
- [ ] `app/(auth)/initial-test-intro.tsx` 생성
- [ ] 테스트 설명 텍스트 표시
- [ ] "지금 최대 몇 개 할 수 있나요?" 안내
- [ ] [테스트 시작] 버튼
- [ ] 버튼 탭 시 테스트 화면으로 이동

---

## Story 2.3: 초기 테스트 화면 (카운터)

**Priority:** 🔴 Critical  
**Estimate:** 6 hours

### Description
사용자가 최대 푸쉬업 개수를 측정하는 테스트 화면을 구현합니다.

### Acceptance Criteria
- [ ] `app/(auth)/initial-test.tsx` 생성
- [ ] 대형 카운터 컴포넌트 (전체 화면 터치 영역)
- [ ] 터치 시 카운트 증가 + 진동 피드백
- [ ] 현재 카운트 대형 표시 (120px)
- [ ] [완료] 버튼
- [ ] 완료 시 결과 저장 및 Result 화면으로 이동

### Technical Notes
```typescript
// components/ui/Counter.tsx
import * as Haptics from 'expo-haptics';

const handleTap = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  setCount(prev => prev + 1);
};
```

---

## Story 2.4: 테스트 결과 & Column 배정 화면

**Priority:** 🔴 Critical  
**Estimate:** 4 hours

### Description
초기 테스트 결과를 표시하고 적절한 Column을 배정합니다.

### Acceptance Criteria
- [ ] `app/(auth)/test-result.tsx` 생성
- [ ] 테스트 결과 표시 ("5개!")
- [ ] Column 배정 로직 구현:
  - 0-5개: Column 1
  - 6-10개: Column 2
  - 11+개: Column 3
- [ ] 배정 결과 설명 표시
- [ ] [프로그램 시작] 버튼 → 구매 화면으로 이동
- [ ] `useUserStore`에 결과 저장

### Technical Notes
```typescript
const getColumn = (count: number): 1 | 2 | 3 => {
  if (count <= 5) return 1;
  if (count <= 10) return 2;
  return 3;
};
```

---

# Epic 3: 운동 세션

**목표:** 핵심 운동 세션 기능 구현 (카운터, 휴식 타이머, 완료)

**예상 기간:** 6일

---

## Story 3.1: 프로그램 데이터 구조

**Priority:** 🔴 Critical  
**Estimate:** 4 hours

### Description
hundredpushups.com 6주 프로그램 데이터를 구조화하여 구현합니다.

### Acceptance Criteria
- [ ] `data/program.ts` 생성
- [ ] TypeScript 타입 정의 (Week, Day, Column, Sets)
- [ ] Week 1-6 전체 데이터 입력
- [ ] 각 Column별 세트/반복 수 정의
- [ ] 휴식 시간 정의 (60/90/120초)

### Technical Notes
```typescript
export const PROGRAM_DATA: ProgramWeek[] = [
  {
    week: 1,
    restBetweenSets: 60,
    days: [
      {
        day: 1,
        columns: {
          column1: { sets: [2, 3, 2, 2], lastSetMax: true },
          column2: { sets: [6, 6, 4, 4], lastSetMax: true },
          column3: { sets: [10, 12, 7, 7], lastSetMax: true },
        }
      },
      // ...
    ]
  },
  // Week 2-6...
];
```

---

## Story 3.2: 홈 화면 (Today's Workout)

**Priority:** 🔴 Critical  
**Estimate:** 4 hours

### Description
메인 탭의 홈 화면에서 오늘의 운동을 표시합니다.

### Acceptance Criteria
- [ ] `app/(tabs)/index.tsx` 구현
- [ ] 상단 진도 프로그레스 바 표시
- [ ] 현재 Week/Day 카드 표시
- [ ] 오늘의 세트 미리보기 (예: "5세트, 총 36개")
- [ ] 예상 소요 시간 표시
- [ ] [운동 시작] CTA 버튼
- [ ] 버튼 탭 시 운동 세션으로 이동

---

## Story 3.3: 운동 세션 화면

**Priority:** 🔴 Critical  
**Estimate:** 8 hours

### Description
실제 운동을 수행하는 메인 세션 화면을 구현합니다.

### Acceptance Criteria
- [ ] `app/workout/[session].tsx` 생성
- [ ] 상단: 현재 세트 표시 (1/5)
- [ ] 중앙: 대형 카운터 (현재/목표)
- [ ] 전체 화면 터치로 카운팅
- [ ] 터치 시 진동 + 시각적 피드백
- [ ] 목표 달성 시 자동으로 휴식 화면 전환
- [ ] 마지막 세트는 "Max" 모드 (목표 없음)
- [ ] `useWorkoutStore` 상태 관리

### UI Reference
- UX Design: Screen 3.2 Workout Session

---

## Story 3.4: 휴식 타이머 화면

**Priority:** 🔴 Critical  
**Estimate:** 4 hours

### Description
세트 사이 휴식 시간을 카운트다운하는 화면을 구현합니다.

### Acceptance Criteria
- [ ] 휴식 화면 컴포넌트 또는 모달
- [ ] 카운트다운 타이머 (60/90/120초)
- [ ] 프로그레스 링 애니메이션
- [ ] [건너뛰기] 옵션
- [ ] 완료 시 다음 세트 안내
- [ ] 자동으로 다음 세트 시작

### Technical Notes
```typescript
const RestTimer: React.FC<{ duration: number; onComplete: () => void }> = ...
```

---

## Story 3.5: 세션 완료 화면

**Priority:** 🟡 High  
**Estimate:** 4 hours

### Description
운동 세션 완료 후 축하 화면과 통계를 표시합니다.

### Acceptance Criteria
- [ ] 세션 완료 화면/모달
- [ ] 축하 애니메이션 (Confetti 또는 간단한 애니메이션)
- [ ] 세션 통계 표시:
  - 총 푸쉬업 수
  - 완료 세트 수
  - 소요 시간
- [ ] [홈으로] 버튼
- [ ] `completedSessions`에 기록 저장
- [ ] `totalPushups` 업데이트

---

# Epic 4: 프로그램 진행 & 추적

**목표:** 진도 추적, Exhaustion Test, 주차 진행 관리

**예상 기간:** 5일

---

## Story 4.1: 진도 화면

**Priority:** 🟡 High  
**Estimate:** 5 hours

### Description
전체 프로그램 진도를 시각화하는 화면을 구현합니다.

### Acceptance Criteria
- [ ] `app/(tabs)/progress.tsx` 구현
- [ ] 6주 캘린더/그리드 뷰
- [ ] 완료일 표시 (체크마크 또는 색상)
- [ ] 현재 위치 강조
- [ ] 주차별 통계 요약
- [ ] 총 푸쉬업 수 표시
- [ ] Exhaustion Test 결과 표시

---

## Story 4.2: Exhaustion Test 화면

**Priority:** 🔴 Critical  
**Estimate:** 5 hours

### Description
Week 2, 4 종료 시 수행하는 Exhaustion Test를 구현합니다.

### Acceptance Criteria
- [ ] `app/workout/exhaustion-test.tsx` 생성
- [ ] 테스트 안내 화면
- [ ] 대형 카운터 (초기 테스트와 유사)
- [ ] 완료 시 결과 표시
- [ ] Column 재배정 로직:
  - 결과에 따라 Column 상향/유지/하향
- [ ] 다음 주차 프로그램 업데이트
- [ ] 결과 저장 (`exhaustionTests` 배열)

### Technical Notes
```typescript
const reassignColumn = (exhaustionResult: number, currentColumn: 1|2|3): 1|2|3 => {
  // 재배정 로직
};
```

---

## Story 4.3: 적응형 플래닝

**Priority:** 🟡 High  
**Estimate:** 4 hours

### Description
세트 미완료 또는 실패 시 적응형 옵션을 제공합니다.

### Acceptance Criteria
- [ ] 세트 목표 미달성 시 감지
- [ ] "다시 시도" 또는 "다음으로" 옵션
- [ ] "오늘 컨디션이 안 좋아요" 옵션 → 쉬운 대안 제안
- [ ] 주차 반복 기능 ("이번 주 다시 하기")
- [ ] 사용자 선택에 따른 프로그램 조정

---

## Story 4.4: 프로그램 완료 & 100개 테스트

**Priority:** 🟡 High  
**Estimate:** 4 hours

### Description
6주 프로그램 완료 후 최종 100개 테스트와 축하 화면을 구현합니다.

### Acceptance Criteria
- [ ] Week 6 Day 3 완료 감지
- [ ] 최종 테스트 안내 ("100개 도전!")
- [ ] 테스트 수행 화면
- [ ] 100개 달성 시 특별 축하 화면
- [ ] 달성 인증서 또는 공유용 이미지
- [ ] 미달성 시 격려 + 재도전 옵션

---

# Epic 5: 결제 & 설정

**목표:** IAP 결제 통합 및 설정 화면 구현

**예상 기간:** 4일

---

## Story 5.1: 구매 화면

**Priority:** 🔴 Critical  
**Estimate:** 5 hours

### Description
6주 프로그램 구매 화면을 구현합니다.

### Acceptance Criteria
- [ ] `app/(auth)/purchase.tsx` 생성
- [ ] 프로그램 요약 카드
- [ ] 가격 표시 (스토어에서 가져오기)
- [ ] 포함 내용 리스트
- [ ] [구매하기] CTA 버튼
- [ ] [구매 복원] 텍스트 링크
- [ ] 구매 성공 시 홈으로 이동
- [ ] 구매 실패 시 에러 메시지

---

## Story 5.2: IAP 통합

**Priority:** 🔴 Critical  
**Estimate:** 6 hours

### Description
react-native-iap를 사용하여 인앱 결제를 통합합니다.

### Acceptance Criteria
- [ ] `react-native-iap` 설치 및 설정
- [ ] `lib/iap.ts` 헬퍼 함수 구현:
  - `initIAP()`
  - `getProduct()`
  - `purchaseProduct()`
  - `restorePurchases()`
- [ ] iOS/Android 상품 ID 설정
- [ ] 구매 상태 `usePurchaseStore`에 저장
- [ ] 구매 복원 기능
- [ ] 에러 핸들링

### Technical Notes
```bash
npm install react-native-iap
# iOS: pod install 필요
# Android: billing 권한 설정
```

---

## Story 5.3: 설정 화면

**Priority:** 🟢 Medium  
**Estimate:** 3 hours

### Description
앱 설정을 관리하는 화면을 구현합니다.

### Acceptance Criteria
- [ ] `app/(tabs)/settings.tsx` 구현
- [ ] 언어 선택 (한국어/영어)
- [ ] 사운드 토글
- [ ] 진동 토글
- [ ] [구매 복원] 버튼
- [ ] 앱 버전 표시
- [ ] 개인정보 처리방침 링크 (선택)

---

# Sprint Planning

## Sprint 1 (Week 1-2)

| Story | Epic | Priority | Estimate |
|-------|------|----------|----------|
| 1.1 | 프로젝트 셋업 | 🔴 | 2h |
| 1.2 | 디자인 시스템 | 🔴 | 4h |
| 1.3 | 상태 관리 | 🔴 | 3h |
| 1.4 | 다국어 | 🟡 | 2h |
| 2.1 | Welcome | 🔴 | 3h |
| 2.2 | Test Intro | 🔴 | 2h |
| 2.3 | Initial Test | 🔴 | 6h |
| 2.4 | Test Result | 🔴 | 4h |

**Total: 26 hours**

---

## Sprint 2 (Week 2-3)

| Story | Epic | Priority | Estimate |
|-------|------|----------|----------|
| 3.1 | Program Data | 🔴 | 4h |
| 3.2 | Home Screen | 🔴 | 4h |
| 3.3 | Workout Session | 🔴 | 8h |
| 3.4 | Rest Timer | 🔴 | 4h |
| 3.5 | Session Complete | 🟡 | 4h |
| 4.1 | Progress Screen | 🟡 | 5h |

**Total: 29 hours**

---

## Sprint 3 (Week 3-4)

| Story | Epic | Priority | Estimate |
|-------|------|----------|----------|
| 4.2 | Exhaustion Test | 🔴 | 5h |
| 4.3 | Adaptive Planning | 🟡 | 4h |
| 4.4 | Program Complete | 🟡 | 4h |
| 5.1 | Purchase Screen | 🔴 | 5h |
| 5.2 | IAP Integration | 🔴 | 6h |
| 5.3 | Settings | 🟢 | 3h |

**Total: 27 hours**

---

## Definition of Done

모든 스토리는 다음 조건을 충족해야 합니다:

- [ ] 모든 Acceptance Criteria 충족
- [ ] TypeScript 타입 오류 없음
- [ ] iOS Simulator에서 테스트 완료
- [ ] Android Emulator에서 테스트 완료
- [ ] 한국어/영어 번역 적용
- [ ] 다크 모드 지원

---

*Epics & Stories 완료: 2026-01-11*

---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-03-patterns", "step-04-screens", "step-05-complete"]
inputDocuments:
  - "prd.md"
  - "product-brief-hectos-2026-01-11.md"
status: "complete"
---

# UX Design Specification - Hectos

**Author:** Minki  
**Date:** 2026-01-11  
**Version:** 1.0  
**Status:** Complete

---

## Executive Summary

Hectos는 푸쉬업 초보자를 위한 6주 트레이닝 앱입니다. UX의 핵심 목표는:

1. **심플함** - 복잡한 설정 없이 바로 운동 시작
2. **동기부여** - 진도 시각화와 격려로 6주 완주 지원
3. **신뢰감** - 정확한 카운팅과 투명한 결제

---

## Design Principles

### 1. 🎯 One-Tap Workout

> "앱을 열면 바로 오늘의 운동이 보이고, 한 번 탭으로 시작"

- 홈 화면 = 오늘의 운동
- 불필요한 네비게이션 최소화
- 운동 시작까지 최대 2탭

### 2. 💪 Encouraging, Not Punishing

> "실패해도 괜찮아요. 다시 도전하면 됩니다."

- 실패 시 부정적 메시지 금지
- 항상 다음 단계 제안
- 작은 성취도 축하

### 3. 📊 Progress is Visible

> "내가 얼마나 왔는지, 얼마나 남았는지 항상 알 수 있어요"

- 진도 프로그레스 바 항상 표시
- 주차별 완료 상태 시각화
- 총 푸쉬업 수 누적 표시

### 4. 🔢 Touch = Count

> "화면을 터치하면 카운트. 가장 단순하고 정확한 방법"

- 전체 화면이 터치 영역
- 즉각적인 시각/청각/촉각 피드백
- 실수 카운트 수정 가능

---

## Color Palette

### Primary Colors

| 용도 | 색상 | HEX | 설명 |
|------|------|-----|------|
| **Primary** | Electric Blue | `#3B82F6` | CTA, 강조 |
| **Primary Dark** | Deep Blue | `#1E40AF` | Pressed 상태 |
| **Secondary** | Emerald | `#10B981` | 성공, 완료 |
| **Accent** | Amber | `#F59E0B` | 경고, 진행 중 |

### Neutral Colors

| 용도 | Light Mode | Dark Mode |
|------|-----------|-----------|
| **Background** | `#FFFFFF` | `#0F172A` |
| **Surface** | `#F8FAFC` | `#1E293B` |
| **Text Primary** | `#1E293B` | `#F8FAFC` |
| **Text Secondary** | `#64748B` | `#94A3B8` |
| **Border** | `#E2E8F0` | `#334155` |

### Semantic Colors

| 용도 | 색상 | HEX |
|------|------|-----|
| **Success** | Green | `#22C55E` |
| **Warning** | Yellow | `#EAB308` |
| **Error** | Red | `#EF4444` |
| **Info** | Blue | `#3B82F6` |

---

## Typography

### Font Family

- **Primary:** Inter (Google Fonts)
- **Fallback:** SF Pro Display (iOS), Roboto (Android)
- **Monospace:** JetBrains Mono (숫자 표시)

### Type Scale

| 용도 | Size | Weight | Line Height |
|------|------|--------|-------------|
| **Display** | 48px | Bold (700) | 1.1 |
| **H1** | 32px | Bold (700) | 1.2 |
| **H2** | 24px | SemiBold (600) | 1.3 |
| **H3** | 20px | SemiBold (600) | 1.4 |
| **Body** | 16px | Regular (400) | 1.5 |
| **Body Small** | 14px | Regular (400) | 1.5 |
| **Caption** | 12px | Medium (500) | 1.4 |

### Counter Typography (운동 중)

| 용도 | Size | Weight |
|------|------|--------|
| **Current Count** | 120px | Bold |
| **Target Count** | 32px | Medium |
| **Set Info** | 20px | Regular |

---

## Spacing & Layout

### Spacing Scale

| Token | Value | 사용처 |
|-------|-------|--------|
| `xs` | 4px | 아이콘 gap |
| `sm` | 8px | 인라인 요소 |
| `md` | 16px | 카드 패딩 |
| `lg` | 24px | 섹션 간격 |
| `xl` | 32px | 페이지 패딩 |
| `2xl` | 48px | 큰 섹션 |

### Border Radius

| Token | Value | 사용처 |
|-------|-------|--------|
| `sm` | 8px | 버튼, 입력 |
| `md` | 12px | 카드 |
| `lg` | 16px | 모달 |
| `full` | 9999px | 원형 버튼 |

---

## Screen Inventory

### 1. Onboarding Flow

#### 1.1 Welcome Screen
- 앱 로고 + 태그라인
- "100개 푸쉬업, 6주면 충분합니다"
- [시작하기] CTA

#### 1.2 Initial Test Intro
- 테스트 안내 일러스트
- "지금 최대 몇 개 할 수 있나요?"
- [테스트 시작] CTA

#### 1.3 Initial Test Screen
- 대형 카운터 (전체 화면)
- 터치로 카운팅
- [완료] 버튼

#### 1.4 Test Result Screen
- 결과 표시 "5개!"
- Column 배정 설명
- "Column 1에서 시작합니다"
- [프로그램 시작] CTA → 결제

### 2. Purchase Flow

#### 2.1 Purchase Screen
- 프로그램 요약 카드
- 가격 표시 (일회성)
- 포함 내용 리스트
- [구매하기] CTA
- [구매 복원] 링크

### 3. Main App

#### 3.1 Home Screen (Today's Workout)
- 상단: 진도 프로그레스 바
- 중앙: "Week 2 Day 1" 카드
  - 세트 리스트 미리보기
  - 예상 시간
- [운동 시작] CTA
- 하단: 빠른 통계 (총 푸쉬업, 스트릭)

#### 3.2 Workout Session Screen
- 상단: 세트 진행 (1/5)
- 중앙: 대형 카운터
  - 현재 카운트 (120px)
  - 목표 카운트 (/10)
- 전체 화면 터치 영역
- 하단: [완료] 버튼

#### 3.3 Rest Timer Screen
- 중앙: 카운트다운 타이머
- "60초 휴식"
- 프로그레스 링
- [건너뛰기] 옵션

#### 3.4 Session Complete Screen
- 🎉 축하 애니메이션
- 세션 통계
  - 총 푸쉬업
  - 완료 세트
  - 소요 시간
- [홈으로] CTA

### 4. Progress & Stats

#### 4.1 Progress Screen
- 6주 캘린더 뷰
- 완료일 표시
- 주차별 통계
- Exhaustion Test 결과

#### 4.2 Exhaustion Test Screen
- 테스트 안내
- 대형 카운터
- 결과 + 레벨 재배정

### 5. Settings

#### 5.1 Settings Screen
- 언어 선택
- 알림 설정 (v1.5)
- 사운드/진동 토글
- 구매 복원
- 버전 정보

---

## Component Library

### Buttons

| 타입 | 용도 | 스타일 |
|------|------|--------|
| **Primary** | CTA | Filled, Primary color |
| **Secondary** | 보조 액션 | Outlined |
| **Ghost** | 텍스트 링크 | Text only |
| **Icon** | 아이콘 버튼 | Circle, 48x48 |

### Cards

| 타입 | 용도 |
|------|------|
| **Workout Card** | 오늘의 운동 표시 |
| **Stat Card** | 통계 표시 |
| **Progress Card** | 진행률 표시 |

### Feedback

| 타입 | 용도 |
|------|------|
| **Toast** | 간단한 알림 |
| **Modal** | 확인 필요 |
| **Bottom Sheet** | 옵션 선택 |

---

## Interaction Patterns

### Touch Counting

```
터치 → 
  진동 (15ms) +
  숫자 증가 애니메이션 (scale 1.1 → 1.0) +
  사운드 (선택적)
```

### Rest Timer

```
세트 완료 →
  축하 애니메이션 (0.5s) →
  자동 휴식 화면 전환 →
  카운트다운 시작 →
  완료 시 다음 세트 안내
```

### Session Complete

```
마지막 세트 완료 →
  대기 (0.5s) →
  축하 화면 + Confetti →
  통계 표시 →
  홈으로 버튼
```

---

## Navigation Structure

```
App
├── Onboarding (첫 실행)
│   ├── Welcome
│   ├── Initial Test
│   └── Result → Purchase
│
├── Main Tabs
│   ├── Home (Today)
│   ├── Progress
│   └── Settings
│
└── Workout Flow (Modal)
    ├── Session
    ├── Rest Timer
    └── Complete
```

---

## Accessibility

### Requirements

1. **최소 터치 영역**: 44x44pt
2. **색상 대비**: WCAG AA (4.5:1)
3. **다크 모드**: 완전 지원
4. **Dynamic Type**: iOS 시스템 폰트 크기 반영
5. **VoiceOver/TalkBack**: 기본 지원

### Counter Accessibility

- 카운트 변경 시 VoiceOver 알림
- 진동 피드백 (청각 장애 사용자)
- 고대비 모드 지원

---

## Animations

### Micro-interactions

| 요소 | 애니메이션 | Duration |
|------|----------|----------|
| 버튼 Press | Scale 0.95 | 100ms |
| 카운트 증가 | Scale 1.1 → 1.0 | 150ms |
| 카드 탭 | Elevation 변화 | 200ms |
| 화면 전환 | Slide/Fade | 300ms |

### Celebrations

| 이벤트 | 애니메이션 |
|--------|----------|
| 세트 완료 | Checkmark + Pulse |
| 세션 완료 | Confetti |
| 주차 완료 | Star burst |
| 100개 달성 | Full-screen celebration |

---

## Assets Required

### Icons

- Home, Progress, Settings (탭 바)
- Play, Pause, Stop (운동 컨트롤)
- Check, X (완료/취소)
- Trophy, Star, Fire (게이미피케이션)

### Illustrations

- Welcome 온보딩
- 푸쉬업 자세 가이드
- 달성 축하
- 빈 상태

### App Icon

- 푸쉬업/100 숫자 모티브
- Primary Blue 배경
- 미니멀 디자인

---

## Dark Mode

### 적용 원칙

1. 배경은 순수 검정(`#000`) 대신 다크 슬레이트(`#0F172A`) 사용
2. 테두리와 구분선 미묘하게 표시
3. 이미지/일러스트 밝기 조정
4. 시스템 설정 따르기 (자동)

---

## Responsive Design

### 지원 화면

| 디바이스 | 화면 크기 |
|----------|----------|
| iPhone SE | 375 x 667 |
| iPhone 14 | 390 x 844 |
| iPhone 14 Pro Max | 430 x 932 |
| iPad Mini | 744 x 1133 |
| Android Small | 360 x 640 |
| Android Large | 412 x 915 |

### 적응 전략

- 카운터 크기: 화면 비율에 따라 조정
- 버튼: 항상 화면 하단 고정 (Safe Area 고려)
- 카드: 가로 패딩 유지, 높이 유연

---

## Prototype Links

> 프로토타입은 구현 단계에서 생성 예정

- [ ] Figma Wireframes
- [ ] Interactive Prototype
- [ ] Design System Components

---

*UX Design Specification 완료: 2026-01-11*

---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-03-success", "step-04-journeys", "step-05-functional", "step-06-nonfunctional", "step-07-constraints", "step-08-risks", "step-09-dependencies", "step-10-timeline", "step-11-complete"]
inputDocuments:
  - "product-brief-hectos-2026-01-11.md"
  - "research/market-pushup-apps-research-2026-01-11.md"
workflowType: 'prd'
documentCounts:
  briefs: 1
  research: 1
  brainstorming: 0
  projectDocs: 0
classification:
  projectType: "mobile-app"
  domain: "fitness"
  complexity: "medium"
  projectContext: "greenfield"
status: "complete"
---

# Product Requirements Document - Hectos

**Author:** Minki  
**Date:** 2026-01-11  
**Version:** 1.0  
**Status:** Complete

---

## Executive Summary

**Hectos**는 hundredpushups.com의 검증된 6주 프로그램을 정확히 구현한 푸쉬업 트레이닝 앱입니다. 기존 앱들의 공통적인 문제점(부정확한 카운팅, 유연성 부족, 숨겨진 결제)을 모두 해결하여, 푸쉬업을 한 개도 못하는 초보자도 6주 만에 100개를 달성할 수 있도록 돕습니다.

**핵심 가치:** "정확하고, 유연하며, 정직한" 푸쉬업 트레이닝 경험

**비즈니스 모델:** 일회성 결제 - 한 번 구매로 100개 달성까지 완벽한 코칭 제공

---

## Success Criteria

### User Success

1. **핵심 목표 달성**
   - 100개 연속 푸쉬업 달성 사용자: 구매자의 60% 이상
   - 프로그램 완주 (6주 완료): 시작자의 70% 이상

2. **경험 품질**
   - 첫 운동 완료율: 95% 이상 (온보딩 성공)
   - 2주차 완료율: 70% 이상 (초기 이탈 방지)
   - 세션 중 앱 크래시: 0%

3. **사용자 만족**
   - 앱스토어 평점: 4.5★ 이상
   - 긍정 리뷰 비율: 80% 이상

### Business Success

1. **3개월 목표**
   - 다운로드: 10,000+
   - 구매 전환율: 5%
   - 총 매출: $5,000+

2. **12개월 목표**
   - 다운로드: 100,000+
   - 구매 전환율: 8%
   - 총 매출: $50,000+
   - 앱스토어 평점: 4.7★

### Technical Success

1. **안정성**
   - 크래시 없는 운동 세션 완료율: 99.9%
   - 앱 시작 시간: 2초 이내

2. **호환성**
   - iOS 15+ 지원
   - Android 10+ 지원

### Measurable Outcomes

| 지표 | 측정 방법 | MVP 목표 | 성장 목표 |
|------|----------|---------|----------|
| 100개 달성률 | 완료 사용자 / 구매자 | 50% | 60% |
| 구매 전환 | 구매 / 다운로드 | 3% | 8% |
| 2주차 잔존 | 2주차 시작 / 1주차 시작 | 60% | 75% |

---

## Product Scope

### MVP - Minimum Viable Product

1. 초기 테스트 & Column 배정
2. 6주 프로그램 (hundredpushups.com)
3. 운동 세션 (터치 카운터, 타이머)
4. Exhaustion Test (2주/4주차)
5. 적응형 플래닝
6. 진도 추적
7. IAP 일회성 결제
8. 한국어/영어 지원

### Growth Features (Post-MVP)

- Apple Watch 연동
- 근접 센서 카운팅 옵션
- 푸시 알림 리마인더
- 위젯 지원

### Vision (Future)

- AI 폼 분석
- 소셜/리더보드
- 클라우드 동기화
- 추가 운동 프로그램

---

## User Journeys

### Journey 1: 신규 사용자 온보딩

```
1. 앱스토어에서 "100 pushups" 검색
2. Hectos 앱 다운로드 (무료)
3. 앱 실행 → 환영 화면
4. 초기 테스트 안내 → "지금 최대 몇 개 할 수 있나요?"
5. 초기 테스트 수행 → 터치로 카운팅
6. 결과 표시 → "5개! Column 1에서 시작합니다"
7. 6주 프로그램 구매 화면
8. 일회성 결제 완료
9. Week 1 Day 1 시작!
```

### Journey 2: 일일 운동 세션

```
1. 앱 실행 → 오늘의 운동 표시 "Week 2 Day 2"
2. "운동 시작" 탭
3. Set 1 표시: "10개 목표"
4. 화면 터치로 카운팅 → "1... 2... 3..."
5. Set 완료 → "잘했어요! 60초 휴식"
6. 휴식 타이머 카운트다운
7. Set 2-5 반복
8. 마지막 Set (Max): "최대한 많이!"
9. 세션 완료 → 축하 + 통계
10. 내일 운동 알림 설정 (선택)
```

### Journey 3: Exhaustion Test

```
1. Week 2 완료 후 → "Exhaustion Test 시간입니다"
2. 테스트 안내 → "최대한 많이 하세요"
3. 터치로 카운팅
4. 완료 → 결과 표시 "25개!"
5. 레벨 재배정 → "Column 2로 업그레이드!"
6. Week 3 프로그램 업데이트됨
```

### Journey 4: 프로그램 완료

```
1. Week 6 Day 3 완료
2. 최종 테스트 → "100개 도전!"
3. 카운팅... 50... 75... 100!
4. 🎉 축하 화면 + 애니메이션
5. 달성 인증서 (스크린샷용)
6. 공유 옵션
```

---

## Functional Requirements

### FR-1: 사용자 온보딩

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| FR-1.1 | 앱 첫 실행 시 환영 화면 표시 | Must |
| FR-1.2 | 초기 테스트 안내 및 진행 | Must |
| FR-1.3 | 테스트 결과 기반 Column 자동 배정 | Must |
| FR-1.4 | 언어 선택 (한국어/영어) | Must |

### FR-2: 100 Pushups 프로그램

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| FR-2.1 | 6주 프로그램 데이터 (Week 1-6) | Must |
| FR-2.2 | 3개 Column 구조 (초급/중급/고급) | Must |
| FR-2.3 | 각 Day별 세트/반복 수 표시 | Must |
| FR-2.4 | Week별 휴식 시간 차별화 (60/90/120초) | Must |
| FR-2.5 | Exhaustion Test (Week 2, 4 말) | Must |
| FR-2.6 | 테스트 결과 기반 Column 재배정 | Must |

### FR-3: 운동 세션

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| FR-3.1 | 현재 세트/반복 목표 표시 | Must |
| FR-3.2 | 화면 터치로 카운팅 | Must |
| FR-3.3 | 음성/진동 피드백 (선택) | Should |
| FR-3.4 | 휴식 타이머 (자동 카운트다운) | Must |
| FR-3.5 | 세션 중단 및 재개 | Must |
| FR-3.6 | 마지막 세트 "Max" 모드 | Must |

### FR-4: 적응형 플래닝

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| FR-4.1 | 세트 미완료 시 조정 옵션 | Must |
| FR-4.2 | 주차 반복 기능 | Must |
| FR-4.3 | 컨디션 저하 시 쉬운 대안 제공 | Should |

### FR-5: 진도 추적

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| FR-5.1 | 현재 주차/일차 표시 | Must |
| FR-5.2 | 완료 세션 기록 | Must |
| FR-5.3 | 총 푸쉬업 수 누적 | Must |
| FR-5.4 | 진행률 시각화 (프로그레스 바) | Should |

### FR-6: 결제 (IAP)

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| FR-6.1 | iOS/Android In-App Purchase 통합 | Must |
| FR-6.2 | 일회성 결제 상품 (6주 프로그램) | Must |
| FR-6.3 | 구매 복원 기능 | Must |
| FR-6.4 | 구매 전 기능 미리보기 | Should |

### FR-7: 다국어 지원

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| FR-7.1 | 한국어 UI 완전 지원 | Must |
| FR-7.2 | 영어 UI 완전 지원 | Must |
| FR-7.3 | 시스템 언어 자동 감지 | Should |
| FR-7.4 | 앱 내 언어 변경 | Should |

---

## Non-Functional Requirements

### NFR-1: 성능

| ID | 요구사항 | 목표 |
|----|---------|------|
| NFR-1.1 | 앱 시작 시간 | < 2초 |
| NFR-1.2 | 화면 전환 시간 | < 300ms |
| NFR-1.3 | 터치 반응 시간 | < 100ms |
| NFR-1.4 | 메모리 사용량 | < 150MB |

### NFR-2: 안정성

| ID | 요구사항 | 목표 |
|----|---------|------|
| NFR-2.1 | 크래시율 | < 0.1% |
| NFR-2.2 | 운동 세션 완료율 | 99.9% |
| NFR-2.3 | 데이터 손실률 | 0% |

### NFR-3: 호환성

| ID | 요구사항 | 목표 |
|----|---------|------|
| NFR-3.1 | iOS 버전 | 15.0+ |
| NFR-3.2 | Android 버전 | 10.0+ (API 29) |
| NFR-3.3 | 화면 크기 | 4인치 ~ 12.9인치 |

### NFR-4: 보안

| ID | 요구사항 | 목표 |
|----|---------|------|
| NFR-4.1 | 결제 정보 저장 금지 | 필수 |
| NFR-4.2 | 사용자 데이터 로컬 저장 | 필수 |
| NFR-4.3 | 분석 데이터 익명화 | 필수 |

### NFR-5: 접근성

| ID | 요구사항 | 목표 |
|----|---------|------|
| NFR-5.1 | 큰 텍스트 지원 | 필수 |
| NFR-5.2 | 다크 모드 지원 | 필수 |
| NFR-5.3 | VoiceOver/TalkBack 기본 지원 | Should |

### NFR-6: 오프라인

| ID | 요구사항 | 목표 |
|----|---------|------|
| NFR-6.1 | 결제 후 100% 오프라인 동작 | 필수 |
| NFR-6.2 | 프로그램 데이터 로컬 저장 | 필수 |

---

## Technical Constraints

### TC-1: 기술 스택

| 항목 | 기술 |
|------|------|
| **Framework** | React Native + Expo (SDK 52+) |
| **Language** | TypeScript |
| **State Management** | Zustand |
| **Storage** | AsyncStorage / MMKV |
| **IAP** | react-native-iap |
| **Navigation** | Expo Router |
| **i18n** | i18next |
| **Analytics** | PostHog (선택) |

### TC-2: 플랫폼 제약

| 제약 | 설명 |
|------|------|
| **iOS** | App Store 가이드라인 준수, IAP 필수 |
| **Android** | Play Store 가이드라인 준수 |
| **Expo** | EAS Build 사용, Native 모듈 제한 |

### TC-3: 데이터 구조

| 데이터 | 저장 위치 | 형식 |
|--------|----------|------|
| 프로그램 데이터 | 앱 번들 | JSON |
| 사용자 진도 | 로컬 스토리지 | JSON |
| 설정 | 로컬 스토리지 | JSON |
| 구매 상태 | 스토어 + 로컬 | Boolean |

---

## Risks & Mitigations

### Risk 1: 앱스토어 리젝션

| 항목 | 내용 |
|------|------|
| **확률** | 중간 |
| **영향** | 높음 |
| **원인** | IAP 구현 오류, 메타데이터 누락 |
| **완화** | 사전 가이드라인 체크리스트, 테스트 빌드 제출 |

### Risk 2: 경쟁 앱 대응

| 항목 | 내용 |
|------|------|
| **확률** | 높음 |
| **영향** | 중간 |
| **원인** | 시장에 유사 앱 다수 존재 |
| **완화** | 차별화 포인트 강조 (정확한 프로그램, 적응형 플래닝) |

### Risk 3: 사용자 이탈

| 항목 | 내용 |
|------|------|
| **확률** | 중간 |
| **영향** | 높음 |
| **원인** | 6주 장기 프로그램, 동기부여 저하 |
| **완화** | 격려 메시지, 진도 시각화, 적응형 난이도 |

---

## Dependencies

### 외부 의존성

| 의존성 | 용도 | 리스크 |
|--------|------|--------|
| App Store Connect | iOS 배포 | 리젝션 가능성 |
| Google Play Console | Android 배포 | 리젝션 가능성 |
| Expo EAS | 빌드/배포 | 서비스 장애 |
| hundredpushups.com | 프로그램 데이터 | 저작권 확인 필요 |

### 내부 의존성

| 의존성 | 용도 | 상태 |
|--------|------|------|
| 프로그램 데이터 | 6주 세트/반복 데이터 | 수집 필요 |
| 번역 파일 | 한/영 텍스트 | 작성 필요 |
| 앱 아이콘/스플래시 | 브랜딩 에셋 | 디자인 필요 |

---

## Timeline

### Phase 1: MVP 개발 (4주)

| 주차 | 마일스톤 |
|------|----------|
| Week 1 | 프로젝트 셋업, 프로그램 데이터 구조, 기본 UI |
| Week 2 | 초기 테스트, Column 배정, 운동 세션 기본 |
| Week 3 | 6주 프로그램, Exhaustion Test, 진도 추적 |
| Week 4 | IAP 통합, 다국어, 버그 수정 |

### Phase 2: 테스트 & 출시 (2주)

| 주차 | 마일스톤 |
|------|----------|
| Week 5 | 내부 테스트, TestFlight/내부 테스트 트랙 |
| Week 6 | 앱스토어 제출, 리뷰 대응, 출시 |

### Phase 3: Post-Launch (지속)

| 기간 | 활동 |
|------|------|
| Week 7-8 | 사용자 피드백 수집, 버그 수정 |
| Month 2-3 | Growth 기능 (알림, 위젯) |
| Month 4-6 | v1.5 기능 (Watch, 센서) |

---

## Appendix

### A. hundredpushups.com 프로그램 구조

**Column 분류 (초기 테스트 기준):**
- Column 1: 0-5개
- Column 2: 6-10개
- Column 3: 11-20개

**주차별 구조:**
- Week 1-2: 기초 빌드업
- Exhaustion Test 1 (Week 2 말)
- Week 3-4: 중급 강화
- Exhaustion Test 2 (Week 4 말)
- Week 5-6: 최종 도전
- Final Test: 100개 도전!

### B. 용어 정의

| 용어 | 정의 |
|------|------|
| **Column** | 사용자 레벨에 따른 프로그램 난이도 그룹 |
| **Exhaustion Test** | 최대 푸쉬업 개수 측정 테스트 |
| **Max Set** | 마지막 세트에서 최대한 많이 수행 |
| **적응형 플래닝** | 사용자 성과에 따라 자동 조정되는 프로그램 |

---

*PRD 완료: 2026-01-11*

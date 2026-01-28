# Hectos 소구점 가설 보고서 (Hypothesis Report)

---

## 👨‍💼 [대표님을 위한 3줄 요약]

1. **무엇을 만들었나요?**: 광고와 앱스토어에서 테스트할 수 있는 **10개의 소구점 가설**을 만들었습니다.
2. **어떤 기준으로?**: 각 가설은 퍼소나 × VP 조합에서 출발하며, 측정 지표(CPI/CTR)와 ICE 점수가 붙어있습니다.
3. **바로 쓸 수 있나요?**: 상위 3개(ICE Top 3)를 우선 테스트하면, 예산 대비 최대 학습을 얻을 수 있습니다.

---

## 📋 요약

| 항목 | 내용 |
|------|------|
| **총 가설 수** | 10개 (퍼소나 4명 × VP 2~3개) |
| **핵심 타겟 퍼소나** | Kevin (인지 부하), Travis (정체기) |
| **ICE Top 3** | H01, H03, H06 |
| **측정 지표** | Primary: CPI, Secondary: CTR, Guardrail: D7 Retention |

---

## 🔬 가설 리스트 (10개)

### H01: Kevin × 자동 카운팅 (숫자 집중 해방) ✅ ICE Top
> **가설 문장**: Kevin의 "숫자 세다 헷갈림" 문제에 맞춘 "자동 카운팅" VP를 소구하기 위해 **"숫자는 앱이, 집중은 당신이"**라는 고객 언어로 소구하면 더 많은 고객을 획득할 것이다.

| 항목 | 내용 |
|------|------|
| **변화 요인** | 헤드라인 카피 (자동 카운팅 강조) |
| **Primary Metric** | CPI (Cost Per Install) |
| **Secondary Metric** | CTR (Click-Through Rate) |
| **Guardrail Metric** | D7 Retention |
| **중단 기준** | CPI가 벤치마크(₩2,000) 대비 50% 이상 악화 시 중단 |
| **근거** | "I keep losing count after 15 reps" — Reddit (Research Raw Log) |

---

### H02: Kevin × 터치리스 경험
> **가설 문장**: Kevin의 "화면 터치가 귀찮음" 문제에 맞춘 "터치리스" VP를 소구하기 위해 **"터치 없이, 얼굴만 인식하면 끝"**이라는 고객 언어로 소구하면 더 많은 고객을 획득할 것이다.

| 항목 | 내용 |
|------|------|
| **변화 요인** | 헤드라인 카피 (터치리스 강조) |
| **Primary Metric** | CPI |
| **Secondary Metric** | CTR |
| **Guardrail Metric** | D7 Retention |
| **중단 기준** | CPI 벤치마크 대비 50% 악화 시 |
| **근거** | "I don't want to tap the screen between sets" — Reddit |

---

### H03: Travis × 6주 완성 (목표 명확성) ✅ ICE Top
> **가설 문장**: Travis의 "정체기에서 포기" 문제에 맞춘 "6주 완성" VP를 소구하기 위해 **"0개부터 100개까지. 6주면 충분합니다."**라는 고객 언어로 소구하면 더 많은 고객을 획득할 것이다.

| 항목 | 내용 |
|------|------|
| **변화 요인** | 헤드라인 카피 (6주 목표 명시) |
| **Primary Metric** | CPI |
| **Secondary Metric** | CTR |
| **Guardrail Metric** | Week 1 Completion Rate |
| **중단 기준** | CPI 벤치마크 대비 50% 악화 시 |
| **근거** | "I plateaued at week 4 and just gave up" — Reddit |

---

### H04: Travis × 배치 테스트 (맞춤 시작)
> **가설 문장**: Travis의 "프로그램이 너무 어려움" 문제에 맞춘 "배치 테스트" VP를 소구하기 위해 **"초급/중급/상급. 당신에게 맞는 곳에서 시작하세요."**라는 고객 언어로 소구하면 더 많은 고객을 획득할 것이다.

| 항목 | 내용 |
|------|------|
| **변화 요인** | 헤드라인 카피 (난이도 맞춤 강조) |
| **Primary Metric** | CPI |
| **Secondary Metric** | CTR |
| **Guardrail Metric** | D7 Retention |
| **중단 기준** | CPI 벤치마크 대비 50% 악화 시 |
| **근거** | "Unrealistic training plans with extreme increments" — App Store |

---

### H05: Travis × 데일리 미션
> **가설 문장**: Travis의 "오늘 뭘 해야 할지 모름" 문제에 맞춘 "데일리 미션" VP를 소구하기 위해 **"오늘 뭘 해야 하는지, 앱이 알려줍니다."**라는 고객 언어로 소구하면 더 많은 고객을 획득할 것이다.

| 항목 | 내용 |
|------|------|
| **변화 요인** | 헤드라인 카피 (일일 가이드 강조) |
| **Primary Metric** | CPI |
| **Secondary Metric** | CTR |
| **Guardrail Metric** | D7 Retention |
| **중단 기준** | CPI 벤치마크 대비 50% 악화 시 |
| **근거** | "Just tell me what to do each day" — Reddit |

---

### H06: Sarah × 온디바이스 AI (프라이버시) ✅ ICE Top
> **가설 문장**: Sarah의 "카메라 프라이버시 불안" 문제에 맞춘 "온디바이스 AI" VP를 소구하기 위해 **"Your data stays on your phone. Period."**라는 고객 언어로 소구하면 더 많은 고객을 획득할 것이다.

| 항목 | 내용 |
|------|------|
| **변화 요인** | 헤드라인 카피 (프라이버시 강조) |
| **Primary Metric** | CPI |
| **Secondary Metric** | CTR |
| **Guardrail Metric** | D7 Retention |
| **중단 기준** | CPI 벤치마크 대비 50% 악화 시 |
| **근거** | "The privacy nightmare of modern fitness apps is real" — Reddit r/privacy |

---

### H07: Sarah × 영상 녹화 없음
> **가설 문장**: Sarah의 "영상 저장 불안" 문제에 맞춘 "No Recording" VP를 소구하기 위해 **"녹화하지 않습니다. 저장하지 않습니다."**라는 고객 언어로 소구하면 더 많은 고객을 획득할 것이다.

| 항목 | 내용 |
|------|------|
| **변화 요인** | 헤드라인 카피 (녹화 없음 강조) |
| **Primary Metric** | CPI |
| **Secondary Metric** | CTR |
| **Guardrail Metric** | D7 Retention |
| **중단 기준** | CPI 벤치마크 대비 50% 악화 시 |
| **근거** | "Will the app record me working out?" — Reddit |

---

### H08: Elena × 프리미엄 디자인
> **가설 문장**: Elena의 "투박한 UI" 문제에 맞춘 "프리미엄 디자인" VP를 소구하기 위해 **"운동하고 싶게 만드는 디자인."**이라는 고객 언어로 소구하면 더 많은 고객을 획득할 것이다.

| 항목 | 내용 |
|------|------|
| **변화 요인** | 광고 크리에이티브 (UI 스크린샷 중심) |
| **Primary Metric** | CPI |
| **Secondary Metric** | CTR |
| **Guardrail Metric** | D7 Retention |
| **중단 기준** | CPI 벤치마크 대비 50% 악화 시 |
| **근거** | "Looking for an app with a premium feel" — Reddit |

---

### H09: Elena × 다크모드
> **가설 문장**: Elena의 "밤에 불편" 문제에 맞춘 "다크모드" VP를 소구하기 위해 **"밤에도 눈 편하게. 다크모드 완벽 지원."**이라는 고객 언어로 소구하면 더 많은 고객을 획득할 것이다.

| 항목 | 내용 |
|------|------|
| **변화 요인** | 광고 크리에이티브 (다크모드 스크린샷) |
| **Primary Metric** | CPI |
| **Secondary Metric** | CTR |
| **Guardrail Metric** | D7 Retention |
| **중단 기준** | CPI 벤치마크 대비 50% 악화 시 |
| **근거** | "Dark mode" — Customer Language List |

---

### H10: Multi-Persona × 컨페티 축하
> **가설 문장**: 전체 타겟의 "성취감 부족" 문제에 맞춘 "축하 효과" VP를 소구하기 위해 **"목표 달성? 컨페티가 터집니다! 🎉"**라는 고객 언어로 소구하면 더 많은 고객을 획득할 것이다.

| 항목 | 내용 |
|------|------|
| **변화 요인** | 광고 크리에이티브 (축하 화면 영상) |
| **Primary Metric** | CPI |
| **Secondary Metric** | CTR |
| **Guardrail Metric** | D7 Retention |
| **중단 기준** | CPI 벤치마크 대비 50% 악화 시 |
| **근거** | "Awards for personal records", "Confetti celebrations" — Research |

---

## 📊 ICE 우선순위 표

| ID | Hypothesis | Impact (1-10) | Confidence (1-10) | Ease (1-10) | Total | Rank |
|----|------------|---------------|-------------------|-------------|-------|------|
| H01 | 숫자는 앱이, 집중은 당신이 | 9 | 8 | 9 | **26** | 🥇 1 |
| H03 | 0→100, 6주면 충분 | 9 | 8 | 8 | **25** | 🥈 2 |
| H06 | Your data stays on your phone | 8 | 9 | 8 | **25** | 🥉 3 |
| H02 | 터치 없이 얼굴 인식 | 7 | 7 | 9 | 23 | 4 |
| H05 | 오늘 뭘 해야 하는지 앱이 | 7 | 7 | 8 | 22 | 5 |
| H04 | 초급/중급/상급 맞춤 | 6 | 7 | 8 | 21 | 6 |
| H08 | 운동하고 싶게 만드는 디자인 | 7 | 6 | 7 | 20 | 7 |
| H07 | 녹화하지 않습니다 | 6 | 8 | 6 | 20 | 8 |
| H10 | 컨페티 터집니다 | 5 | 6 | 8 | 19 | 9 |
| H09 | 다크모드 완벽 지원 | 4 | 6 | 9 | 19 | 10 |

---

## ⭐ Top 3 추천 가설

### 1️⃣ H01: "숫자는 앱이, 집중은 당신이" (ICE: 26)
- **Why**: Hectos의 핵심 기능(자동 카운팅)을 가장 직접적으로 전달. Impact와 Ease 모두 높음.
- **Test 채널**: Instagram Reels, YouTube Shorts
- **예상 소재**: 푸쉬업 하면서 숫자 세다 헷갈리는 장면 → Hectos 사용 장면 대비

### 2️⃣ H03: "0개부터 100개까지. 6주면 충분합니다." (ICE: 25)
- **Why**: 새해 결심/챌린지 시즌에 강력한 훅. 명확한 목표 제시로 전환율 기대.
- **Test 채널**: Facebook, Google Ads
- **예상 소재**: "6주 전 vs 6주 후" Before/After 스토리

### 3️⃣ H06: "Your data stays on your phone. Period." (ICE: 25)
- **Why**: 프라이버시 민감층에게 강력한 차별화. Confidence(근거 신뢰도) 높음.
- **Test 채널**: Reddit Ads, App Store 설명
- **예상 소재**: 경쟁사 대비 "서버 전송 없음" 비교 인포그래픽

---

## ✅ QA 체크리스트

- [x] 가설 간 중복이 없는가? (MECE) ✅
- [x] 각 가설의 변화 요인이 1~2개로 제한되었는가? ✅
- [x] 지표(Primary/Secondary/Guardrail)가 명시되었는가? ✅
- [x] ICE 점수가 부여되었는가? ✅
- [x] 근거(고객 언어/리서치 인용)가 명시되었는가? ✅

---

*Created: 2026-01-18*  
*Agent: 50_hypothesis*  
*Project: Hectos - AI Pushup Coach*

# 퐁당퐁당 V5 이모지·프레임 구조 표준서

## 1. 기준

- 기준 버전: v4.5.9 이후
- 다음 적용 목표: v4.6.0 또는 v4.5.10 UI 구조 최적화
- 목적: 모든 버튼, 카드, 팝업, 도감, 미션, 카메라, GPS, VR/시네마 화면에 이모지를 무작위로 붙이지 않고, 공통 프레임 구조 안에서 일관되게 적용한다.

## 2. 핵심 원칙

1. 수족관은 메인이다. 이모지는 수족관 화면 안에 과하게 넣지 않는다.
2. 이모지는 버튼, 칩, 카드, 팝업 헤더, 도감 카드, 미션/배지, 토스트에만 우선 적용한다.
3. 물고기 렌더 레이어와 배경 오브젝트 레이어에는 이모지를 넣지 않는다.
4. 아이들이 한눈에 이해할 수 있어야 한다.
5. 텍스트와 이모지는 데이터로 분리한다.
6. 향후 SVG 아이콘 또는 자체 캐릭터 아이콘으로 교체 가능해야 한다.
7. 모바일 세로, 모바일 가로, 태블릿, PC에서 같은 데이터 구조를 사용하고 배치만 바꾼다.

## 3. 최상위 프레임 구조

| 레벨 | 이름 | 역할 |
|---|---|---|
| A | AppShell Frame | 앱 전체 safe-area, 배경, 공통 토큰 관리 |
| B | Screen Frame | 탐험, 도감, 카메라, GPS, 시네마 등 화면 단위 |
| C | Section Frame | 헤더, 수족관, 존 선택, 하단 메뉴 등 구역 단위 |
| D | Component Frame | 버튼, 카드, 칩, 패널, 모달 등 재사용 단위 |
| E | Content Slot | emoji, title, subtitle, badge, helper 슬롯 |
| F | Visual Asset Layer | 배경, 수초, 물고기, 바위, 입자, 광선 |
| G | Interaction Layer | 클릭, 탭, 팝업, 음성, 카메라, GPS 이벤트 |
| H | Data/Config Layer | 이모지, 메뉴, 존, 어종, 팝업, 미션 데이터 |

## 4. 이모지 적용 허용 프레임

| 프레임 | 적용 대상 | 구조 |
|---|---|---|
| Header Badge Frame | 앱명, 현재 상태 | emoji + title + small info |
| Chip Frame | 존 선택, 낮/밤 선택 | emoji + short label |
| Card Button Frame | 하단 메뉴 | emoji/icon + title + subtitle |
| Popup Header Frame | 물고기/미션/학습 팝업 | emoji + title + status badge |
| Book Card Frame | 도감 카드 | emoji + species name + zone + status |
| Mission/Badge Frame | 미션/보상 | emoji + badge label + progress |
| Toast/Notice Frame | 짧은 알림 | emoji + message |

## 5. 이모지 최소화 또는 금지 프레임

| 프레임 | 기준 |
|---|---|
| Aquarium Stage Frame | 이모지 금지. 수중 리얼리티 유지 |
| Fish Render Frame | 이모지 금지. 실제 물고기 이미지 유지 |
| Background/Object Layer | 이모지 금지. 배경 몰입감 유지 |
| Camera Preview Frame | 영상 영역에는 이모지 금지. 상태 UI에만 허용 |

## 6. Emoji Registry 표준

```js
const EMOJI_REGISTRY = {
  brand: '💧',
  explore: '🧭',
  book: '📘',
  rare: '⭐',
  camera: '📷',
  safety: '🛟',
  report: '📋',
  voice: '🎤',
  gps: '📍',
  vr: '🥽',
  cinema: '🎬',
  day: '☀️',
  night: '🌙',
  upper: '🐟',
  riffle: '🌊',
  shallow: '🔄',
  deep: '🌘',
  confluence: '🍃',
  mission: '🏆',
  discover: '🔍',
  completed: '✅',
  warning: '⚠️',
  locked: '🔒',
  audio: '🔊',
  close: '↩️'
};
```

## 7. 공통 Emoji Slot 구조

```html
<button class="pd-ui-card-button" data-action="book">
  <span class="pd-frame-emoji" aria-hidden="true">📘</span>
  <span class="pd-frame-text">
    <strong>도감</strong>
    <small>친구 카드</small>
  </span>
</button>
```

규칙:

- `.pd-frame-emoji`: 이모지 전용 슬롯
- `.pd-frame-text`: 제목/부제 슬롯
- `.pd-frame-badge`: 상태 배지 슬롯
- `.pd-frame-helper`: 보조 설명 슬롯

## 8. 메인 탐험 화면 프레임

| 프레임 ID | 이름 | 내용 |
|---|---|---|
| FRAME-01 | AppShell | safe-area, 배경, 루트 컨테이너 |
| FRAME-02 | TopHeader | 앱명, 현재 존, 빠른 액션 |
| FRAME-03 | AquariumStage | 수중 배경, 물고기, 오브젝트 |
| FRAME-04 | ZoneChipBar | 웃물, 여울, 잔여울, 깊물, 물모이 |
| FRAME-05 | ModeToggleBar | 낮물, 밤물 |
| FRAME-06 | MainMenuGrid | 탐험, 도감, 미션, 음성, 카메라, 크게보기 |
| FRAME-07 | BottomHelper | 짧은 힌트, 현재 상태 |

## 9. 메인 메뉴 데이터 표준

```js
const MAIN_MENU_DATA = [
  { id: 'explore', emojiKey: 'explore', title: '탐험', subtitle: '물속 보기', theme: 'explore' },
  { id: 'book', emojiKey: 'book', title: '도감', subtitle: '친구 카드', theme: 'book' },
  { id: 'mission', emojiKey: 'mission', title: '미션', subtitle: '찾아보기', theme: 'mission' },
  { id: 'voice', emojiKey: 'voice', title: '음성', subtitle: '설명 듣기', theme: 'voice' },
  { id: 'camera', emojiKey: 'camera', title: '카메라', subtitle: '현장 관찰', theme: 'camera' },
  { id: 'cinema', emojiKey: 'cinema', title: '크게보기', subtitle: '조용히 관찰', theme: 'cinema' }
];
```

## 10. 존 칩 데이터 표준

```js
const ZONE_CHIP_DATA = [
  { id: 'upper', emojiKey: 'upper', label: '웃물', short: '맑은 물' },
  { id: 'riffle', emojiKey: 'riffle', label: '여울', short: '빠른 물살' },
  { id: 'shallow', emojiKey: 'shallow', label: '잔여울', short: '얕은 흐름' },
  { id: 'deep', emojiKey: 'deep', label: '깊물', short: '깊은 곳' },
  { id: 'confluence', emojiKey: 'confluence', label: '물모이', short: '물길 만남' }
];
```

## 11. 기능별 색상 기준

| 기능 | 색상 방향 |
|---|---|
| 탐험 | 청록/민트 |
| 도감 | 연두/에메랄드 |
| 미션 | 노랑/주황 |
| 희귀/배지 | 보라/별빛 블루 |
| 카메라 | 주황/골드 |
| 안전 | 녹색 |
| 결과 | 파랑 |
| 음성 | 보라/자주 |
| GPS | 코럴/청록 |
| 시네마/VR | 딥블루/보라 |

## 12. 반응형 적용 기준

### 모바일 세로

- 수족관 우선
- 헤더 축소
- 메뉴는 2~3열 카드형
- 이모지는 크게, 설명은 짧게

### 모바일 가로

- 수족관 중심
- 메뉴는 축소 도킹
- 보조 정보는 오버레이/접이식

### 태블릿

- 수족관 확대
- 도감/팝업은 2단 구조 가능
- 메뉴는 정렬형 카드

### PC

- 전시형 대형 수족관
- 사이드 패널 분리 가능
- 교육 정보와 미션 상태 동시 표기 가능

## 13. 향후 확장 카테고리

### 생물

- 물고기
- 수서곤충
- 양서류
- 새
- 식물
- 꽃

### 자연

- 하천 지형
- 날씨
- 계절
- 하늘
- 별자리

### 탐험 기능

- 카메라
- GPS
- VR/시네마
- 음성 가이드
- 미션
- 결과 리포트

## 14. 코드 파일 분리 권장 구조

```txt
/ui
  /tokens
    colorTokens.js
    spacingTokens.js
    radiusTokens.js
    emojiRegistry.js
  /frames
    appShellFrame.js
    screenFrame.js
    sectionFrame.js
  /components
    chipButton.js
    cardButton.js
    popupHeader.js
    badgeFrame.js
    infoCard.js
    bookCard.js
  /screens
    screenMainExplore.js
    screenBook.js
    screenCamera.js
    screenGPS.js
    screenCinema.js
  /data
    fishData.js
    zoneData.js
    menuData.js
    popupData.js
    missionData.js
```

단, 현재 단일 HTML 구조에서는 위 파일 분리 전까지 다음 네임스페이스로 관리한다.

- `PONDANG_EMOJI_REGISTRY_V461`
- `PONDANG_MENU_DATA_V461`
- `PONDANG_ZONE_CHIP_DATA_V461`
- `PondangEmojiFrameSystemV461`

## 15. 실제 적용 순서

1. Emoji Registry 등록
2. 공통 프레임 클래스 CSS 등록
3. 현재 버튼에 emoji slot 자동 보강
4. 존/모드/메뉴 버튼 라벨 정리
5. 팝업/도감 헤더에만 이모지 적용
6. 수족관/물고기/배경 레이어에는 이모지 금지 유지
7. 모바일/가로/태블릿/PC 반응형 검수
8. QA 명령 추가

## 16. 다음 구현 목표

다음 구현 버전은 `v4.6.1_emoji_frame_system`으로 한다.

구현 범위:

- 기존 DOM을 갈아엎지 않는다.
- 버튼과 칩에만 비파괴적으로 이모지 슬롯을 보강한다.
- 기존 수족관/버들치/시네마/QA 기능을 건드리지 않는다.
- `PondangEmojiFrameSystemV461.audit()`로 검수한다.

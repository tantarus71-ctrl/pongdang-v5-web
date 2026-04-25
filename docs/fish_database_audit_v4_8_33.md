# 퐁당퐁당 v4.8.33 어종 데이터 추출·점검 문서

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
작업 브랜치: feature/v4.8.33-fish-database-audit
기준 앱 파일: app_assets/index.html
기준 패치 파일: patches/latest.generated.patch.js

## 1. 목적

v4.8.33의 목적은 현재 앱에 실제로 등록되어 있거나 패치에서 사용 중인 어종 데이터를 확인하고, 향후 `fish_database_option2` 단일 데이터 테이블 구조로 정리하기 위한 기준을 만드는 것이다.

이번 단계에서는 앱 본체를 수정하지 않는다.

## 2. 현재 검색 결과

### 2-1. 명확히 확인된 어종 키

현재 저장소 검색에서 명확히 잡히는 어종 키는 다음이다.

| 키 | 판단 | 위치 |
|---|---|---|
| beodeulchi | 버들치 계열로 판단 | patches/latest.generated.patch.js, app_assets/index.html 검색 결과 |

### 2-2. 검색 결과가 약하거나 직접 확인되지 않은 어종

다음 한글 어종명은 현재 저장소 검색에서 명확히 잡히지 않았다.

- 버들치
- 피라미
- 쉬리
- 각시붕어
- 서리비늘
- 포말꼬리
- 깊눈이

주의: 검색 결과가 없다는 것은 앱에 절대 없다는 뜻이 아니다. 단일 대형 HTML 내부에 다른 키명, 영문명, 압축된 구조, 또는 동적 생성 방식으로 들어 있을 수 있다.

## 3. 현재 확인 가능한 버들치 계열 데이터

`patches/latest.generated.patch.js`에는 버들치 계열로 판단되는 다음 구조가 존재한다.

### 3-1. 이미지 뷰셋

```js
FISH_VIEWSET_V450 = {
  beodeulchi: {
    left: "../assets/fish/beodeulchi/left.png",
    right: "../assets/fish/beodeulchi/right.png",
    frontLeft: "../assets/fish/beodeulchi/front_left.png",
    frontRight: "../assets/fish/beodeulchi/front_right.png"
  }
}
```

판정:

- 버들치 수조용 4방향 이미지 슬롯이 존재한다.
- left/right/frontLeft/frontRight 구조는 5방향 반입체 PNG 확장 기준과 호환 가능하다.
- 정측면 또는 center 방향 슬롯은 아직 명시 확인되지 않았다.

### 3-2. 행동 데이터

`BEODEULCHI_BEHAVIOR_V451` 구조가 존재한다.

포함 항목:

- xRange
- yRange
- hidePassYRange
- dartDistance
- hoverDistance
- pauseMs
- dartMs
- hoverMs
- turnMs
- turnChance
- hidePassChance
- hoverChance

판정:

- 버들치의 수조 내 움직임 기준이 이미 일부 존재한다.
- 3D 행동권 기준의 zDepthRange, scaleRange, turnRadius와 완전히 동일한 명칭은 아니지만, 확장 가능한 행동 데이터로 볼 수 있다.

### 3-3. 군영/개체 배치 데이터

`BEODEULCHI_SCHOOL_V454` 구조가 존재한다.

확인 가능한 개체 키:

- solo-surface
- solo-upper
- solo-mid
- solo-rock
- solo-front

판정:

- 현재 버들치는 단일 개체 1마리가 아니라 여러 위치/깊이 개체처럼 보이는 구조로 설계되어 있다.
- 각 개체는 x/y, entryX/entryY, view, direction, width, delay, xRange, yRange, depthRange, speedBias, rhythmBias, entrySpeed, floatBias 값을 가진다.
- 이 구조는 v4.8.34 버들치 기준 객체 설계에 적극 활용할 수 있다.

### 3-4. 오른쪽 진입 데이터

`BEODEULCHI_RIGHT_ENTRY_V463` 구조가 존재한다.

판정:

- 우측에서 들어오는 방향 전환/진입 데이터가 별도로 존재한다.
- 5방향 반입체 PNG 방식과 연결 가능하다.

## 4. 현재 데이터 구조 문제

현재 확인된 버들치 데이터는 패치 JS 안에 들어 있다.

문제:

1. 어종 데이터가 독립 데이터 테이블이 아니라 패치 함수 안에 묶여 있다.
2. 도감 카드용 이미지와 팝업 이미지 슬롯은 명확히 분리 확인되지 않았다.
3. 어린이 설명, 보호자/교사용 설명, 미션, 퀴즈, 희귀 여부가 같은 객체 안에 통합되어 있지 않다.
4. 향후 피라미/쉬리/각시붕어를 추가하면 구조가 중복될 가능성이 있다.

## 5. v4.8.33 판정

현재 저장소에서 추출 가능한 어종 데이터 기준은 다음이다.

| 항목 | 상태 |
|---|---|
| 버들치 수조 이미지 슬롯 | 확인됨 |
| 버들치 행동 데이터 | 확인됨 |
| 버들치 군영/깊이 데이터 | 확인됨 |
| 버들치 도감 카드 이미지 | 미확인 |
| 버들치 팝업 이미지 | 미확인 |
| 버들치 어린이 설명 | 미확인 |
| 피라미 데이터 | 미확인 |
| 쉬리 데이터 | 미확인 |
| 각시붕어 데이터 | 미확인 |
| 상상종 3종 데이터 | 미확인 |
| fish_database_option2 단일 테이블 | 미구현 또는 미확인 |

## 6. v4.8.34로 넘길 작업

다음 순번인 v4.8.34에서는 버들치 1종 기준 객체를 확정한다.

필수 작업:

1. 현재 `beodeulchi` 패치 데이터를 기준으로 버들치 객체 초안 작성
2. 도감 카드/팝업/수조 이미지 슬롯 분리
3. 행동 데이터 명칭을 fish_database_option2 구조에 맞게 정리
4. 어린이용 설명 작성
5. 보호자/교사용 설명 작성
6. 미션/퀴즈/희귀 여부 기본값 설정

## 7. 권장 데이터 객체 초안

```js
const fish_database_option2 = {
  beodeulchi: {
    id: "beodeulchi",
    name: "버들치",
    zone: "웃물",
    depthLayer: "얕은층-중간층",
    movementType: "소규모",
    speed: "보통-빠름",
    zDepthRange: [0.04, 0.42],
    scaleRange: [0.82, 1.18],
    turnRadius: "medium",
    rotationMode: "4방향 이미지 전환 + 부드러운 회전",
    aquariumImage: {
      left: "../assets/fish/beodeulchi/left.png",
      right: "../assets/fish/beodeulchi/right.png",
      frontLeft: "../assets/fish/beodeulchi/front_left.png",
      frontRight: "../assets/fish/beodeulchi/front_right.png"
    },
    cardImage: "../assets/fish/beodeulchi/card.png",
    popupImage: "../assets/fish/beodeulchi/popup.png",
    descriptionKid: "맑은 물에서 빠르게 움직이는 작은 민물 친구예요.",
    descriptionTeacher: "버들치는 맑은 하천 상류와 여울 주변에서 관찰되는 소형 어류로, 빠른 유영과 민첩한 방향 전환을 학습 요소로 삼을 수 있습니다.",
    mission: true,
    quiz: true,
    rarity: "일반"
  }
};
```

## 8. 금지 사항

- v4.8.33에서 앱 본체에 직접 어종 객체를 삽입하지 않는다.
- 피라미와 쉬리를 동시에 추가하지 않는다.
- 버들치 이미지 경로를 바꾸지 않는다.
- 패치 JS 내부 데이터를 무리하게 삭제하지 않는다.
- 먼저 문서 기준 객체를 확정한 뒤 실제 코드 적용은 다음 단계에서 진행한다.

## 9. 현재 완료 판정

v4.8.33은 `현재 저장소 내 어종 데이터 1차 추출 및 버들치 기준 데이터 확인` 단계로 완료 처리한다.

다음 순번:

v4.8.34 — 버들치 1종 기준 객체 확정

# 퐁당퐁당 v4.8.34 버들치 1종 기준 객체 확정 문서

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
작업 브랜치: feature/v4.8.34-beodeulchi-spec
기준 앱 파일: app_assets/index.html
기준 패치 파일: patches/latest.generated.patch.js
참조 문서: docs/fish_database_audit_v4_8_33.md, docs/fish_design_system_v4_8_31.md

## 1. 목적

v4.8.34의 목적은 버들치 1종을 퐁당퐁당의 기준 어종으로 확정하는 것이다.

이번 단계에서는 앱 본체를 수정하지 않는다. 실제 코드 적용은 다음 단계에서 진행한다.

## 2. 버들치 역할

버들치는 퐁당퐁당 곤지암천 프로젝트의 첫 기준 어종이다.

역할:

1. 실제 곤지암천 생태학습의 기준 어종
2. 3D처럼 보이는 유영 구조의 기준 어종
3. 카드/팝업/수조 이미지 분리 기준의 첫 적용 대상
4. 이후 피라미, 쉬리, 각시붕어 확장 시 비교 기준

## 3. 시각 디자인 기준

버들치 디자인은 다음으로 확정한다.

- 실제 버들치 특징을 최대한 살린다.
- 몸통은 자연스럽고 너무 두껍지 않게 한다.
- 가운데 검은 줄은 강하게 넣지 않고 60~80% 흐리게 표현한다.
- 전체 색감은 자연스러운 민물고기 톤으로 한다.
- 약간 노란빛은 허용한다.
- 꼬리지느러미에 약간 붉은 기운은 허용한다.
- 머리 방향과 꼬리 방향이 명확해야 한다.
- 배경은 100% 투명 PNG 기준이다.
- 그림자는 제거한다. 단, 수조 내 CSS 그림자는 최소 허용한다.
- 어린이 도감 카드에서는 친근한 카툰형 특징을 보강할 수 있다.

스타일 판정:

`실제 버들치 특징을 최대한 살린 반입체·친화형 기준 어종`

## 4. 이미지 슬롯 기준

### 4-1. 수조용 이미지

현재 확인된 수조용 슬롯:

```js
aquariumImage: {
  left: "../assets/fish/beodeulchi/left.png",
  right: "../assets/fish/beodeulchi/right.png",
  frontLeft: "../assets/fish/beodeulchi/front_left.png",
  frontRight: "../assets/fish/beodeulchi/front_right.png"
}
```

추가 권장 슬롯:

```js
center: "../assets/fish/beodeulchi/center.png"
```

단, center 슬롯은 실제 파일이 확인된 뒤 추가한다.

### 4-2. 카드용 이미지

권장 경로:

```js
cardImage: "../assets/fish/beodeulchi/card.png"
```

용도:

- 도감 카드
- 수집 화면
- 어린이용 한눈 인식

### 4-3. 팝업용 이미지

권장 경로:

```js
popupImage: "../assets/fish/beodeulchi/popup.png"
```

용도:

- 물고기 상세 팝업
- 이름/특징 설명과 함께 노출

## 5. 행동 데이터 기준

현재 패치에서 확인된 버들치 행동 데이터는 다음 계열이다.

- BEODEULCHI_BEHAVIOR_V451
- BEODEULCHI_SCHOOL_V454
- BEODEULCHI_RIGHT_ENTRY_V463

v4.8.34 기준 객체에서는 이를 다음과 같이 정리한다.

| 항목 | 기준값 |
|---|---|
| zone | 웃물 |
| depthLayer | 얕은층-중간층 |
| movementType | 소규모 |
| speed | 보통-빠름 |
| zDepthRange | [0.04, 0.42] |
| scaleRange | [0.82, 1.18] |
| turnRadius | medium |
| rotationMode | 4방향 이미지 전환 + 부드러운 회전 |
| rarity | 일반 |

## 6. 어린이용 설명

어린이용 설명:

`버들치는 맑은 물에서 빠르게 헤엄치는 작은 민물 친구예요. 물살이 있는 곳에서도 몸을 살짝 틀며 잘 움직여요.`

한 줄 카드 설명:

`맑은 물을 좋아하는 빠른 민물 친구`

## 7. 보호자/교사용 설명

보호자/교사용 설명:

`버들치는 맑은 하천 상류와 여울 주변에서 관찰되는 소형 어류로, 빠른 유영과 민첩한 방향 전환이 특징입니다. 퐁당퐁당에서는 하천의 수질, 물살, 수심층, 작은 어류의 움직임을 아이들이 직관적으로 이해하도록 돕는 기준 어종으로 사용합니다.`

## 8. 미션/퀴즈 기준

### 8-1. 미션

미션 사용 여부:

```js
mission: true
```

권장 미션:

- 웃물에서 버들치 찾기
- 빠르게 방향을 바꾸는 버들치 관찰하기
- 버들치가 가까이 왔을 때 도감 열기

### 8-2. 퀴즈

퀴즈 사용 여부:

```js
quiz: true
```

권장 퀴즈:

1. 버들치는 어떤 물을 좋아할까요?
   - 정답: 맑은 물
2. 버들치는 주로 어떻게 움직일까요?
   - 정답: 빠르게 방향을 바꾸며 움직임
3. 버들치의 몸 가운데 줄은 어떻게 보이나요?
   - 정답: 흐릿한 가로줄처럼 보임

## 9. fish_database_option2 기준 객체

```js
const fish_database_option2 = {
  beodeulchi: {
    id: "beodeulchi",
    name: "버들치",
    scientificName: "미확정",
    type: "actual",
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
    cardSummary: "맑은 물을 좋아하는 빠른 민물 친구",
    descriptionKid: "버들치는 맑은 물에서 빠르게 헤엄치는 작은 민물 친구예요. 물살이 있는 곳에서도 몸을 살짝 틀며 잘 움직여요.",
    descriptionTeacher: "버들치는 맑은 하천 상류와 여울 주변에서 관찰되는 소형 어류로, 빠른 유영과 민첩한 방향 전환이 특징입니다. 퐁당퐁당에서는 하천의 수질, 물살, 수심층, 작은 어류의 움직임을 아이들이 직관적으로 이해하도록 돕는 기준 어종으로 사용합니다.",
    mission: true,
    quiz: true,
    rarity: "일반",
    designNote: "실제 버들치 특징을 살린 반입체·친화형 기준 어종. 가운데 검은 줄은 60~80% 흐리게 표현한다."
  }
};
```

## 10. 실제 앱 적용 전 체크리스트

실제 코드 적용 전 다음을 확인한다.

- `../assets/fish/beodeulchi/left.png` 존재 여부
- `../assets/fish/beodeulchi/right.png` 존재 여부
- `../assets/fish/beodeulchi/front_left.png` 존재 여부
- `../assets/fish/beodeulchi/front_right.png` 존재 여부
- `../assets/fish/beodeulchi/card.png` 존재 여부
- `../assets/fish/beodeulchi/popup.png` 존재 여부
- 기존 패치의 BEODEULCHI 계열 함수와 충돌 여부
- 도감 카드 출력 위치
- 팝업 상세 모달 출력 위치
- 수조 fishLayer 출력 위치

## 11. 금지 사항

v4.8.34에서는 다음을 금지한다.

- app_assets/index.html 직접 수정
- latest.generated.patch.js 직접 수정
- 피라미 동시 추가
- 버들치 이미지 경로 변경
- 기존 BEODEULCHI 행동 데이터 삭제
- 도감/팝업/카메라 로직 동시 수정

## 12. 완료 판정

v4.8.34는 버들치 1종 기준 객체를 문서상 확정한 단계다.

다음 순번:

v4.8.35 — 버들치 앱 1차 적용 준비 및 자산 존재 여부 점검

# 퐁당퐁당 v4.8.39 최적화 실행본 생성 기록

작성 기준: 2026-04-26
저장소: tantarus71-ctrl/pongdang-v5-web
신규 실행본: app_assets/index_v4_8_39.html
참조 원본: app_assets/index.html
참조 패치:

- app_assets/patches/v4_8_37_responsive_aquarium_ui.css
- app_assets/patches/v4_8_38_apply_responsive_ui.js

## 1. 목적

v4.8.39의 목적은 원본 app_assets/index.html을 직접 수정하지 않고도, 수족관 사이즈 최적화와 아이들 눈높이 메뉴 UI를 실제로 확인할 수 있는 안전 실행본을 만드는 것이다.

## 2. 이번 작업 완료 내역

신규 파일을 생성했다.

```txt
app_assets/index_v4_8_39.html
```

이 파일은 원본 index.html을 iframe으로 불러온 뒤, 같은 도메인 내부에서 다음 두 패치를 주입한다.

```html
<link rel="stylesheet" href="patches/v4_8_37_responsive_aquarium_ui.css">
<script src="patches/v4_8_38_apply_responsive_ui.js" defer></script>
```

## 3. 원본 보존 방식

원본 파일은 수정하지 않았다.

```txt
app_assets/index.html
```

이 방식의 장점:

- 기존 기능 손상 위험 최소화
- 원본 즉시 복구 가능
- 최적화 UI를 별도 주소로 테스트 가능
- 실제 반영 전 핸드폰/PC/태블릿 검증 가능

## 4. 적용되는 UI 기준

### 수족관

- 상단 제목 카드 압축
- 구간/낮밤 버튼 칩형 정리
- 수족관 카드형 영역 확대
- fishLayer 위치 재계산
- 하단 메뉴와 수족관 겹침 방지

### 하단 메뉴

| 메뉴 | 이모지 | 보조문구 |
|---|---|---|
| 탐험 | 🫧 | 물속보기 |
| 도감 | 🐟 | 친구보기 |
| 반짝 | ✨ | 희귀찾기 |
| 카메라 | 📷 | 비춰보기 |

### 반응형

- 작은 휴대폰: 보조문구 축소/숨김
- 일반 휴대폰: 수족관 중심 배치
- 태블릿: 시네마형 수족관
- PC: 중앙 전시형 수족관

## 5. 테스트 방법

GitHub Pages 또는 Netlify 배포 기준으로 다음 경로를 연다.

```txt
/app_assets/index_v4_8_39.html
```

기존 원본은 다음 경로다.

```txt
/app_assets/index.html
```

두 파일을 비교해 확인한다.

## 6. 확인 체크리스트

- index_v4_8_39.html이 열리는가
- 원본 index.html이 iframe 안에서 보이는가
- 로딩 화면이 사라지는가
- 하단 메뉴가 이모지형으로 바뀌는가
- 수족관 영역이 기존보다 커지는가
- 핸드폰 세로형에서 메뉴가 4개 한 줄로 유지되는가
- 작은 휴대폰에서 텍스트가 겹치지 않는가
- 태블릿/PC에서 수족관이 중앙 정렬되는가
- 도감/반짝/카메라 버튼 이벤트가 유지되는가
- 팝업/시트가 열렸을 때 메뉴 클릭 충돌이 없는가

## 7. 현재 한계

iframe 기반 안전 실행본이므로, 최종 배포본으로 확정하기 전에는 index.html 본체에 동일 패치를 직접 연결하는 단계가 필요하다.

다만 이번 방식은 원본 손상 없이 시각/레이아웃 검증을 먼저 할 수 있는 안전한 중간 안정본이다.

## 8. 다음 단계

v4.8.40 권장 작업:

1. index_v4_8_39.html 실제 접속 확인
2. 핸드폰/태블릿/PC 화면 캡처 비교
3. 메뉴 이모지/수족관 크기 시각 검수
4. 문제가 없으면 index.html 본체에 동일 CSS/JS 링크 직접 삽입
5. 최종 안정본 태그 문서 작성

## 9. 완료 판정

v4.8.39는 `원본 보존형 최적화 실행본 생성 완료` 상태로 처리한다.

# 새 챗버전 통합 계획

이 문서는 원격 브랜치에 흩어진 `v4.8.31`부터 `v4.8.35`까지의 챗 작업 내용을 현재 기준 `v4.8.30` 저장소에 안전하게 반영하기 위한 통합 계획입니다.

## 현재 기준

- 현재 실행 기준: `v4.8.30 Phone Zone Label Fit`
- 기준 앱: `app_assets/index.html`
- 기준 패치: `patches/latest.generated.patch.js`
- 배포 브랜치: `gh-pages`
- 로컬 실행: `run-local-v4830.cmd`
- 검증: `tools/validate-release.ps1`

## 반영된 새 챗버전 자료

- `v4.8.31`: 안전 점검, 물고기 디자인 시스템, 전체 개발 계획
- `v4.8.32`: 모바일 메뉴 맞춤, 중복 패치 점검, 후보 CSS
- `v4.8.33`: 물고기 데이터베이스 1차 추출
- `v4.8.34`: 버들치 1종 명세 초안
- `v4.8.35`: 버들치 에셋 존재 여부 점검

원격 브랜치의 원문 문서는 보존하되, 인코딩이 깨져 보이는 부분은 이 문서와 `data/fish_catalog_option2.json`에서 다시 정리합니다.

## 안정화 원칙

1. 현재 작동하는 `v4.8.30` 화면을 깨지 않는다.
2. 후보 CSS는 `patches/v4_8_32_mobile_menu_fit_candidate.css`에 보존하고, 실제 반영은 중복 여부를 확인한 뒤 한 곳에만 적용한다.
3. 버들치 본체 적용은 PNG 4방향 이미지와 SVG fallback이 준비된 상태까지만 인정한다.
4. 카드/팝업 PNG는 아직 필수 런타임 조건으로 보지 않고, `v4.8.36`의 제작 또는 대체 결정 항목으로 둔다.
5. 물고기 데이터는 먼저 `data/fish_catalog_option2.json`에 정리하고, 런타임 이전은 다음 단계에서 한다.

## 확장 로드맵

### v4.8.31 안정화 체크

- 실행 화면에서 상단 안내, 구역 버튼, 하단 메뉴가 서로 겹치지 않는지 확인한다.
- 카메라, 도감, 희귀 물고기, 물고기 팝업의 레이어 충돌을 확인한다.
- `tools/validate-release.ps1`를 통과시킨다.

### v4.8.32 모바일 메뉴 최적화

- 360, 375, 390, 412, 430px 폭에서 확인한다.
- `patches/v4_8_32_mobile_menu_fit_candidate.css`를 기준으로 기존 `installMobileMenuFitStyles()`와 중복되는 규칙을 비교한다.
- 실제 반영은 `latest.generated.patch.js`의 한 함수 안으로 통합한다.

### v4.8.33 데이터베이스 정리

- 런타임에 흩어진 버들치 이미지/행동/군영 데이터를 `data/fish_catalog_option2.json` 기준으로 맞춘다.
- 다른 어종은 버들치 구조가 안정된 뒤 추가한다.

### v4.8.34 버들치 명세 확정

- 버들치 설명, 교사용 설명, 미션, 퀴즈, 희귀도, 서식 구역을 확정한다.
- 4방향 PNG와 SVG fallback을 함께 유지한다.

### v4.8.35 에셋 점검

- 현재 존재: `left.png`, `right.png`, `front_left.png`, `front_right.png`, `swim.svg`, `card.svg`
- 아직 없음: `card.png`, `popup.png`
- 카드/팝업 PNG가 없을 때는 SVG 또는 기존 방향 이미지를 임시 fallback으로 사용한다.

### v4.8.36 적용 후보

- 카드/팝업 PNG를 새로 만들지, SVG fallback을 공식화할지 결정한다.
- 결정 후 버들치 데이터 객체를 런타임 패치로 옮긴다.

## 완료 기준

- `manifest.json`, `project-manifest.json`, `package_manifest.json`의 버전이 일치한다.
- `README.md`와 `docs/CODEX_CHATGPT_SYNC.md`가 최신 작업 방식을 설명한다.
- `tools/validate-release.ps1`가 통과한다.
- `main`과 `gh-pages`가 같은 커밋을 가리킨다.
- Pages에서 현재 버전 문자열이 확인된다.

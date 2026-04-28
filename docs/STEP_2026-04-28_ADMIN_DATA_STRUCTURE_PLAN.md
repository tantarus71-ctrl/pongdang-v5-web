# STEP 2026-04-28 관리자 데이터 구조 사전 설계

## 1. 목적

이 문서는 `퐁당퐁당 곤지암천 v5 / v30A-1 audio stability final` 기준본에서 관리자 페이지를 만들기 전에 반드시 고정해야 할 데이터 구조 기준을 정리한다.

이번 단계의 목적은 관리자 페이지 UI를 만드는 것이 아니라, 현재 `src/app.js` 내부에 들어 있는 데이터 블록을 구분하고, 나중에 관리자가 수정해도 되는 데이터와 직접 수정하면 안 되는 런타임 로직을 분리하는 것이다.

이번 단계에서는 실제 런타임 연결을 변경하지 않는다. 기존 실행 화면, 물고기 유영, 음성, 도감, 미션, 카메라, GPS 구조는 그대로 유지한다.

---

## 2. 현재 기준본

- 저장소: `tantarus71-ctrl/pongdang-v5-web`
- 브랜치: `main`
- 기준 실행 폴더: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/`
- 기준 HTML: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html`
- 기준 JS: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/app.js`
- 기준 CSS: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/main.css`
- 기준 버전: `v30A-1 audio stability final`

---

## 3. app.js 내부 주요 데이터 블록

현재 `src/app.js`에서 관리자 구조와 관련된 주요 데이터 블록은 다음과 같다.

| 데이터 블록 | 역할 | 관리자 수정 가능성 | 위험도 | 외부 JSON 분리 후보 |
|---|---|---:|---:|---:|
| `ASSETS` | 버들치 수조 이미지 경로 | 제한 가능 | 중간 | 가능 |
| `ZONES` | 곤지암천 5존 배경, 설명, 유속, 입자, 물고기 수 | 제한 가능 | 높음 | 가능 |
| `SPECIES` | 기본 어종명, 수심층, 설명 | 가능 | 낮음 | 가능 |
| `BUBBLE_PROFILES` | 존별 물방울 연출값 | 제한 가능 | 중간 | 가능 |
| `FEATURE_MENUS` | 하단 메뉴 안내 문구 | 가능 | 낮음 | 가능 |
| `CARD_DATABASE` | 카드 획득 문구 | 가능 | 낮음 | 가능 |
| `DEX_CARDS` | 도감 카드 목록과 설명 | 가능 | 중간 | 가능 |
| `ZONE_STORY_DATABASE` | 존별 생태 스토리/관찰 포인트 | 가능 | 낮음 | 가능 |
| `SPECIES_ZONE_STORY` | 어종별·존별 관찰 문구 | 가능 | 낮음 | 가능 |
| `UI_ICON_CONFIG` | 메뉴 이모지/아이콘 슬롯 | 제한 가능 | 낮음 | 가능 |
| `AUDIO_SCRIPT_DATABASE` | 음성 설명 스크립트 | 가능 | 중간 | 가능 |
| mission 관련 데이터 | 미션 제목, 조건, 진행 문구 | 가능 | 중간 | 가능 |
| camera/capture 문구 | 관찰 사진 안내 문구 | 가능 | 낮음 | 가능 |
| explore/gps 문구 | 위치 안내, 탐사 안내 | 가능 | 중간 | 가능 |

---

## 4. 관리자 수정 가능 데이터

관리자 페이지에서 나중에 직접 수정할 수 있는 A등급 데이터는 다음과 같다.

- 어종 이름
- 어종 설명
- 어종 서식지
- 어종 관찰 포인트
- 도감 카드 문구
- 존 설명 문구
- 존별 생태 스토리
- 미션 제목
- 미션 설명
- UI 안내 문구
- 음성 스크립트 텍스트
- 카드 획득 문구

이 데이터는 앱의 핵심 실행 로직을 직접 건드리지 않기 때문에 관리자 페이지에서 수정 대상으로 적합하다.

---

## 5. 제한적으로 수정 가능한 데이터

관리자 페이지에서 수정은 가능하지만 반드시 검증이 필요한 B등급 데이터는 다음과 같다.

- 어종 이미지 경로
- 카드 이미지 경로
- 배경 이미지 경로
- 존별 물고기 출현 수량
- 존별 물방울 개수
- 존별 색상 tone
- 희귀도
- 수집 여부 기본값
- 오디오 파일 경로

이 항목은 잘못 입력하면 이미지 404, 배경 미표시, 오디오 오류, 도감 카드 깨짐 등이 발생할 수 있으므로 관리자 페이지에서 입력 검증과 fallback을 반드시 둔다.

---

## 6. 관리자 직접 수정 금지 데이터

아래 C등급 데이터와 로직은 관리자 페이지에서 직접 수정하지 않는다.

- 물고기 유영 엔진 함수
- z-depth 계산
- fish-root transform 계산
- audio playback state
- `AUDIO_STATE`
- `UI_STATE`
- 팝업 open/close 상태 관리
- localStorage key
- event listener 연결부
- full screen API
- GPS 권한 처리
- camera capture 처리
- overlay history 처리
- DOM 생성/삭제 함수
- 상태 동기화 함수

이 영역은 관리자 페이지가 아니라 개발자가 코드 검증 후 수정해야 한다.

---

## 7. 권장 JSON 분리 구조

향후 실제 분리 시 권장 구조는 다음과 같다.

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/zones.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/species.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/dex_cards.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/missions.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/audio_scripts.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/ui_texts.json
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/data/assets_manifest.json
```

이번 단계에서는 위 파일을 런타임에 연결하지 않고 `_draft` 폴더에 샘플 JSON만 둔다.

---

## 8. fallback 원칙

향후 JSON loader를 만들 때 반드시 아래 원칙을 따른다.

1. JSON 로드 실패 시 `app.js` 내부 기본 데이터를 사용한다.
2. JSON parse 실패 시 화면을 중단하지 않는다.
3. 이미지 경로가 없거나 잘못되면 기본 이미지로 대체한다.
4. 오디오 경로가 없으면 TTS fallback을 사용한다.
5. 존 데이터가 일부 누락되면 해당 존만 기본값으로 복구한다.
6. 관리자 데이터는 localStorage에 바로 덮어쓰기 전에 검증한다.
7. 사용자가 수정한 데이터와 기본 데이터를 분리 저장한다.

---

## 9. 다음 단계 권장 순서

관리자 페이지로 바로 가지 말고 다음 순서를 따른다.

1. 관리자 데이터 구조 사전 설계 완료
2. data loader + fallback 구조 구현
3. 관리자 페이지 1차 UI 설계
4. 관리자에서 JSON 수정/저장 구조 구현
5. 앱 화면 반영
6. 실기기 QA

---

## 10. 이번 단계 완료 기준

- 이 문서 생성 완료
- `_draft` 샘플 JSON 7개 생성 완료
- 기존 런타임 app.js 변경 없음
- 기존 화면 작동 구조 변경 없음
- 다음 단계가 data loader + fallback 구현으로 명확히 이어짐

# STEP 2026-04-28 읽기 전용 관리자 preview UI 구현

## 1. 목적

이번 단계의 목적은 `퐁당퐁당 곤지암천 v5 / v30A-1 audio stability final` 기준본에 저장/수정/삭제 기능이 없는 읽기 전용 관리자 preview UI를 별도 페이지로 구현하는 것이다.

관리자 preview UI는 기존 어린이용 수족관 화면 안에 삽입하지 않고, 독립 HTML로 분리한다. 기존 `app.js`, `data-loader.js`, `main.css`, `data/*.json`은 수정하지 않는다.

---

## 2. 생성 파일

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/admin-preview.html
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/admin-preview.js
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/admin-preview.css
```

---

## 3. 관리자 preview 접속 경로

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/admin-preview.html
```

루트 index에는 연결하지 않았다. 외부 사용자용 시연 경로에도 노출하지 않았다.

---

## 4. 구현한 메뉴

- 대시보드
- 존 데이터
- 어종 데이터
- 도감 카드
- 미션
- 음성 스크립트
- UI 문구
- 자산 경로
- 진단 로그

---

## 5. 읽기 전용 원칙

이번 구현에는 아래 기능을 넣지 않았다.

- 저장 버튼 없음
- 수정 input 없음
- 삭제 버튼 없음
- 로그인 없음
- 권한 처리 없음
- 서버/DB 연결 없음

상단 안내 문구로 다음 원칙을 표시한다.

```text
이 화면은 읽기 전용 관리자 preview입니다.
현재 앱 화면은 app.js 내부 기본 데이터를 우선 사용합니다.
외부 JSON은 관리자 기능 준비용으로 로드됩니다.
저장/수정/삭제 기능은 아직 비활성화되어 있습니다.
```

---

## 6. 데이터 로드 방식

`src/admin-preview.js`에서 아래 7개 JSON을 직접 fetch한다.

```text
./data/zones.json
./data/species.json
./data/dex_cards.json
./data/missions.json
./data/audio_scripts.json
./data/ui_texts.json
./data/assets_manifest.json
```

하나의 JSON 로드가 실패해도 전체 화면은 중단하지 않는다. 실패한 항목은 `fallback` 상태칩으로 표시한다.

---

## 7. 상태칩 기준

| 상태 | 의미 |
|---|---|
| 정상 | JSON 로드 성공 + 필수 필드 있음 |
| 확인 필요 | 로드는 됐지만 일부 필드 확인 필요 |
| fallback | JSON 로드 실패 또는 구조 불일치 |
| 위험 | 경로 충돌, 이미지/오디오 경로 위험 |
| 정보 | 읽기 전용 또는 안내 상태 |
| 로딩 | 데이터를 불러오는 중 |

---

## 8. 자산/음성 경고

관리자 preview는 아래 위험을 경고로 표시한다.

- `assets_manifest.json`의 background path와 fallbackPath 확장자가 다른 경우
- fish path가 비어 있는 경우
- audioPath가 문자열로 설정되어 있는데 실제 mp3 존재 검증이 필요한 경우
- fallbackTts가 boolean이 아닌 경우
- 존 배경 확장자가 jpg/png가 아닌 경우

---

## 9. 디자인 기준

- PC에서는 좌측 사이드바 + 우측 콘텐츠 구조
- 모바일에서는 상단 가로 스크롤 탭 구조
- 어두운 수중 관리자 화면 톤
- 카드형 대시보드
- 테이블 가로 스크롤
- 진단 로그 details/pre 구조
- 기존 `main.css`와 분리된 `admin-preview.css` 사용

---

## 10. 건드리지 않은 파일/기능

- `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/index.html`
- `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/app.js`
- `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/data-loader.js`
- `app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/styles/main.css`
- 기존 `data/*.json` 내용
- 물고기 유영
- 음성
- 도감
- 미션
- 카메라
- GPS

주의: 이번 단계에서 새로 생성한 `admin-preview.html`만 관리자 화면 진입점이다.

---

## 11. 검증 기록

커넥터를 통해 파일 생성은 완료했다.

로컬 런타임에서 다음 검증이 필요하다.

```powershell
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\admin-preview.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\data-loader.js
node --check app_assets\pongdang_gonjiam_v30A1_audio_stability_final\src\app.js
```

브라우저 직접 확인:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/admin-preview.html
```

확인 항목:

- 대시보드 표시
- 탭 전환 정상
- JSON 7개 로드 상태 표시
- 상태칩 표시
- 진단 로그 표시
- 저장/수정/삭제 기능 없음
- 기존 수족관 앱 영향 없음

---

## 12. 남은 리스크

- 관리자 편집/저장 기능은 아직 없다.
- JSON 데이터가 실제 앱 화면에 반영되는 단계는 아직 아니다.
- 실기기 모바일 QA가 필요하다.
- GitHub Pages 배포 후 상대경로 fetch를 확인해야 한다.
- 배경 경로 jpg/png 충돌은 별도 안정화 대상이다.

---

## 13. 다음 단계 제안

관리자 preview 확인 후 바로 편집 기능으로 가지 않는다.

다음 단계는 다음 중 하나가 안전하다.

1. 관리자 preview 실기기 QA
2. 필드 검증 강화
3. 자산 경로 검사 강화
4. 배경 jpg/png 기준 통일

권장 다음 단계:

```text
필드 검증 강화 + 자산 경로 검사 강화
```

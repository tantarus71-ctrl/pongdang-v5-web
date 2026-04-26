# Codex 다음 실행 지시서: 물고기 디자인 채팅 최종 반영 판단 v1

## 0. 결론

물고기 디자인 채팅의 내용을 즉시 전체 반영하지 않는다. 현재 v4.6.2e 안정본을 기준으로, 디자인 채팅에서 확정된 방향을 `어종별 자산 규칙`과 `단계별 적용 순서`로 먼저 정리한 뒤 1종씩 반영한다.

최선의 다음 실행은 다음 순서다.

1. 현재 v4.6.2e 버들치 자산 연결 안정본 유지
2. `data/gonjiam_ecosystem_assets_v1.json` 로더 추가
3. 피라미 1종만 다음 테스트 어종으로 추가
4. 물고기 디자인 채팅의 최종 방향은 `fish_design_style_guide_v1.md`로 문서화
5. 자산 경로는 `assets/fish/{id}/swim.svg`, `card.svg`, 이후 `swim.png`, `card.png` 순서로 확장
6. 전체 어종 일괄 반영 금지

## 1. 현재 기준

- 실행 진입점: `index.html` → `app_assets/v462e_beodeulchi_asset_ready.html`
- 실제 연결 자산: `assets/fish/beodeulchi/swim.svg`, `assets/fish/beodeulchi/card.svg`
- 생태 데이터: `data/gonjiam_ecosystem_assets_v1.json`
- 전체 기획서: `docs/gonjiam_ecosystem_asset_plan_v1.md`
- Codex 작업 지시: `docs/codex_tasks_gonjiam_ecosystem_asset_v1.md`

## 2. 물고기 디자인 채팅 최종 반영 판단

### 바로 반영할 것

- 아이들이 좋아할 카툰형+반실사 중간 톤
- 종별 실루엣 차이
- 2.5D 수족관 깊이감
- 앞쪽 물고기 클릭 가능 / 뒤쪽 물고기 클릭 불가
- 도감 카드용 이미지와 수족관 유영용 이미지 분리
- SVG fallback 유지
- PNG가 준비되면 PNG 우선 사용
- 모바일 세로 화면 기준 크기 최적화

### 아직 보류할 것

- 모든 어종 5방향 PNG 일괄 적용
- 전체 GLB/진짜 3D 모델 적용
- 원본 `app_assets/index.html` 통째 교체
- 전체 어종 한 번에 수족관 렌더링
- 외래종을 일반 수집 보상처럼 노출
- 환상어종을 실제종처럼 표시

## 3. 다음 적용 어종

다음은 피라미 1종만 적용한다.

이유:
- 버들치와 체형이 달라 디자인 기준 검증에 좋음
- 여울·잔여울 대표 어종으로 수족관 움직임 차별화 가능
- 빠른 무리 유영, 방향 전환 테스트에 적합

## 4. 피라미 적용 규격

```text
assets/fish/pirami/
  swim.svg
  card.svg
  meta.json
```

### meta.json 초안

```json
{
  "id": "pirami",
  "name": "피라미",
  "scientificName": "Zacco platypus",
  "zone": ["riffle", "slow_riffle"],
  "layer": "중층",
  "behavior": "빠른 무리 유영, 방향전환 잦음",
  "assetType": "slim",
  "status": "asset_connected",
  "kidsCopy": "반짝이며 빠르게 움직이는 여울 친구예요.",
  "display": {
    "size": 88,
    "depth": 0.66,
    "speed": "fast",
    "group": true
  }
}
```

## 5. 디자인 스타일 가이드 반영 방식

Codex는 새 문서 `docs/fish_design_style_guide_v1.md`를 만들고 아래 내용을 넣는다.

- 전체 톤: 어린이 친화형 반실사 카툰
- 배경 투명 전제
- 수족관용과 카드용 이미지 분리
- 종별 실루엣 차별화
- 지나친 귀여움보다 생태 특징 우선
- 눈은 작고 또렷하게
- 비늘/측선/지느러미는 단순화하되 종 구분 가능하게
- 물속에서는 너무 진한 테두리 금지
- 카드에서는 더 선명하고 크게
- PNG 없으면 SVG fallback

## 6. Codex 1차 실행 명령

1. `docs/fish_design_style_guide_v1.md` 생성
2. `assets/fish/pirami/swim.svg` 생성
3. `assets/fish/pirami/card.svg` 생성
4. `assets/fish/pirami/meta.json` 생성
5. `app_assets/v462e_beodeulchi_asset_ready.html`를 직접 덮어쓰지 말고 복사본 생성
   - 새 파일명: `app_assets/v462f_pirami_asset_added.html`
6. 루트 `index.html`은 새 파일 검수 후에만 연결
7. 검수 함수명:
   - `PondangV5PiramiAssetAddedV462f.audit()`

## 7. 검수 조건

- 버들치 기존 자산 정상 유지
- 피라미 swim/card 자산 정상 로딩
- 피라미 실패 시 SVG fallback 정상
- 수족관 물고기 수 5종 이하 유지
- 모바일 하단 메뉴 겹침 없음
- 도감 카드 표시 정상
- 보고서 표시 정상
- 외래종/환상어종은 아직 수족관 미노출

## 8. 최종 판정

물고기 디자인 채팅의 최종 방향은 반영하되, 전체 일괄 반영은 하지 않는다. 현재 최선은 `버들치 안정본 유지 → 피라미 1종 추가 → 검수 → 다음 어종`이다.

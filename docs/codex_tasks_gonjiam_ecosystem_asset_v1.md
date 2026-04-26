# Codex 적용 지시서: 곤지암천 생태계 자산화 v1

## 목표
현재 v4.6.2e 버들치 자산 연결 안정화본을 유지하면서, 곤지암천형 실제 어종·외래종·환상어종 데이터를 단계적으로 앱에 적용한다.

## 절대 금지
- `app_assets/index.html` 원본 대형 파일을 통째로 재작성하지 말 것.
- 전체 어종을 한 번에 수족관에 띄우지 말 것.
- 외래종을 일반 수집 보상과 동일하게 처리하지 말 것.
- fantasy 어종에서 `fantasy:true` 또는 안내 문구를 빼지 말 것.

## 1차 작업
1. `data/gonjiam_ecosystem_assets_v1.json`를 로드한다.
2. 기존 버들치 자산 경로를 유지한다.
3. 피라미 1종만 `assets/fish/pirami/` 경로로 추가한다.
4. 대표 수족관 렌더링은 최대 5종으로 제한한다.
5. 도감 데이터는 전체 목록을 읽되 lazy open 방식으로 표시한다.

## 필수 함수
```js
loadEcosystemAssetManifest()
getSpeciesByZone(zoneId)
getDisplayFishForAquarium(zoneId, limit = 5)
renderSpeciesCard(speciesId)
renderFishAsset(speciesId, view = 'swim')
validateSpeciesAsset(speciesId)
```

## 필수 검수
```js
PondangV5EcosystemAssetV1.audit()
PondangV5EcosystemAssetV1.validateAssets()
PondangV5EcosystemAssetV1.validateDisclaimers()
```

## 합격 조건
- 버들치 기존 기능 유지
- 피라미 추가 후 화면 깨짐 없음
- 모바일 하단 메뉴 겹침 없음
- 이미지 실패 시 SVG fallback 정상
- 외래종/환상어종 카드에 안내 문구 표시

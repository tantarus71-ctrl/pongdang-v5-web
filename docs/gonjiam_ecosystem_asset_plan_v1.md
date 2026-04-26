# 곤지암천 물밑 생태계·어종 자산화 기획서 v1

## 0. 적용 원칙

이 문서는 퐁당퐁당 V5 프로젝트에 실제 적용하기 위한 Codex 공유용 기획서다. 현장 채집·지자체 공식 조사 전에는 모든 실제 어종을 '곤지암천 확정 출현종'이 아니라 '곤지암천형 적용 후보'로 표기한다.

현재 프로젝트 기준:
- 복구 기준본: `pongdang3_species_size_applied.html`
- 현재 GitHub 실행 흐름: `index.html` → `app_assets/v462e_beodeulchi_asset_ready.html`
- 현재 실제 자산 연결 완료: `assets/fish/beodeulchi/swim.svg`, `assets/fish/beodeulchi/card.svg`
- 다음 적용: 피라미 1종만 추가

## 1. 5개 존 생태 구조

| 존 | 환경 | 물 상태 | 적용 후보 | UI 역할 |
|---|---|---|---|---|
| 웃물 | 상류·찬물·큰 돌 | 맑음, 빠른 흐름 | 버들치, 둑중개, 대륙종개 | 첫 화면 대표 구간 |
| 여울 | 빠른 흐름·자갈 | 맑음~보통 | 피라미, 쉬리, 돌고기, 돌마자 | 유속·산소·반짝임 |
| 잔여울 | 완만한 흐름·모래/수초 | 보통 | 각시붕어, 참마자, 모래무지, 납자루류 | 카드 수집 구간 |
| 깊물 | 소·그늘·돌밑 | 보통~약간 흐림 | 동자개, 가물치, 누치, 대농갱이 | 밤물/느린 관찰 |
| 물모이 | 합수부·가장자리·수초 | 보통~흐림 | 붕어, 미꾸리, 참붕어, 송사리, 외래종 경고 | 확장 생태 |

## 2. 실제 어종 후보 데이터

| ID | 국명 | 학명 | 존 | 수심층 | 행동 | 자산형 |
|---|---|---|---|---|---|---|
| `beodeulchi` | 버들치 | Rhynchocypris oxycephalus | 웃물/여울 | 중층·바위 주변 | 짧은 S자 유영, 앞쪽 접근 | round |
| `pirami` | 피라미 | Zacco platypus | 여울/잔여울 | 중층 | 빠른 무리 유영, 방향전환 잦음 | slim |
| `swiri` | 쉬리 | Coreoleuciscus splendidus | 여울 | 중하층·자갈 | 자갈 위 빠른 직선+회전 | sleek |
| `gaksi` | 각시붕어 | Rhodeus uyekii | 잔여울/수초 | 중하층·수초 | 느리고 예쁜 정지/회전 | bitterling |
| `bungeo` | 붕어 | Carassius auratus | 깊물/물모이 | 중하층 | 느린 순환 유영 | deep_body |
| `napjaru` | 납자루 | Acheilognathus lanceolatus | 잔여울/수초 | 중하층 | 수초 근처 짧은 유영 | bitterling |
| `julnapjaru` | 줄납자루 | Acheilognathus yamatsutae | 잔여울/수초 | 중하층 | 수초 주변 유영 | bitterling |
| `napjiri` | 납지리 | Acheilognathus rhombeus | 물모이/잔여울 | 중하층 | 느린 유영 | bitterling |
| `dolgogi` | 돌고기 | Pungtungia herzi | 여울/잔여울 | 중층·돌 주변 | 짧은 군영 | slim_carp |
| `nuchi` | 누치 | Hemibarbus labeo | 깊물/물모이 | 하층 | 느린 저층 이동 | slim_carp |
| `chammaja` | 참마자 | Hemibarbus longirostris | 여울/잔여울 | 하층·모래/자갈 | 바닥 탐색 | bottom_carp |
| `moraemuji` | 모래무지 | Pseudogobio esocinus | 잔여울/물모이 | 하층·모래 | 바닥 가까이 느린 이동 | bottom_carp |
| `dolmaja` | 돌마자 | Microphysogobio yaluensis | 여울 | 하층·자갈 | 자갈 사이 짧은 이동 | bottom_carp |
| `daeryukjonggae` | 대륙종개 | Orthrias nudus | 여울/돌밑 | 하층 | 돌밑 은신 | loach |
| `saekomikkuri` | 새코미꾸리 | Koreocobitis rotundicaudata | 잔여울/하천 가장자리 | 하층 | 바닥 파고들기 | loach |
| `mikkuri` | 미꾸리 | Misgurnus anguillicaudatus | 물모이/가장자리 | 하층·펄 | 느린 바닥 이동 | eel |
| `chamjonggae` | 참종개 | Cobitis koreensis | 잔여울/여울 | 하층·모래/자갈 | 바닥 은신 | loach |
| `dongjagae` | 동자개 | Pseudobagrus fulvidraco | 깊물/돌밑 | 하층 | 야간성 느린 이동 | catfish |
| `daenonggaengi` | 대농갱이 | Leiocassis ussuriensis | 깊물/물모이 | 하층 | 느린 바닥 유영 | catfish |
| `dukjunggae` | 둑중개 | Cottus koreanus | 웃물/여울 | 하층·돌밑 | 짧은 튀기, 정지 | sculpin |
| `dongsari` | 동사리 | Odontobutis platycephala | 돌밑/물모이 | 하층 | 매복형 정지 | goby |
| `eollokdongsari` | 얼록동사리 | Odontobutis interrupta | 돌밑/잔여울 | 하층 | 매복형 | goby |
| `mileo` | 밀어 | Rhinogobius brunneus | 하천 가장자리/돌밑 | 하층 | 바닥 붙기 | goby |
| `songsa` | 송사리 | Oryzias latipes | 하천 가장자리 | 표층·얕은 곳 | 느린 표층 유영 | small |
| `chambungeo` | 참붕어 | Pseudorasbora parva | 수초/물모이 | 중하층 | 수초 은신 | small |
| `gamulchi` | 가물치 | Channa argus | 수초/정체수역 | 중하층 | 느린 매복 | predator |
| `miyugi` | 미유기 | Silurus microdorsalis | 돌밑/깊물 | 하층 | 밤물 느린 이동 | catfish |
| `baegasari` | 배가사리 | Microphysogobio longidorsalis | 자갈/돌밑 | 하층 | 은신·짧은 이동 | bottom |

## 3. 외래종·위해종 교육 카드

외래종은 수집 보상 중심이 아니라 생태계 균형 경고·퀴즈·비교 학습으로 노출한다.

| ID | 이름 | 유형 | 적용 위치 | 교육 메시지 |
|---|---|---|---|---|
| `bass` | 배스 | 외래 포식어종 | 깊물/물모이 | 토착어종·새우류 포식 위험 |
| `bluegill` | 블루길 | 외래어종 | 수초/물모이 | 번식력·서식지 경쟁 우려 |
| `bullfrog_tadpole` | 황소개구리 올챙이 | 외래 양서류 | 수초/정체수역 | 고유 양서류·하천생물과 경쟁/포식 교육 |

## 4. 상상·환상어종

환상어종은 `fantasy:true`를 반드시 넣고, 카드에 '가상 어종입니다' 문구를 고정한다.

| ID | 이름 | 출몰 조건 | 시각 콘셉트 | 교육 연결 |
|---|---|---|---|---|
| `eunha_swiri` | 은하쉬리 | 밤/맑음 | 별자리·야간 관찰 | 현실 고유종 쉬리와 비교 |
| `ikki_dragon` | 이끼드래곤피시 | 낮/맑음 | 수초 위장 | 수초 훼손 금지 |
| `amban_phantom` | 밤/맑음 | 암반팬텀 | 돌그림자 출현 | 돌밑 서식처 보호 |
| `yusok_runner` | 유속러너 | 낮/맑음 | 유속 화살표 | 빠른 흐름 적응 |
| `dalbit_sucho` | 달빛수초령 | 밤/맑음 | 야간 수초대 | 야간 관찰 예절 |
| `doltum_spark` | 돌틈스파크 | 낮/맑음 | 전기불꽃 느낌 | 돌틈 서식처 |
| `bridge_glow` | 브릿지글로우 | 밤/약간 흐림 | 인공구조물 그림자 | 다리 밑 생태 |
| `edge_mirror` | 에지미러 | 낮/맑음 | 수면 반사 | 가장자리 생물다양성 |
| `green_curtain` | 그린커튼피시 | 낮밤/약간 흐림 | 수초 장막 | 수초 밀도 |
| `brown_silt_hunter` | 브라운실트헌터 | 밤/흙탕물 | 실트 구름 | 탁도 적응 |
| `river_comet` | 리버코멧 | 낮/맑음 | 유성처럼 빠름 | 유속 관찰 |
| `seoribineul` | 서리비늘 | 밤/맑음 | 서리빛 비늘 | 희귀 출몰 연출 |
| `pomal_tail` | 포말꼬리 | 낮/맑음 | 거품 꼬리 | 물살·산소 |

## 5. 자산 폴더 규칙

```text
assets/fish/{id}/
  swim.png
  card.png
  left.png
  right.png
  front_left.png
  front_right.png
  back.png
  meta.json
```

우선순위:
1. `swim.png`, `card.png`
2. 5방향 반입체 PNG
3. SVG fallback
4. generated placeholder

## 6. Codex 작업 지시

### 안전 원칙
- 기존 `app_assets/index.html` 대형 원본은 바로 덮어쓰지 않는다.
- 현재 v4.6.2e 안정본에서 1종씩 적용한다.
- 모든 어종 추가는 `data/gonjiam_ecosystem_assets_v1.json` → UI 연결 순서로 간다.
- 한 번에 전체 어종 렌더링 금지. 우선 대표 5종만 화면에 띄우고 나머지는 도감 데이터로 보관한다.

### 다음 작업
1. `data/gonjiam_ecosystem_assets_v1.json` 추가
2. 현재 v4.6.2e에 JSON 로더 함수 추가
3. 버들치는 기존 SVG 자산 유지
4. 피라미 `assets/fish/pirami/swim.svg`, `card.svg` 생성
5. 피라미 1종만 수족관에 추가 연결
6. `PondangV5BeodeulchiAssetReadyV462e.audit()`를 `PondangV5EcosystemAssetV1.audit()`로 확장

## 7. 어린이 문구 규칙

- 어려운 분류명은 카드 하단으로 보낸다.
- 첫 줄은 반드시 아이 말투로 쓴다.
- 실제종/외래종/환상어종을 색으로 구분한다.
- 외래종은 무섭게만 보이지 않게, 왜 조심해야 하는지를 설명한다.
- 환상어종은 현실 생태와 연결되는 질문을 붙인다.

## 8. 검수 기준

- 하단 메뉴 4개 유지
- 카드/수족관/보고서 겹침 없음
- 모바일 세로 우선
- 이미지 없으면 fallback
- 외래종·환상어종 disclaimer 표시
- 한 번에 10마리 이상 렌더링 금지
- 느린 기기에서는 효과 자동 축소

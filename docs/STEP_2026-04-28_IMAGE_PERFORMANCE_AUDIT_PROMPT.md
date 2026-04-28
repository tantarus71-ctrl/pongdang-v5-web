# STEP 2026-04-28 이미지 용량/렌더링 성능 감사 실행 프롬프트

## 목적

이 문서는 Codex 로컬 파일 시스템에서 실행할 이미지 용량/렌더링 성능 감사 기준이다. 이번 단계는 이미지 압축이나 변환을 하지 않고, 실제 배경 이미지와 물고기 이미지의 파일 크기, 사용 위치, preload 구조, 렌더링 부담 후보를 선별하는 단계다.

## 실행 원칙

- 이미지 삭제 금지
- 이미지 변환 금지
- 이미지 덮어쓰기 금지
- app.js 수정 금지
- index.html preload 수정 금지
- data/*.json 수정 금지
- 관리자 편집/저장 기능 추가 금지
- 먼저 조사와 표 작성만 수행

## 점검 대상

기준 폴더:

```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final/
```

배경 이미지:

```text
assets/bg/upper/day
assets/bg/upper/night
assets/bg/rapid/day
assets/bg/rapid/night
assets/bg/soft-rapid/day
assets/bg/soft-rapid/night
assets/bg/deep/day
assets/bg/deep/night
assets/bg/pool/day
assets/bg/pool/night
```

물고기 이미지:

```text
assets/fish/
```

특히:

```text
assets/fish/beodeulchi/aquarium/
```

## 파일 크기 확인 명령

```powershell
$root = "app_assets\pongdang_gonjiam_v30A1_audio_stability_final"
$targets = @(
  "$root\assets\bg",
  "$root\assets\fish"
)
foreach($target in $targets){
  Get-ChildItem $target -Recurse -File | Where-Object {
    $_.Extension -match "\.(jpg|jpeg|png|webp)$"
  } | Select-Object FullName, Extension, Length | Sort-Object Length -Descending
}
```

## 기록 표

| file | type | sizeBytes | sizeMB | role | usedBy | riskLevel | note |
|---|---|---:|---:|---|---|---|---|

위험도 기준:

- 3MB 이상: 높음
- 1MB 이상: 중간
- 500KB 이하: 낮음

단, 배경 이미지는 품질을 위해 1~3MB 범위가 허용될 수 있다. 첫 화면 preload 이미지가 크면 우선 최적화 후보로 둔다.

## preload / 렌더링 구조 점검

확인 대상:

```text
index.html
src/app.js
src/styles/main.css
```

확인할 것:

1. preload는 첫 화면 기본 배경 1개만 하는지
2. 10개 배경 전체 preload를 하지 않는지
3. app.js에서 배경 전환 시 과도한 DOM 생성이 없는지
4. CSS filter, blur, animation이 과도하지 않은지
5. particles, bubbles, godrays, caustics가 모바일에서 부담될 가능성이 있는지
6. fish 이미지가 실제 표시 크기보다 과대 원본인지
7. 캐시 쿼리 문자열이 정상인지

## 최적화 후보 선정 기준

1순위:

- 첫 화면 preload 배경
- 3MB 이상 배경
- 모바일 첫 화면에 바로 보이는 이미지
- 반복적으로 표시되는 물고기 PNG
- 투명 PNG인데 지나치게 큰 파일

2순위:

- 밤/낮 전환 배경
- 도감 카드 이미지
- 관리자 preview에서 HEAD는 되지만 용량이 큰 파일

3순위:

- 사용하지 않는 후보 이미지
- fallback 후보 이미지
- 향후 확장용 이미지

## 이번 단계 산출물

생성할 문서:

```text
docs/STEP_2026-04-28_IMAGE_PERFORMANCE_AUDIT.md
docs/MASTER_APPEND_2026-04-28_IMAGE_PERFORMANCE_AUDIT.md
```

## 다음 단계 제안

감사 결과 이후 다음 단계는 `웃물 낮 배경 1개 optimized 후보 A/B 테스트`다. 단, 이미지 변환은 원본 보존 후 별도 폴더에 후보 파일을 생성하는 방식으로만 진행한다.

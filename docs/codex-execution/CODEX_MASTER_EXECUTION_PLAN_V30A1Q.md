# CODEX MASTER EXECUTION PLAN - v30A1Q

## Repository
`tantarus71-ctrl/pongdang-v5-web`

## Baseline
- Keep v30A1O as the working baseline.
- Do not auto-deploy to Netlify.
- Keep manual Netlify upload ZIP workflow.
- Work step-by-step through GitHub issues.
- Do not apply multiple species at once.
- Do not perform large app.js rewrites.
- Do not delete existing CSS, image assets, or core JSON files without isolation and validation.

## Core Safety Rules
1. Always check the previous stage result before starting the next stage.
2. Make only the minimum required change.
3. Prefer documentation and validation before feature expansion.
4. CSS changes should be appended as final override blocks in `src/styles/panel-responsive-polish-v30a1n.css` unless a stage says otherwise.
5. Direct deletion is forbidden. Move unused candidates to `_unused_YYYYMMDD` only after reference checks.
6. Keep filenames in English letters, numbers, hyphen, and underscore.
7. Keep HTML, CSS, JS, JSON encoded as UTF-8.
8. Verify HTTP 200, JS syntax, JSON parsing, and image references before reporting completion.

## Execution Order

### Stage 1 - Baseline Lock
Issue #8: `v30A1Q_STAGE1_BASELINE_LOCK`
- Lock v30A1O baseline.
- Create baseline, file role, and safe edit rule documents.

### Stage 2 - Structure Cleanup
Issue #9: `v30A1Q_STAGE2_STRUCTURE_CLEANUP_AND_STABILITY`
- CSS conflict review.
- Unused candidate isolation.
- Asset path standardization.
- Encoding and ZIP path rules.

### Stage 3 - Child Layout Lock
Issue #10: `v30A1Q_STAGE3_CHILD_LAYOUT_LOCK`
- Phone, tablet, and PC layout rules.
- Aquarium-centered layout.
- Bottom menu: 탐험 / 도감 / 미션 / 내 물고기.
- Popup and dex card layout stability.

### Stage 4 - Dex Card Polish
Issue #11: `v30A1Q_STAGE4_DEX_CARD_POLISH`
- Align discovered, locked, rare, and featured cards.
- Improve child-readable text and card touch targets.

### Stage 5 - Aquarium Immersion Polish
Issue #12: `v30A1Q_STAGE5_AQUARIUM_IMMERSION_POLISH`
- Improve aquarium visual dominance.
- Stabilize fish movement boundaries and cinema mode.

### Stage 6 - Menu Icon and Child UX Polish
Issue #13: `v30A1Q_STAGE6_MENU_ICON_AND_CHILD_UX_POLISH`
- Stabilize bottom menu icons, labels, touch states, and short child-friendly UI text.

### Stage 7 - Mission Reward Loop Polish
Issue #14: `v30A1Q_STAGE7_MISSION_REWARD_LOOP_POLISH`
- Improve exploration, discovery, dex, mission, reward, and return-to-exploration loop.

### Stage 8 - Species Data and AI Ecology Engine Lock
Issue #15: `v30A1Q_STAGE8_SPECIES_DATA_AND_AI_ECOLOGY_ENGINE_LOCK`
- Lock species schema, zone/depth rules, behavior value template, and AI mission link rules.

### Stage 9 - Single Species Add Pipeline
Issue #16: `v30A1Q_STAGE9_SINGLE_SPECIES_ADD_PIPELINE`
- Validate one-species add/check pipeline only.
- Priority: 버들치, 피라미, 쉬리, 각시붕어, 배스.

### Stage 10 - Multi Species Rollout Plan
Issue #17: `v30A1Q_STAGE10_MULTI_SPECIES_ROLLOUT_PLAN`
- Document rollout order, checklist, rollback rules, report template, and risks.

### Stage 11 - Apply Beodeulchi or Next Ready Species
Issue #18: `v30A1Q_STAGE11_SPECIES_APPLY_BEODEULCHI_OR_NEXT_READY_SPECIES`
- Apply or verify one species only.
- Prefer 버들치 first, or next ready species if already stable.

### Stage 12 - Next Species Apply
Issue #19: `v30A1Q_STAGE12_NEXT_SPECIES_APPLY`
- Apply or verify the next single species after Stage 11 passes.

### Stage 13 - Remaining Species or Final Stability Branch
Issue #20: `v30A1Q_STAGE13_REMAINING_SPECIES_APPLY_OR_FINAL_STABILITY`
- Decide whether to apply one more species or move to final stability.

## Codex Start Prompt
Use this exact prompt in Codex:

```txt
Open repository tantarus71-ctrl/pongdang-v5-web.
Read docs/codex-execution/CODEX_MASTER_EXECUTION_PLAN_V30A1Q.md first.
Then execute the GitHub issues in order, starting from the earliest incomplete stage.
Do not auto-deploy to Netlify.
Keep v30A1O as the baseline.
Report each stage with changed files, validation results, risks, and next-stage readiness.
```

## Required Completion Report Format
```txt
[완료 보고]
- 실행 단계:
- 기준본 유지 여부:
- 자동 배포 여부: 하지 않음
- 변경 파일 목록:
- 생성 문서 목록:
- JS 체크:
- JSON 체크:
- 이미지 누락:
- 모바일/태블릿/PC 검수:
- 문제/보류 사항:
- 다음 단계 진행 가능 여부:
```

# Active Candidates Review Request

Goal: ask Gemini to review the current AI expansion candidates before Codex promotes anything into runtime.

Current stable runtime:
- version: v4.8.30
- title: Phone Zone Label Fit
- app entry: app_assets/index.html
- patch: patches/latest.generated.patch.js

Candidates to review:

1. v4.8.37 discovery card UX
   - file: app_assets/v4837_discovery_card_ux_quality.html
   - current state: root index.html redirects to this candidate
   - risk: Korean text appears encoding-broken in local file reads; root redirect may make this candidate look like stable runtime before full audit.

2. v4.8.31 child quality layout
   - file: app_assets/v4831_child_quality_layout.html
   - current state: candidate build
   - risk: encoding-broken Korean labels and possible layout overlap must be audited before promotion.

3. Pirami candidate assets
   - files: assets/fish/pirami/swim.svg, assets/fish/pirami/card.svg
   - current state: candidate assets only
   - risk: species data and behavior mapping are not ready.

4. ChatGPT-Gemini-Codex bridge
   - files: tools/invoke-gemini-bridge.ps1, tools/request-gemini-review.ps1
   - current state: validated bridge call succeeded
   - risk: Gemini output must remain candidate input and must not bypass Codex validation.

Please review:
- What should Codex fix first?
- Which candidates should remain level_1?
- Which can move to level_2 or level_3?
- Any security or stability issue?
- Give concise Korean instructions for Codex.

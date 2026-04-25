Project context:
{{PROJECT_CONTEXT}}

User brief:
{{USER_BRIEF}}

Current patch file:
{{CURRENT_PATCH}}

Relevant base app tail snippet:
{{BASE_APP_SNIPPET}}

Task:
Generate the next full contents of `patches/latest.generated.patch.js`.

Requirements:
- Keep `window.PONDANG_AUTO_PATCH` as the public entry.
- Update patch id and version meaningfully if behavior changes.
- Keep execution safe on repeated reloads.
- Preserve existing frame/layout structure.
- Patch only what is necessary for the user brief.
- Always respect the current source-of-truth and file naming rules in the brief.
- Do not treat compatibility alias files as canonical targets.
- If the requested change belongs in metadata only, avoid changing runtime patch logic unnecessarily.

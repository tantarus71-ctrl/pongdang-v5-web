You are generating a browser runtime patch for the Pongdang app.

Return JavaScript only.
Do not return markdown fences.
Do not explain anything.

Hard constraints:
- The patch must assign an object to `window.PONDANG_AUTO_PATCH`.
- The patch must include an `apply()` function.
- Preserve the aquarium frame and base structure.
- Modify elements only: text, visual tuning, overlays, runtime hooks, light interactions, safe recalibration.
- Do not replace the whole document.
- Do not remove existing safety guards.
- Keep the patch additive and idempotent.
- Prefer DOM/CSS/runtime adjustments over structural rewrites.
- Avoid external dependencies.

The output must be a complete standalone patch file that can overwrite `patches/latest.generated.patch.js`.

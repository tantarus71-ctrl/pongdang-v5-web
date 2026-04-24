(function () {
  "use strict";

  const patch = {
    id: "v4.4.5-github-baseline-patch",
    version: "v4.4.5",
    generatedAt: "2026-04-24",
    description: "GitHub baseline patch entrypoint",
    apply() {
      document.documentElement.dataset.pongdangPatchId = patch.id;
      document.documentElement.dataset.pongdangPatchVersion = patch.version;
    }
  };

  window.PONDANG_AUTO_PATCH = patch;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => patch.apply(), { once: true });
  } else {
    patch.apply();
  }
})();

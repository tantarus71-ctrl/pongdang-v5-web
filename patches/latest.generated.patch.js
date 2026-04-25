(function () {
  "use strict";

  const FISH_VIEWSET_V450 = {
    beodeulchi: {
      left: "../assets/fish/beodeulchi/left.png",
      right: "../assets/fish/beodeulchi/right.png",
      frontLeft: "../assets/fish/beodeulchi/front_left.png",
      frontRight: "../assets/fish/beodeulchi/front_right.png"
    }
  };

  const BEODEULCHI_BEHAVIOR_V451 = {
    xRange: [16, 82],
    yRange: [30, 52],
    hidePassYRange: [56, 66],
    dartDistance: [3.0, 8.5],
    hoverDistance: [1.0, 3.2],
    pauseMs: [1400, 3800],
    dartMs: [1800, 3600],
    hoverMs: [3600, 7200],
    turnMs: [6200, 10400],
    turnChance: 0.07,
    hidePassChance: 0.06,
    hoverChance: 0.62
  };

  const BEODEULCHI_SCHOOL_V454 = [
    { key: "solo-surface", x: 22, y: 27, entryX: -7, entryY: 28, view: "right", direction: 1, width: 53, delay: 500, xRange: [12, 88], yRange: [20, 32], depthRange: [0.06, 0.20], speedBias: 1.04, rhythmBias: 0.96, entrySpeed: 0.58, floatBias: 1.00 },
    { key: "solo-upper", x: 63, y: 25, entryX: -13, entryY: 25, view: "right", direction: 1, width: 48, delay: 1400, xRange: [10, 90], yRange: [18, 31], depthRange: [0.04, 0.18], speedBias: 0.94, rhythmBias: 1.02, entrySpeed: 0.48, floatBias: 1.12 },
    { key: "solo-mid", x: 35, y: 34, entryX: -18, entryY: 34, view: "right", direction: 1, width: 59, delay: 2400, xRange: [10, 90], yRange: [27, 40], depthRange: [0.12, 0.30], speedBias: 1.22, rhythmBias: 0.88, entrySpeed: 0.72, floatBias: 0.92 },
    { key: "solo-rock", x: 77, y: 39, entryX: -10, entryY: 38, view: "frontRight", direction: 1, width: 59, delay: 3400, xRange: [12, 90], yRange: [32, 46], depthRange: [0.18, 0.36], speedBias: 1.38, rhythmBias: 0.80, entrySpeed: 0.88, floatBias: 0.84 },
    { key: "solo-front", x: 49, y: 43, entryX: -22, entryY: 42, view: "frontRight", direction: 1, width: 55, delay: 4600, xRange: [10, 88], yRange: [36, 50], depthRange: [0.22, 0.42], speedBias: 1.52, rhythmBias: 0.70, entrySpeed: 1.00, floatBias: 0.78 }
  ];

  const BEODEULCHI_RIGHT_ENTRY_V463 = {
    "solo-surface": { entryX: 107, entryY: 31, view: "left", direction: -1 },
    "solo-upper": { entryX: 113, entryY: 28, view: "left", direction: -1 },
    "solo-mid": { entryX: 118, entryY: 40, view: "left", direction: -1 },
    "solo-rock": { entryX: 110, entryY: 56, view: "frontLeft", direction: -1 },
    "solo-front": { entryX: 122, entryY: 63, view: "frontLeft", direction: -1 }
  };

  const AQUARIUM_DECOR_FIT_SELECTORS_V488 = [
    ".aquariumCaustics3D",
    ".aquariumFrame3D",
    ".aquariumGlassShine3D",
    ".aquariumFrontPebbles3D",
    ".aquariumFrontBlur3D",
    ".aquariumSurfaceLightV477",
    ".aquariumMicroBubblesV4822",
    ".aquariumBackHazeV482",
    ".aquariumSideWallsV482",
    ".aquariumFrontGlassV482"
  ];

  const patch = {
    id: "v4.8.30-phone-zone-label-fit-patch",
    version: "v4.8.30",
    generatedAt: "2026-04-24",
    description: "Optimize phone zone labels so confluence text fits cleanly without shifting",
    rafId: 0,
    auditRafId: 0,
    lastAuditAt: 0,
    auditIntervalMs: 1800,
    routeTimer: 0,
    schoolTimers: new Map(),
    lastAppliedKey: "",
    hideZone: {
      xMin: 58,
      xMax: 88,
      yMin: 52,
      yMax: 78
    },
    apply() {
      window.FISH_VIEWSET_V450 = FISH_VIEWSET_V450;
      document.documentElement.dataset.pongdangPatchId = patch.id;
      document.documentElement.dataset.pongdangPatchVersion = patch.version;

      if (typeof window.applyAquariumBackgroundV436 === "function") {
        const zone = window.appState && window.appState.aquariumZone ? window.appState.aquariumZone : "upper";
        const mode = window.appState && window.appState.aquariumNight ? "night" : "day";
        Promise.resolve(window.applyAquariumBackgroundV436(zone, mode)).catch(() => {});
      }

      if (typeof window.calibrateLayoutBands === "function") {
        requestAnimationFrame(() => window.calibrateLayoutBands());
      }

      patch.installViewsetStyles();
      patch.installMobileMenuFitStyles();
      patch.installPhoneZoneLabelFit();
      patch.ensureSurfaceLightLayer();
      patch.ensureAquariumDepthVolumeLayers();
      patch.ensureMicroBubbleLayer();
      patch.syncAllAquariumDecorBounds();
      patch.scheduleVisualTuning();
      patch.wrapFishLayerBuilder();
      patch.wrapLegacyDepthCalibrators();
      patch.bindViewportRefresh();
      patch.installBehaviorScheduler();
      // 한글 리마크: 초기 1회만 즉시 진단하고, 이후 반복 진단은 스로틀로 묶어 성능 흔들림을 줄인다.
      patch.scheduleSafetyAudit(true);
    },
    installViewsetStyles() {
      if (document.getElementById("pongdang-v450-viewset-style")) return;
      const style = document.createElement("style");
      style.id = "pongdang-v450-viewset-style";
      style.textContent = `
        @keyframes pongdangBeodeulchiWaterDriftV453 {
          0%, 100% { --fish-drift-x: 0px; --fish-drift-y: 0px; --fish-drift-roll: -0.18deg; --fish-drift-scale-x: 1; }
          36% { --fish-drift-x: 0.25px; --fish-drift-y: -0.35px; --fish-drift-roll: 0.16deg; --fish-drift-scale-x: 1.002; }
          72% { --fish-drift-x: -0.18px; --fish-drift-y: 0.22px; --fish-drift-roll: -0.08deg; --fish-drift-scale-x: 0.999; }
        }
        @keyframes pongdangTailBeatV481 {
          0%, 100% { --part-wag: var(--tail-swing-neg, -1.9deg); --part-nudge-x: -0.42px; }
          25% { --part-wag: var(--tail-swing-mid, .95deg); --part-nudge-x: 0.24px; }
          50% { --part-wag: var(--tail-swing, 1.9deg); --part-nudge-x: 0.42px; }
          75% { --part-wag: var(--tail-swing-mid-neg, -.95deg); --part-nudge-x: -0.24px; }
        }
        @keyframes pongdangBodyPulseV481 {
          0%, 100% { --part-wag: var(--body-swing-neg, -.32deg); --part-nudge-y: 0px; }
          45% { --part-wag: var(--body-swing, .32deg); --part-nudge-y: -0.14px; }
        }
        @keyframes pongdangHeadCounterV481 {
          0%, 100% { --part-wag: var(--head-swing, .18deg); --part-nudge-x: 0.08px; }
          50% { --part-wag: var(--head-swing-neg, -.18deg); --part-nudge-x: -0.08px; }
        }
        @keyframes pongdangSurfaceCausticV476 {
          0%, 100% { opacity: .10; transform: translate(-50%, -52%) rotate(-2deg) scaleX(.92); }
          42% { opacity: .22; transform: translate(calc(-50% + 3px), -58%) rotate(1deg) scaleX(1.08); }
          72% { opacity: .14; transform: translate(calc(-50% - 2px), -49%) rotate(-1deg) scaleX(.98); }
        }
        @keyframes pongdangSurfaceLightSweepV477 {
          0%, 100% { opacity: .28; background-position: 48% 0%, 78% 20%, 0 0, 50% 0%; }
          45% { opacity: .42; background-position: 52% 1%, 75% 18%, 18px 0, 50% 0%; }
          72% { opacity: .34; background-position: 49% 0%, 80% 22%, 8px 0, 50% 0%; }
        }
        @keyframes pongdangMicroBubbleRiseV4822 {
          0% {
            opacity: 0;
            transform: translate3d(0, 0, 0) scale(var(--bubble-scale-start, .72));
          }
          14% {
            opacity: var(--bubble-opacity, .28);
          }
          76% {
            opacity: var(--bubble-opacity, .28);
          }
          100% {
            opacity: 0;
            transform: translate3d(var(--bubble-drift-x, 5px), var(--bubble-rise-y, -56px), 0) scale(var(--bubble-scale-end, 1.04));
          }
        }
        .aquariumSurfaceLightV477 {
          position: absolute;
          z-index: 11;
          pointer-events: none !important;
          border-radius: 24px;
          overflow: hidden;
          contain: paint;
          mix-blend-mode: screen;
          opacity: .18;
          background:
            linear-gradient(180deg, rgba(246,253,255,.18) 0%, rgba(220,244,250,.08) 24%, rgba(186,226,238,.035) 48%, transparent 76%),
            linear-gradient(90deg, rgba(230,248,255,.035), transparent 30%, transparent 70%, rgba(210,240,248,.025));
          filter: blur(4px);
          animation: pongdangSurfaceLightSweepV477 9.5s ease-in-out infinite;
        }
        .aquariumMicroBubblesV4822 {
          position: absolute;
          z-index: 14;
          pointer-events: none !important;
          border-radius: 24px;
          overflow: hidden;
          contain: paint;
          opacity: 1;
        }
        .aquariumMicroBubbleV4822 {
          position: absolute;
          display: block;
          z-index: var(--bubble-z, 1);
          left: var(--bubble-x, 50%);
          top: var(--bubble-y, 72%);
          width: var(--bubble-size, 3px);
          height: var(--bubble-size, 3px);
          border-radius: 50%;
          border: 1px solid rgba(236,250,255,.68);
          background: rgba(255,255,255,.20);
          box-shadow: inset -1px -1px 2px rgba(255,255,255,.28), 0 0 5px rgba(210,244,255,.24);
          filter: blur(var(--bubble-blur, .08px)) brightness(var(--bubble-brightness, 1));
          animation: pongdangMicroBubbleRiseV4822 var(--bubble-duration, 12s) ease-in-out infinite;
          animation-delay: var(--bubble-delay, 0s);
        }
        .aquariumBackHazeV482,
        .aquariumSideWallsV482,
        .aquariumFrontGlassV482 {
          position: absolute;
          pointer-events: none !important;
          border-radius: 24px;
          overflow: hidden;
          contain: paint;
          transform-style: preserve-3d;
        }
        .aquariumBackHazeV482 {
          z-index: 3;
          opacity: .28;
          mix-blend-mode: normal;
          filter: blur(1px);
          background:
            linear-gradient(180deg, rgba(232,249,255,.06) 0%, rgba(200,236,246,.032) 36%, transparent 62%, rgba(0,33,48,.10) 100%);
          transform: translateZ(7px);
        }
        .aquariumSideWallsV482 {
          z-index: 9;
          opacity: .50;
          background:
            linear-gradient(180deg, transparent 0%, transparent 70%, rgba(0,10,14,.22) 100%);
          box-shadow:
            inset 0 -24px 42px rgba(0,12,16,.20);
          transform: translateZ(46px);
        }
        .aquariumFrontGlassV482 {
          z-index: 12;
          opacity: .12;
          mix-blend-mode: screen;
          background:
            linear-gradient(180deg, rgba(255,255,255,.035) 0%, transparent 34%, transparent 100%);
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,.055),
            inset 0 18px 30px rgba(255,255,255,.025);
          transform: translateZ(82px);
        }
        #fishLayer .fishBtn[data-viewset="beodeulchi"] > img.fishSpriteBase {
          image-rendering: auto;
          transform-origin: 50% 54%;
          will-change: opacity, filter, transform;
          animation: pongdangBeodeulchiWaterDriftV453 5.8s ease-in-out infinite;
          opacity: 0 !important;
          transform:
            perspective(220px)
            translate3d(var(--fish-drift-x, 0px), var(--fish-drift-y, 0px), 0)
            rotateX(var(--fish-pitch, 0deg))
            rotateY(var(--fish-body-yaw, 0deg))
            rotateZ(var(--fish-drift-roll, 0deg))
            scaleX(var(--fish-drift-scale-x, 1))
            scaleY(var(--fish-body-roundness, 1));
        }
        #fishLayer .fishBtn[data-viewset="beodeulchi"] .fishPart {
          position: absolute;
          left: 50%;
          top: 50%;
          width: var(--fish-part-width, 45px);
          max-width: none;
          pointer-events: none;
          image-rendering: auto;
          will-change: opacity, filter, transform;
          transform-origin: 50% 54%;
          animation: pongdangBeodeulchiWaterDriftV453 5.8s ease-in-out infinite;
          transform:
            perspective(220px)
            translate3d(calc(-50% + var(--fish-drift-x, 0px) + var(--part-nudge-x, 0px)), calc(-50% + var(--fish-drift-y, 0px) + var(--part-nudge-y, 0px)), 0)
            rotateX(var(--fish-pitch, 0deg))
            rotateY(var(--fish-body-yaw, 0deg))
            rotateZ(calc(var(--fish-drift-roll, 0deg) + var(--part-wag, 0deg)))
            scaleX(var(--fish-drift-scale-x, 1))
            scaleY(var(--fish-body-roundness, 1));
        }
        #fishLayer .fishBtn[data-viewset="beodeulchi"] .fishPartTail {
          animation: pongdangBeodeulchiWaterDriftV453 5.8s ease-in-out infinite, pongdangTailBeatV481 var(--tail-beat-speed, 1.58s) cubic-bezier(.45,0,.25,1) infinite;
        }
        #fishLayer .fishBtn[data-viewset="beodeulchi"] .fishPartBody {
          animation: pongdangBeodeulchiWaterDriftV453 5.8s ease-in-out infinite, pongdangBodyPulseV481 var(--body-beat-speed, 2.05s) cubic-bezier(.48,0,.28,1) infinite;
        }
        #fishLayer .fishBtn[data-viewset="beodeulchi"] .fishPartHead {
          animation: pongdangBeodeulchiWaterDriftV453 5.8s ease-in-out infinite, pongdangHeadCounterV481 var(--head-beat-speed, 2.35s) ease-in-out infinite;
        }
        #fishLayer .fishBtn[data-fish-view="right"] .fishPartTail,
        #fishLayer .fishBtn[data-fish-view="frontRight"] .fishPartTail {
          clip-path: inset(0 70% 0 0);
          transform-origin: 72% 54%;
        }
        #fishLayer .fishBtn[data-fish-view="right"] .fishPartBody,
        #fishLayer .fishBtn[data-fish-view="frontRight"] .fishPartBody {
          clip-path: inset(0 16% 0 19%);
          transform-origin: 48% 54%;
        }
        #fishLayer .fishBtn[data-fish-view="right"] .fishPartHead,
        #fishLayer .fishBtn[data-fish-view="frontRight"] .fishPartHead {
          clip-path: inset(0 0 0 62%);
          transform-origin: 38% 54%;
        }
        #fishLayer .fishBtn[data-fish-view="left"] .fishPartTail,
        #fishLayer .fishBtn[data-fish-view="frontLeft"] .fishPartTail {
          clip-path: inset(0 0 0 70%);
          transform-origin: 28% 54%;
        }
        #fishLayer .fishBtn[data-fish-view="left"] .fishPartBody,
        #fishLayer .fishBtn[data-fish-view="frontLeft"] .fishPartBody {
          clip-path: inset(0 19% 0 16%);
          transform-origin: 52% 54%;
        }
        #fishLayer .fishBtn[data-fish-view="left"] .fishPartHead,
        #fishLayer .fishBtn[data-fish-view="frontLeft"] .fishPartHead {
          clip-path: inset(0 62% 0 0);
          transform-origin: 62% 54%;
        }
        #fishLayer .fishBtn[data-viewset="beodeulchi"][data-motion-state="hover"] > img.fishSpriteBase,
        #fishLayer .fishBtn[data-viewset="beodeulchi"][data-motion-state="orbit-hover"] > img.fishSpriteBase,
        #fishLayer .fishBtn[data-viewset="beodeulchi"][data-motion-state="hover"] .fishPart,
        #fishLayer .fishBtn[data-viewset="beodeulchi"][data-motion-state="orbit-hover"] .fishPart {
          animation-duration: 7.4s;
        }
        #fishLayer .fishBtn[data-viewset="beodeulchi"][data-hide-amount^="0."] > img.fishSpriteBase,
        #fishLayer .fishBtn[data-viewset="beodeulchi"][data-hide-amount^="0."] .fishPart {
          animation-duration: 6.8s;
        }
        #fishLayer .fishBtn[data-viewset="beodeulchi"]::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: var(--fish-body-light-w, 58px);
          height: var(--fish-body-light-h, 24px);
          transform: translate(-50%, -56%) rotate(var(--surface-lens-tilt, -2deg));
          border-radius: 58% 42% 52% 48%;
          background:
            linear-gradient(102deg, transparent 0%, rgba(255,255,255,.24) 30%, transparent 48%),
            radial-gradient(ellipse at 48% 34%, rgba(255,255,255,.16), transparent 52%),
            radial-gradient(ellipse at 50% 68%, rgba(14,52,42,.18), transparent 62%);
          filter: blur(1.1px);
          opacity: var(--fish-body-light-opacity, .14);
          pointer-events: none;
          mix-blend-mode: screen;
          animation: pongdangSurfaceCausticV476 var(--surface-caustic-speed, 6.8s) ease-in-out infinite;
        }
        #fishLayer .fishBtn[data-viewset="beodeulchi"]::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: var(--fish-body-shadow-w, 64px);
          height: var(--fish-body-shadow-h, 11px);
          transform: translate(-50%, -35%) scaleX(var(--surface-ripple-scale, 1));
          border-radius: 999px;
          background:
            radial-gradient(ellipse at center, rgba(255,255,255,.18), rgba(255,255,255,.06) 36%, transparent 58%),
            radial-gradient(ellipse at 50% 82%, rgba(0,16,20,.28), rgba(0,16,20,.08) 42%, transparent 70%);
          filter: blur(1.9px);
          opacity: var(--fish-body-shadow-opacity, .18);
          pointer-events: none;
          mix-blend-mode: screen;
        }
      `;
      document.head.appendChild(style);
    },
    installMobileMenuFitStyles() {
      if (document.getElementById("pongdang-v4829-mobile-menu-fit-style")) return;
      const style = document.createElement("style");
      style.id = "pongdang-v4829-mobile-menu-fit-style";
      style.textContent = `
        /* 한글 리마크: 휴대폰에서는 상단 조작 메뉴와 하단 메뉴가 수족관을 덜 가리도록 높이와 간격을 줄인다. */
        @media (max-width: 680px) and (orientation: portrait) {
          :root {
            --hero-h: clamp(48px, 12.4vw, 58px) !important;
            --dock-h: clamp(58px, 15.2vw, 70px) !important;
            --bottom-nav-h: clamp(64px, 17vw, 76px) !important;
            --gap-1: 5px !important;
            --gap-2: 5px !important;
            --aquarium-card-top: calc(var(--safe-top) + var(--hero-h) + var(--gap-2) + var(--dock-h) + 2px) !important;
            --aquarium-card-bottom: calc(var(--safe-bottom) + var(--bottom-nav-h) + 7px) !important;
            --fish-top-bound: calc(var(--aquarium-card-top) + 8px) !important;
            --fish-bottom-bound: calc(var(--aquarium-card-bottom) + 8px) !important;
          }

          .topHud {
            left: max(8px, env(safe-area-inset-left)) !important;
            right: max(8px, env(safe-area-inset-right)) !important;
          }

          .heroCard {
            height: var(--hero-h) !important;
            min-height: var(--hero-h) !important;
            padding: 6px 11px !important;
            border-radius: 16px !important;
          }

          .heroLabel {
            font-size: 9.5px !important;
            line-height: 1 !important;
            opacity: .84 !important;
          }

          .heroTitle {
            font-size: clamp(17px, 5.1vw, 23px) !important;
            line-height: 1.02 !important;
            letter-spacing: -.035em !important;
            margin-top: 1px !important;
          }

          .aquaControlDock {
            height: var(--dock-h) !important;
            min-height: var(--dock-h) !important;
            top: calc(var(--safe-top) + var(--hero-h) + var(--gap-2)) !important;
            gap: 5px !important;
            grid-template-rows: repeat(2, minmax(26px, 1fr)) !important;
          }

          .zoneBar,
          .modeBar {
            min-height: 26px !important;
            max-height: 31px !important;
            padding: 3px !important;
            gap: 4px !important;
            overflow-x: auto !important;
            scrollbar-width: none !important;
            -webkit-overflow-scrolling: touch !important;
          }

          .zoneBar::-webkit-scrollbar,
          .modeBar::-webkit-scrollbar {
            display: none !important;
          }

          .zoneBtn,
          .modeBtn {
            min-height: 23px !important;
            height: 25px !important;
            padding: 4px 8px !important;
            font-size: 11px !important;
            line-height: 1 !important;
            white-space: nowrap !important;
            flex: 0 0 auto !important;
          }

          .zoneBtn {
            min-width: 48px !important;
            justify-content: center !important;
            text-align: center !important;
            letter-spacing: -.04em !important;
          }

          .zoneBtn[data-zone="confluence"] {
            min-width: 54px !important;
          }

          .zoneBtn .zoneEmojiPhone {
            display: none !important;
          }

          .zoneBtn .zoneLabelPhone {
            display: inline-block !important;
            max-width: 100% !important;
            overflow: hidden !important;
            text-overflow: clip !important;
            white-space: nowrap !important;
          }

          .bottomNav {
            height: var(--bottom-nav-h) !important;
            min-height: var(--bottom-nav-h) !important;
            max-height: var(--bottom-nav-h) !important;
            left: max(8px, env(safe-area-inset-left)) !important;
            right: max(8px, env(safe-area-inset-right)) !important;
            bottom: var(--safe-bottom) !important;
            gap: 5px !important;
            padding: 6px !important;
            border-radius: 18px !important;
          }

          .navBtn {
            height: calc(var(--bottom-nav-h) - 12px) !important;
            min-height: calc(var(--bottom-nav-h) - 12px) !important;
            padding: 4px 2px !important;
            gap: 2px !important;
            border-radius: 14px !important;
          }

          .navBtn .navEmoji {
            font-size: clamp(18px, 5.2vw, 21px) !important;
          }

          .navBtn .navText {
            font-size: clamp(10px, 2.85vw, 11px) !important;
            letter-spacing: -.035em !important;
            white-space: nowrap !important;
          }
        }

        /* 한글 리마크: 아주 좁은 폰에서는 메뉴를 더 낮춰 손가락 클릭성은 유지하고 수족관 면적을 확보한다. */
        @media (max-width: 390px) and (orientation: portrait) {
          :root {
            --hero-h: 48px !important;
            --dock-h: 58px !important;
            --bottom-nav-h: 66px !important;
          }

          .heroLabel { display: none !important; }
          .heroTitle { font-size: clamp(16px, 5vw, 20px) !important; }
          .zoneBtn,
          .modeBtn {
            height: 23px !important;
            min-height: 23px !important;
            padding: 3px 7px !important;
            font-size: 10.5px !important;
          }
          .zoneBtn { min-width: 44px !important; }
          .zoneBtn[data-zone="confluence"] {
            min-width: 50px !important;
            font-size: 10px !important;
          }
          .navBtn {
            height: 54px !important;
            min-height: 54px !important;
          }
          .navBtn .navEmoji { font-size: 18px !important; }
          .navBtn .navText { font-size: 10px !important; }
        }
      `;
      document.head.appendChild(style);
    },
    installPhoneZoneLabelFit() {
      const labels = {
        upper: "웃물",
        riffle: "여울",
        run: "잔여울",
        pool: "깊물",
        confluence: "물모이"
      };
      const emojis = {
        upper: "🏔️",
        riffle: "〰️",
        run: "🌀",
        pool: "⚓",
        confluence: "🍃"
      };
      const applyLabels = () => {
        document.querySelectorAll(".zoneBtn[data-zone]").forEach((btn) => {
          const key = btn.dataset.zone || "";
          const label = labels[key] || btn.textContent.trim().replace(/^[^\s]+\s*/, "");
          // 한글 리마크: 휴대폰에서는 이모지를 CSS로 숨기고 글자만 중앙 정렬해서 '물모이' 밀림을 막는다.
          btn.innerHTML = `<span class="zoneEmojiPhone" aria-hidden="true">${emojis[key] || "💧"}</span><span class="zoneLabelPhone">${label}</span>`;
          btn.setAttribute("aria-label", label);
        });
      };
      requestAnimationFrame(applyLabels);
      const zoneBar = document.getElementById("zoneBar");
      if (zoneBar && !zoneBar.dataset.phoneZoneLabelObserver) {
        zoneBar.dataset.phoneZoneLabelObserver = "v4.8.30";
        const observer = new MutationObserver(() => requestAnimationFrame(applyLabels));
        observer.observe(zoneBar, { childList: true });
      }
    },
    syncDecorLayerToBackground(layer) {
      const bg = document.getElementById("aquariumBg");
      const stage = document.getElementById("aquariumStage");
      if (!bg || !layer || !stage) return false;
      const bgStyle = getComputedStyle(bg);
      const stageRect = stage.getBoundingClientRect();
      const bgRect = bg.getBoundingClientRect();
      const left = Math.max(0, bgRect.left - stageRect.left);
      const top = Math.max(0, bgRect.top - stageRect.top);
      const right = Math.max(0, stageRect.right - bgRect.right);
      const bottom = Math.max(0, stageRect.bottom - bgRect.bottom);
      // 한글 리마크: CSS 변수값이 브라우저에서 계산되며 어긋날 수 있어 실제 렌더링 박스 기준으로 장식 레이어를 맞춘다.
      layer.style.left = `${left.toFixed(2)}px`;
      layer.style.top = `${top.toFixed(2)}px`;
      layer.style.right = `${right.toFixed(2)}px`;
      layer.style.bottom = `${bottom.toFixed(2)}px`;
      layer.style.borderRadius = bgStyle.borderRadius;
      layer.style.overflow = "hidden";
      layer.style.boxSizing = "border-box";
      layer.style.clipPath = "inset(0 round " + (bgStyle.borderRadius || "24px") + ")";
      layer.style.maxWidth = `${Math.max(0, bgRect.width).toFixed(2)}px`;
      layer.style.maxHeight = `${Math.max(0, bgRect.height).toFixed(2)}px`;
      return true;
    },
    syncAllAquariumDecorBounds() {
      const selectors = AQUARIUM_DECOR_FIT_SELECTORS_V488.join(",");
      const layers = Array.from(document.querySelectorAll(selectors))
        .filter((node, index, list) => list.indexOf(node) === index);
      layers.forEach((layer) => {
        // 한글 리마크: 예전 3D 레이어까지 실제 수족관 배경 박스에 잠가서 화면 밖으로 번지는 조명/유리 효과를 막는다.
        patch.markDecorLayer(layer);
        patch.syncDecorLayerToBackground(layer);
      });
      return layers.length;
    },
    ensureSurfaceLightLayer() {
      const stage = document.getElementById("aquariumStage");
      const bg = document.getElementById("aquariumBg");
      if (!stage || !bg) return false;
      let layer = document.getElementById("aquariumSurfaceLightV477");
      if (!layer) {
        layer = document.createElement("div");
        layer.id = "aquariumSurfaceLightV477";
        layer.className = "aquariumSurfaceLightV477";
        layer.setAttribute("aria-hidden", "true");
        stage.appendChild(layer);
      }
      patch.markDecorLayer(layer);
      patch.syncDecorLayerToBackground(layer);
      return true;
    },
    markDecorLayer(layer) {
      if (!layer) return;
      layer.setAttribute("aria-hidden", "true");
      layer.setAttribute("data-layer-role", "decor");
      layer.setAttribute("data-pongdang-layer-kind", "decor");
      layer.setAttribute("data-pongdang-clickable", "false");
      layer.style.pointerEvents = "none";
    },
    ensureAquariumDepthVolumeLayers() {
      const stage = document.getElementById("aquariumStage");
      const bg = document.getElementById("aquariumBg");
      if (!stage || !bg) return false;
      ["aquariumBackHazeV482", "aquariumSideWallsV482", "aquariumFrontGlassV482"].forEach((className) => {
        let layer = document.getElementById(className);
        if (!layer) {
          layer = document.createElement("div");
          layer.id = className;
          layer.className = className;
          stage.appendChild(layer);
        }
        patch.markDecorLayer(layer);
        patch.syncDecorLayerToBackground(layer);
      });
      patch.syncAllAquariumDecorBounds();
      return true;
    },
    ensureMicroBubbleLayer() {
      const stage = document.getElementById("aquariumStage");
      const bg = document.getElementById("aquariumBg");
      if (!stage || !bg) return false;

      let layer = document.getElementById("aquariumMicroBubblesV4822");
      if (!layer) {
        layer = document.createElement("div");
        layer.id = "aquariumMicroBubblesV4822";
        layer.className = "aquariumMicroBubblesV4822";
        stage.appendChild(layer);
      }

      patch.markDecorLayer(layer);
      patch.syncDecorLayerToBackground(layer);

      if (layer.dataset.bubbleVersion !== "v4.8.28") {
        const randomPercent = (min, max) => `${(min + Math.random() * (max - min)).toFixed(1)}%`;
        const buildCluster = (base, count) => Array.from({ length: count }, (_, index) => ({
          ...base,
          x: `calc(${base.x} + ${index * 5 - 5}px)`,
          y: `calc(${base.y} + ${index * 8}px)`,
          size: `${base.size + index * 0.8}px`,
          duration: `${base.duration + index * 1.15}s`,
          delay: `${base.delay - index * 1.9}s`,
          rise: `${base.rise - index * 7}px`,
          drift: `${base.drift + (index - 1) * 2}px`,
          opacity: `${Math.max(0.18, base.opacity - index * 0.04).toFixed(2)}`
        }));
        const bubblePoints = [
          { depth: "front-left", x: randomPercent(18, 30), y: randomPercent(72, 80), size: 7.2, duration: 11.0, delay: -1.0, rise: -92, drift: 5, opacity: .60, blur: ".02px", brightness: "1.14", start: ".76", end: "1.15", z: 3 },
          { depth: "front-right", x: randomPercent(68, 82), y: randomPercent(74, 82), size: 7.6, duration: 12.0, delay: -5.4, rise: -96, drift: -5, opacity: .56, blur: ".02px", brightness: "1.12", start: ".78", end: "1.16", z: 3 },
          { depth: "back-left", x: randomPercent(30, 42), y: randomPercent(58, 67), size: 3.7, duration: 16.4, delay: -7.8, rise: -72, drift: 3, opacity: .32, blur: ".38px", brightness: ".94", start: ".60", end: ".92", z: 1 },
          { depth: "back-right", x: randomPercent(58, 70), y: randomPercent(56, 66), size: 3.9, duration: 17.2, delay: -11.2, rise: -76, drift: -3, opacity: .30, blur: ".42px", brightness: ".92", start: ".60", end: ".92", z: 1 }
        ];
        // 한글 리마크: 좌우 앞뒤 4군데로 분산하고, 앞쪽 기포만 크게 잡아 수조 깊이와 실제 수면 상승감을 만든다.
        const bubbles = [
          ...bubblePoints.flatMap((point) => buildCluster(point, point.z > 1 ? 3 : 2))
        ];
        layer.replaceChildren(...bubbles.map((bubble, index) => {
          const node = document.createElement("div");
          node.className = "aquariumMicroBubbleV4822";
          node.setAttribute("aria-hidden", "true");
          node.dataset.bubbleIndex = String(index + 1);
          node.dataset.depth = bubble.depth;
          node.style.setProperty("--bubble-x", bubble.x);
          node.style.setProperty("--bubble-y", bubble.y);
          node.style.setProperty("--bubble-size", bubble.size);
          node.style.setProperty("--bubble-duration", bubble.duration);
          node.style.setProperty("--bubble-delay", bubble.delay);
          node.style.setProperty("--bubble-rise-y", bubble.rise);
          node.style.setProperty("--bubble-drift-x", bubble.drift);
          node.style.setProperty("--bubble-opacity", bubble.opacity);
          node.style.setProperty("--bubble-blur", bubble.blur);
          node.style.setProperty("--bubble-brightness", bubble.brightness);
          node.style.setProperty("--bubble-scale-start", bubble.start);
          node.style.setProperty("--bubble-scale-end", bubble.end);
          node.style.setProperty("--bubble-z", String(bubble.z));
          node.style.pointerEvents = "none";
          return node;
        }));
        layer.dataset.bubbleVersion = "v4.8.28";
      }

      return true;
    },
    runSafetyAudit() {
      const decorSelectors = [
        ".aquariumBg",
        ".aquariumDecor",
        ".aquariumCaustics3D",
        ".aquariumFrame3D",
        ".aquariumGlassShine3D",
        ".aquariumFrontPebbles3D",
        ".aquariumFrontBlur3D",
        ".aquariumSurfaceLightV477",
        ".aquariumMicroBubblesV4822",
        ".aquariumMicroBubbleV4822",
        ".aquariumBackHazeV482",
        ".aquariumSideWallsV482",
        ".aquariumFrontGlassV482",
        "[data-layer-role='decor']",
        "[data-pongdang-layer-kind='decor']"
      ].join(",");
      const decorClickable = Array.from(document.querySelectorAll(decorSelectors))
        .filter((node, index, list) => list.indexOf(node) === index)
        .filter((node) => getComputedStyle(node).pointerEvents !== "none")
        .map((node) => node.id || node.className || node.tagName);
      const fishCount = document.querySelectorAll('#fishLayer .fishBtn[data-fish-id="beodeulchi"][data-school-id]').length;
      const openSheets = document.querySelectorAll(".sheet.show").length;
      const openModals = document.querySelectorAll(".modal.show").length;
      const z = {};
      ["fishLayer", "uiLayer", "sheetLayer", "modalLayer"].forEach((id) => {
        const node = document.getElementById(id);
        z[id] = node ? Number(getComputedStyle(node).zIndex) || 0 : null;
      });
      const zOk = (z.fishLayer === null || z.uiLayer === null || z.fishLayer < z.uiLayer) &&
        (z.uiLayer === null || z.sheetLayer === null || z.uiLayer < z.sheetLayer) &&
        (z.sheetLayer === null || z.modalLayer === null || z.sheetLayer < z.modalLayer);
      const decorOutOfBounds = patch.findDecorOutOfBounds();
      const report = {
        ok: decorClickable.length === 0 && decorOutOfBounds.length === 0 && fishCount === BEODEULCHI_SCHOOL_V454.length && openSheets <= 1 && openModals <= 1 && zOk,
        version: patch.version,
        decorClickable,
        decorOutOfBounds,
        fishCount,
        expectedFishCount: BEODEULCHI_SCHOOL_V454.length,
        openSheets,
        openModals,
        z,
        zOk,
        time: new Date().toISOString()
      };
      window.PONDANG_STABILITY_REPORT = report;
      if (typeof window.PondangDevGuard?.audit === "function") {
        try {
          window.PONDANG_DEVGUARD_LAST_AUDIT = window.PondangDevGuard.audit();
        } catch (error) {
          report.devGuardError = String(error && error.message ? error.message : error);
        }
      }
      return report;
    },
    findDecorOutOfBounds() {
      const bg = document.getElementById("aquariumBg");
      if (!bg) return [];
      const bgRect = bg.getBoundingClientRect();
      const tolerance = 4;
      return Array.from(document.querySelectorAll(AQUARIUM_DECOR_FIT_SELECTORS_V488.join(",")))
        .filter((node, index, list) => list.indexOf(node) === index)
        .filter((node) => {
          const rect = node.getBoundingClientRect();
          return rect.left < bgRect.left - tolerance ||
            rect.top < bgRect.top - tolerance ||
            rect.right > bgRect.right + tolerance ||
            rect.bottom > bgRect.bottom + tolerance;
        })
        .map((node) => node.id || node.className || node.tagName);
    },
    scheduleSafetyAudit(force = false) {
      const now = Date.now();
      if (!force && now - patch.lastAuditAt < patch.auditIntervalMs) return window.PONDANG_STABILITY_REPORT || null;
      if (patch.auditRafId) return window.PONDANG_STABILITY_REPORT || null;
      // 한글 리마크: DOM 전체를 훑는 안전 진단은 requestAnimationFrame 안에서 한 번만 실행해 중복 호출을 막는다.
      patch.auditRafId = requestAnimationFrame(() => {
        patch.auditRafId = 0;
        patch.lastAuditAt = Date.now();
        patch.runSafetyAudit();
      });
      return window.PONDANG_STABILITY_REPORT || null;
    },
    scheduleVisualTuning() {
      if (patch.rafId) cancelAnimationFrame(patch.rafId);
      patch.rafId = requestAnimationFrame(() => {
        patch.rafId = 0;
        patch.applyVisualTuning();
      });
    },
    applyVisualTuning() {
      const bg = document.getElementById("aquariumBg");
      const light = document.querySelector(".aquariumLight");
      const depth = document.querySelector(".aquariumDepth");
      const substrate = document.querySelector(".aquariumSubstrate");
      const frontPebbles = document.querySelector(".aquariumFrontPebbles3D");
      const vignette = document.querySelector(".aquariumVignette");
      let fishButtons = Array.from(document.querySelectorAll("#fishLayer .fishBtn"));
      const applyKey = [
        !!bg,
        !!light,
        !!depth,
        !!vignette,
        fishButtons.length,
        bg ? bg.dataset.bgState || "" : "",
        bg ? bg.dataset.bgSrc || "" : "",
        fishButtons.map((btn) => `${btn.dataset.fishId}:${btn.style.left}:${btn.style.top}`).join(",")
      ].join("|");

      if (patch.lastAppliedKey === applyKey) return;
      patch.lastAppliedKey = applyKey;

      patch.ensureUpperBeodeulchiSchool();
      fishButtons = Array.from(document.querySelectorAll("#fishLayer .fishBtn"));

      if (bg) {
        // 한글 리마크: 낮 배경은 조명 레이어가 아니라 배경 자체의 밝기/색감으로 부드럽게 맞춘다.
        bg.style.backgroundPosition = "center 46%";
        bg.style.backgroundSize = "cover";
        bg.style.filter = "brightness(1.08) contrast(.98) saturate(1.06)";
        bg.style.boxShadow = [
          "0 18px 44px rgba(0,0,0,.20)",
          "inset 0 1px 0 rgba(255,255,255,.06)",
          "inset 0 -18px 38px rgba(0,28,40,.16)"
        ].join(", ");
      }

      if (light) {
        // 한글 리마크: 어색한 조명층은 전부 끄고, 실제 배경/수심/그림자만 남긴다.
        light.style.background = "none";
        light.style.opacity = "0";
        light.style.mixBlendMode = "normal";
      }

      patch.ensureSurfaceLightLayer();
      patch.ensureAquariumDepthVolumeLayers();
      patch.ensureMicroBubbleLayer();
      patch.syncAllAquariumDecorBounds();
      patch.applyNaturalSoftDayLighting();
      patch.scheduleSafetyAudit();

      if (depth) {
        // 한글 리마크: 수면 위~중간층은 밝게 열고, 아래쪽만 넓게 눌러 낮 배경을 자연스럽게 만든다.
        depth.style.background =
          "linear-gradient(180deg, rgba(244,252,255,.08) 0%, rgba(213,242,250,.035) 28%, rgba(6,24,35,.08) 56%, rgba(6,24,35,.22) 82%, rgba(6,24,35,.38) 100%)";
      }

      if (substrate) {
        // 한글 리마크: 줄무늬처럼 보이는 반복/좌우 질감을 제거하고 위아래 그림자만 남긴다.
        substrate.style.background =
          "linear-gradient(180deg, transparent 0%, transparent 76%, rgba(37,50,41,.14) 86%, rgba(28,35,32,.46) 100%)";
      }

      if (frontPebbles) {
        frontPebbles.style.background =
          "linear-gradient(180deg, transparent 0%, transparent 86%, rgba(24,32,27,.22) 100%)";
        frontPebbles.style.filter = "blur(2.8px)";
        frontPebbles.style.opacity = ".34";
      }

      if (vignette) {
        // 한글 리마크: 큰 원형 비네트도 바닥 원형 조명처럼 보일 수 있어 선형 가장자리 음영으로 고정한다.
        vignette.style.background =
          "linear-gradient(180deg, rgba(255,255,255,.025) 0%, transparent 34%, rgba(0,0,0,.12) 100%)";
      }

      patch.applySoftDayWaterBalance();

      fishButtons.forEach((btn, index) => patch.applyFishDepth(btn, index));
    },
    applyNaturalSoftDayLighting() {
      const light = document.querySelector(".aquariumLight");
      const surfaceLight = document.querySelector(".aquariumSurfaceLightV477");
      const glassShine = document.querySelector(".aquariumGlassShine3D");
      const frontGlass = document.querySelector(".aquariumFrontGlassV482");
      const caustics = document.querySelector(".aquariumCaustics3D");
      if (light) {
        // 한글 리마크: 낮 조명은 선/원/무늬가 보이지 않는 넓은 상단 면광으로만 표현한다.
        light.style.background =
          "linear-gradient(180deg, rgba(246,253,255,.12) 0%, rgba(222,246,252,.055) 30%, transparent 68%)";
        light.style.opacity = ".42";
        light.style.mixBlendMode = "screen";
      }
      if (surfaceLight) {
        surfaceLight.style.background =
          "linear-gradient(180deg, rgba(246,253,255,.18) 0%, rgba(220,244,250,.08) 24%, rgba(186,226,238,.035) 48%, transparent 76%), linear-gradient(90deg, rgba(230,248,255,.035), transparent 30%, transparent 70%, rgba(210,240,248,.025))";
        surfaceLight.style.opacity = ".18";
        surfaceLight.style.filter = "blur(4px)";
        surfaceLight.style.mixBlendMode = "screen";
      }
      if (caustics) {
        // 한글 리마크: 물결 줄무늬는 다시 넣지 않는다. 어색한 조명 재발 방지를 위해 완전히 끈다.
        caustics.style.background = "none";
        caustics.style.opacity = "0";
        caustics.style.filter = "none";
        caustics.style.mixBlendMode = "normal";
      }
      if (glassShine) {
        glassShine.style.background = "none";
        glassShine.style.opacity = "0";
        glassShine.style.mixBlendMode = "normal";
      }
      if (frontGlass) {
        frontGlass.style.background =
          "linear-gradient(180deg, rgba(255,255,255,.035) 0%, transparent 34%, transparent 100%)";
        frontGlass.style.opacity = ".12";
        frontGlass.style.boxShadow =
          "inset 0 0 0 1px rgba(255,255,255,.055), inset 0 18px 30px rgba(255,255,255,.025)";
        frontGlass.style.mixBlendMode = "screen";
      }
    },
    applySoftDayWaterBalance() {
      const backHaze = document.querySelector(".aquariumBackHazeV482");
      const sideWalls = document.querySelector(".aquariumSideWallsV482");
      const frontBlur = document.querySelector(".aquariumFrontBlur3D");
      if (backHaze) {
        // 한글 리마크: 중간 수심은 줄무늬 없이 넓은 투명 막으로만 밝기를 올린다.
        backHaze.style.background =
          "linear-gradient(180deg, rgba(236,250,255,.055) 0%, rgba(204,236,244,.030) 32%, transparent 58%, rgba(0,30,42,.08) 100%)";
        backHaze.style.opacity = ".36";
        backHaze.style.filter = "blur(1.8px)";
        backHaze.style.mixBlendMode = "normal";
      }
      if (sideWalls) {
        sideWalls.style.background =
          "linear-gradient(180deg, transparent 0%, transparent 72%, rgba(0,10,14,.16) 100%)";
        sideWalls.style.opacity = ".38";
        sideWalls.style.boxShadow = "inset 0 -20px 36px rgba(0,12,16,.14)";
      }
      if (frontBlur) {
        frontBlur.style.background =
          "linear-gradient(180deg, transparent 0%, transparent 80%, rgba(20,58,46,.13) 100%)";
        frontBlur.style.opacity = ".24";
        frontBlur.style.filter = "blur(6px)";
      }
    },
    clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    },
    smoothstep(edge0, edge1, value) {
      const t = patch.clamp((value - edge0) / (edge1 - edge0 || 1), 0, 1);
      return t * t * (3 - 2 * t);
    },
    getHideAmount(x, y) {
      const zone = patch.hideZone;
      const insideX = patch.smoothstep(zone.xMin - 5, zone.xMin + 4, x) *
        (1 - patch.smoothstep(zone.xMax - 4, zone.xMax + 5, x));
      const insideY = patch.smoothstep(zone.yMin - 5, zone.yMin + 4, y) *
        (1 - patch.smoothstep(zone.yMax - 4, zone.yMax + 5, y));
      return patch.clamp(insideX * insideY, 0, 1);
    },
    getDepthProfile(x, y, depthBias = 0) {
      const verticalDepth = patch.clamp((y - 18) / 72, 0, 1);
      const rightBackBias = patch.clamp((x - 50) / 42, 0, 1) * patch.clamp((72 - y) / 42, 0, 1);
      const sceneDepth = verticalDepth * 0.28 + (1 - rightBackBias) * 0.04 + depthBias * 0.52;
      const depth = patch.clamp(sceneDepth, 0, 1);
      const scale = patch.clamp(0.88 + depth * 0.24, 0.84, 1.12);
      const z = Math.round(28 + depth * 42);
      const speed = patch.clamp(0.76 + depth * 0.38, 0.74, 1.18);
      const brightness = patch.clamp(1.02 - depth * 0.06, 0.94, 1.04);
      const contrast = patch.clamp(0.96 + depth * 0.05, 0.94, 1.02);
      const saturation = patch.clamp(0.94 + depth * 0.10, 0.92, 1.04);
      return { depth, scale, z, speed, brightness, contrast, saturation };
    },
    getHeadForwardView(direction, angled = false) {
      const dir = Number(direction) < 0 ? -1 : 1;
      if (angled) return dir < 0 ? "frontLeft" : "frontRight";
      return dir < 0 ? "left" : "right";
    },
    getFishView(btn, profile, x, y) {
      const fishId = btn.dataset.fishId || "";
      const viewset = FISH_VIEWSET_V450[fishId];
      if (!viewset) return null;

      const prevX = parseFloat(btn.dataset.prevX || "");
      const prevY = parseFloat(btn.dataset.prevY || "");
      const dx = Number.isFinite(prevX) ? x - prevX : 0;
      const dy = Number.isFinite(prevY) ? y - prevY : 0;
      const direction = parseFloat(btn.dataset.swimDirection || "0") || 0;
      const motionState = btn.dataset.motionState || "dart";
      btn.dataset.prevX = String(x);
      btn.dataset.prevY = String(y);

      const activeDirection = Math.abs(dx) > 0.08 ? dx : direction;
      let view = patch.getHeadForwardView(activeDirection, false);
      if (motionState === "entry") view = patch.getHeadForwardView(direction || activeDirection, false);
      else if (!Number.isFinite(prevX) && btn.dataset.preferredView) view = btn.dataset.preferredView;
      else if (motionState === "turn") view = patch.getHeadForwardView(direction || activeDirection, true);
      else if (profile.depth > 0.48 && Math.abs(dx) > 0.10) view = patch.getHeadForwardView(activeDirection, true);
      else if (dy < -0.32 && profile.depth < 0.30) view = patch.getHeadForwardView(activeDirection, false);
      else if (motionState === "hover" && Math.abs(dx) < 0.12) view = patch.getHeadForwardView(direction || activeDirection, false);
      else if (profile.depth > 0.68) view = patch.getHeadForwardView(direction || activeDirection, true);
      else if (profile.depth < 0.32 && y < 42) view = patch.getHeadForwardView(direction || activeDirection, false);

      return { view, src: new URL(viewset[view], document.baseURI).href };
    },
    getViewWidth(view, profile) {
      const base = {
        left: 63,
        right: 63,
        frontLeft: 57,
        frontRight: 57
      }[view] || 132;
      const depthBoost = 0.96 + profile.depth * 0.12;
      // 한글 리마크: 현재 기준 40% 확대한 버들치가 화면 제한에 눌려 작아지지 않도록 제한값도 같이 올린다.
      const viewportLimit = Math.max(34, Math.min(window.innerWidth * 0.112, 76));
      return Math.round(Math.min(base * depthBoost, viewportLimit));
    },
    applyFishViewset(btn, profile, x, y) {
      const viewInfo = patch.getFishView(btn, profile, x, y);
      if (!viewInfo) return;
      const img = btn.querySelector(".fishSpriteBase") || btn.querySelector("img");
      if (!img) return;
      img.classList.add("fishSpriteBase");

      btn.dataset.viewset = btn.dataset.fishId;
      btn.dataset.fishView = viewInfo.view;
      if (!img.dataset.originalSrc) img.dataset.originalSrc = img.getAttribute("src") || "";
      if (img.getAttribute("src") !== viewInfo.src) {
        img.src = viewInfo.src;
      }
      const width = patch.getViewWidth(viewInfo.view, profile);
      img.style.width = `${width}px`;
      patch.ensureFishPartRig(btn, viewInfo.src, width);
    },
    ensureFishPartRig(btn, src, width) {
      if (!btn || !src) return;
      const parts = [
        ["tail", "fishPartTail"],
        ["body", "fishPartBody"],
        ["head", "fishPartHead"]
      ];
      parts.forEach(([part, className]) => {
        let layer = btn.querySelector(`.fishPart[data-fish-part="${part}"]`);
        if (!layer) {
          layer = document.createElement("img");
          layer.className = `fishPart ${className}`;
          layer.dataset.fishPart = part;
          layer.alt = "";
          layer.decoding = "async";
          layer.loading = "eager";
          layer.setAttribute("aria-hidden", "true");
          btn.appendChild(layer);
        }
        if (layer.getAttribute("src") !== src) layer.src = src;
        layer.style.width = `${width}px`;
      });
      btn.style.setProperty("--fish-part-width", `${width}px`);
    },
    applyFishDepth(btn, index) {
      const x = parseFloat(btn.style.left) || 50;
      const y = parseFloat(btn.style.top) || 50;
      const laneDepth = parseFloat(btn.dataset.depthBias || "0");
      const profile = patch.getDepthProfile(x, y, Number.isFinite(laneDepth) ? laneDepth : 0);
      const hide = patch.getHideAmount(x, y);
      const hiddenScale = profile.scale * (1 - hide * 0.07);
      const entryFade = btn.dataset.entering === "1" ? patch.smoothstep(-10, 12, x) : 1;
      const depthOpacity = patch.clamp(0.78 + profile.depth * 0.22, 0.78, 1);
      const opacity = patch.clamp((depthOpacity - hide * 0.12) * entryFade, 0.18, 1);
      const blur = patch.clamp((1 - profile.depth) * 0.42 + hide * 0.55, 0, 0.9);
      const causticBoost = 1 + Math.sin(Date.now() / (1900 + index * 180) + index) * (0.018 + (1 - profile.depth) * 0.012);
      const direction = parseFloat(btn.dataset.swimDirection || "0") || 0;
      const motionState = btn.dataset.motionState || "dart";
      const swimEnergy = parseFloat(btn.dataset.swimEnergy || "0.48") || 0.48;
      const slot = patch.getSchoolSlot(btn);
      const floatBias = slot.floatBias || 1;
      const turnLean = motionState === "turn" ? direction * (1.9 + swimEnergy * 1.3) : 0;
      const rotateY = ((x - 50) / 50) * 0.42 + direction * (0.14 + profile.depth * 0.38 + swimEnergy * 0.24) + turnLean;
      const rotateZ = motionState === "turn"
        ? direction * -(0.28 + swimEnergy * 0.32)
        : Math.sin((Date.now() / (3100 - swimEnergy * 420)) + index) * (0.10 + swimEnergy * 0.13) * floatBias;
      const isSoftCruise = motionState === "hover" || motionState === "orbit-hover" || motionState === "orbit";
      const currentDrift = Math.sin((Date.now() / (3200 + index * 360 - swimEnergy * 180)) + index) * (isSoftCruise ? 0.36 : 0.30) * floatBias;
      const lift = (1 - profile.depth) * 0.38 - hide * 0.55 + currentDrift;
      const moveTransition = btn.dataset.fishId === "beodeulchi"
        ? "left 4800ms cubic-bezier(.42,0,.16,1), top 6900ms cubic-bezier(.38,0,.18,1), "
        : "";
      const transition = `${moveTransition}transform 2600ms ease-in-out, opacity 2400ms ease-in-out, filter 2400ms ease-in-out`;

      patch.applyFishViewset(btn, profile, x, y);

      btn.dataset.depth = profile.depth.toFixed(3);
      btn.dataset.hideAmount = hide.toFixed(3);
      btn.dataset.depthSpeed = profile.speed.toFixed(3);
      btn.style.setProperty("--surface-ripple-opacity", (0.24 - profile.depth * 0.10 - hide * 0.08).toFixed(2));
      btn.style.setProperty("--surface-ripple-scale", (0.82 + profile.depth * 0.22).toFixed(2));
      btn.style.setProperty("--surface-lens-opacity", patch.clamp(0.24 - profile.depth * 0.20 - hide * 0.08, 0.05, 0.24).toFixed(2));
      btn.style.setProperty("--surface-lens-tilt", `${(direction * 1.4 + Math.sin(Date.now() / 2200 + index) * 1.2).toFixed(1)}deg`);
      btn.style.setProperty("--surface-caustic-speed", `${(5.8 + index * 0.7).toFixed(1)}s`);
      const view = btn.dataset.fishView || "right";
      const isAngled = view === "frontLeft" || view === "frontRight";
      const bodyWidth = isAngled ? 43 : 66;
      const bodyHeight = isAngled ? 23 : 18;
      btn.style.setProperty("--fish-body-light-w", `${Math.round(bodyWidth * (0.92 + profile.depth * 0.18))}px`);
      btn.style.setProperty("--fish-body-light-h", `${Math.round(bodyHeight * (0.92 + profile.depth * 0.15))}px`);
      btn.style.setProperty("--fish-body-shadow-w", `${Math.round((bodyWidth + 8) * (0.92 + profile.depth * 0.18))}px`);
      btn.style.setProperty("--fish-body-shadow-h", `${Math.round((bodyHeight * 0.55 + 5) * (0.92 + profile.depth * 0.12))}px`);
      btn.style.setProperty("--fish-body-light-opacity", patch.clamp(0.10 + (1 - profile.depth) * 0.08 - hide * 0.04, 0.06, 0.18).toFixed(2));
      btn.style.setProperty("--fish-body-shadow-opacity", patch.clamp(0.12 + profile.depth * 0.08 - hide * 0.04, 0.08, 0.22).toFixed(2));
      btn.style.setProperty("--fish-body-yaw", `${patch.clamp(direction * (isAngled ? 3.4 : 1.6) + rotateY * 0.22, -4.8, 4.8).toFixed(1)}deg`);
      btn.style.setProperty("--fish-pitch", `${patch.clamp((0.5 - profile.depth) * 1.2 + Math.sin(Date.now() / 2600 + index) * 0.25, -1.2, 1.2).toFixed(1)}deg`);
      btn.style.setProperty("--fish-body-roundness", `${(isAngled ? 0.985 : 1.015).toFixed(3)}`);
      btn.style.zIndex = String(14 + Math.round(profile.depth * 42) + index);
      btn.style.transition = transition;
      btn.style.transform = [
        "translate(-50%,-50%)",
        `translateY(${lift.toFixed(1)}px)`,
        `translateZ(${profile.z}px)`,
        `rotateY(${rotateY.toFixed(1)}deg)`,
        `rotateZ(${rotateZ.toFixed(1)}deg)`,
        `scale(${hiddenScale.toFixed(3)})`
      ].join(" ");

      // 한글 리마크: 이동 에너지에 맞춰 꼬리 박자와 몸통 굽힘을 같이 바꿔 실제 유영처럼 보이게 한다.
      const stateBoost = motionState === "turn" ? 0.58 : motionState === "hide-pass" ? 0.40 : motionState === "orbit" ? 0.18 : -0.08;
      const tailSwing = patch.clamp(1.45 + swimEnergy * 1.28 + profile.speed * 0.24 + stateBoost, 1.35, 3.95);
      const bodySwing = tailSwing * patch.clamp(0.13 + swimEnergy * 0.06, 0.13, 0.21);
      const headSwing = tailSwing * patch.clamp(-0.045 - swimEnergy * 0.035, -0.085, -0.045);
      btn.style.setProperty("--tail-swing", `${tailSwing.toFixed(2)}deg`);
      btn.style.setProperty("--tail-swing-neg", `${(-tailSwing).toFixed(2)}deg`);
      btn.style.setProperty("--tail-swing-mid", `${(tailSwing * 0.48).toFixed(2)}deg`);
      btn.style.setProperty("--tail-swing-mid-neg", `${(-tailSwing * 0.48).toFixed(2)}deg`);
      btn.style.setProperty("--body-swing", `${bodySwing.toFixed(2)}deg`);
      btn.style.setProperty("--body-swing-neg", `${(-bodySwing).toFixed(2)}deg`);
      btn.style.setProperty("--head-swing", `${headSwing.toFixed(2)}deg`);
      btn.style.setProperty("--head-swing-neg", `${(-headSwing).toFixed(2)}deg`);
      btn.style.setProperty("--tail-beat-speed", `${patch.clamp(1.92 - swimEnergy * 0.52 - profile.speed * 0.10, 1.12, 2.05).toFixed(2)}s`);
      btn.style.setProperty("--body-beat-speed", `${patch.clamp(2.34 - swimEnergy * 0.34 - profile.speed * 0.08, 1.72, 2.48).toFixed(2)}s`);
      btn.style.setProperty("--head-beat-speed", `${patch.clamp(2.62 - swimEnergy * 0.22, 2.05, 2.72).toFixed(2)}s`);

      const fishImages = Array.from(btn.querySelectorAll("img"));
      fishImages.forEach((imgNode) => {
        imgNode.style.transition = transition;
        imgNode.style.opacity = imgNode.classList.contains("fishSpriteBase") ? "0" : opacity.toFixed(2);
        imgNode.style.filter = [
          `brightness(${profile.brightness.toFixed(2)})`,
          `contrast(${(profile.contrast * causticBoost).toFixed(2)})`,
          `saturate(${profile.saturation.toFixed(2)})`,
          `blur(${blur.toFixed(2)}px)`,
          `drop-shadow(${Math.round((x - 50) * -0.02)}px ${Math.round(3 + profile.depth * 5)}px ${Math.round(8 + profile.depth * 8)}px rgba(0,0,0,${(0.08 + profile.depth * 0.10).toFixed(2)}))`
        ].join(" ");
      });
    },
    wrapFishLayerBuilder() {
      if (typeof window.buildFishLayer !== "function" || window.__pongdangAutoPatchFishWrap === true) return;
      window.__pongdangAutoPatchFishWrap = true;
      const originalBuildFishLayer = window.buildFishLayer;
      window.buildFishLayer = function patchedBuildFishLayer() {
        const result = originalBuildFishLayer.apply(this, arguments);
        patch.lastAppliedKey = "";
        patch.ensureUpperBeodeulchiSchool();
        patch.scheduleVisualTuning();
        return result;
      };
    },
    wrapLegacyDepthCalibrators() {
      if (window.__pongdangAutoPatchDepthWrap === true) return;
      window.__pongdangAutoPatchDepthWrap = true;
      for (const name of ["calibrateAquarium3DViewV435", "applyFishDepthStyleV435", "clampFishLayout"]) {
        if (typeof window[name] !== "function") continue;
        const original = window[name];
        window[name] = function patchedLegacyDepthFunction() {
          if (name === "clampFishLayout" && patch.hasUpperBeodeulchiSchool()) {
            patch.restoreFishPositions();
            patch.lastAppliedKey = "";
            patch.scheduleVisualTuning();
            return true;
          }
          const result = original.apply(this, arguments);
          patch.lastAppliedKey = "";
          patch.ensureUpperBeodeulchiSchool();
          patch.scheduleVisualTuning();
          return result;
        };
      }
    },
    bindViewportRefresh() {
      if (window.__pongdangAutoPatchViewportBound === true) return;
      window.__pongdangAutoPatchViewportBound = true;
      const rerun = () => {
        patch.lastAppliedKey = "";
        patch.syncAllAquariumDecorBounds();
        patch.scheduleVisualTuning();
      };
      window.addEventListener("resize", rerun, { passive: true });
      window.addEventListener("orientationchange", rerun, { passive: true });
    },
    randomBetween(range) {
      return range[0] + Math.random() * (range[1] - range[0]);
    },
    getSchoolSlot(btn) {
      const index = parseInt(btn?.dataset?.schoolIndex || "0", 10) || 0;
      return BEODEULCHI_SCHOOL_V454[index] || BEODEULCHI_SCHOOL_V454[0];
    },
    rangeCenter(range) {
      return (range[0] + range[1]) / 2;
    },
    getOrbitConfig(slot, index) {
      const xRange = slot.xRange || BEODEULCHI_BEHAVIOR_V451.xRange;
      const yRange = slot.yRange || BEODEULCHI_BEHAVIOR_V451.yRange;
      const width = Math.max(12, (xRange[1] - xRange[0]) * (0.34 + index * 0.025));
      // 한글 리마크: 상하 유영은 크게 튀지 않도록 타원 높이를 줄이고 부드러운 부력감만 남긴다.
      const height = Math.max(3.0, (yRange[1] - yRange[0]) * (0.24 + index * 0.010));
      const centerX = patch.clamp(patch.rangeCenter(xRange) + Math.sin(index * 1.7) * 7, xRange[0] + width * 0.55, xRange[1] - width * 0.55);
      const centerY = patch.clamp(patch.rangeCenter(yRange) + Math.cos(index * 1.3) * 2.4, yRange[0] + height * 0.55, yRange[1] - height * 0.55);
      const clockwise = index % 2 === 0 ? 1 : -1;
      return { xRange, yRange, centerX, centerY, width, height, clockwise };
    },
    seedOrbitState(btn, slot, index) {
      if (btn.dataset.orbitAngle) return;
      const currentX = parseFloat(btn.style.left);
      const currentY = parseFloat(btn.style.top);
      const orbit = patch.getOrbitConfig(slot, index);
      const seededAngle = Number.isFinite(currentX) && Number.isFinite(currentY)
        ? Math.atan2((currentY - orbit.centerY) / orbit.height, (currentX - orbit.centerX) / orbit.width)
        : (index * 1.37 + Math.random() * 0.7);
      btn.dataset.orbitAngle = String(seededAngle);
      btn.dataset.orbitClockwise = String(orbit.clockwise);
    },
    getEntryPlan(slot) {
      const rightPlan = BEODEULCHI_RIGHT_ENTRY_V463[slot.key];
      const yRange = slot.yRange || [28, 58];
      const entryY = patch.randomBetween([Math.max(22, yRange[0] - 3), Math.min(70, yRange[1] + 3)]);
      if (rightPlan && Math.random() < 0.5) {
        return { side: "right", ...rightPlan, entryY };
      }
      return {
        side: "left",
        entryX: slot.entryX ?? slot.x,
        entryY,
        view: "right",
        direction: 1
      };
    },
    getActiveZoneKey() {
      const activeZone = document.querySelector(".zoneBtn.is-active[data-zone]");
      return activeZone ? activeZone.dataset.zone : "upper";
    },
    hasUpperBeodeulchiSchool() {
      if (patch.getActiveZoneKey() !== "upper") return false;
      return document.querySelectorAll('#fishLayer .fishBtn[data-fish-id="beodeulchi"][data-school-id]').length === BEODEULCHI_SCHOOL_V454.length;
    },
    preserveFishPosition(btn) {
      if (!btn) return;
      btn.dataset.lockedX = btn.style.left || "";
      btn.dataset.lockedY = btn.style.top || "";
    },
    restoreFishPositions() {
      document.querySelectorAll('#fishLayer .fishBtn[data-fish-id="beodeulchi"][data-school-id]').forEach((btn) => {
        if (btn.dataset.lockedX) btn.style.left = btn.dataset.lockedX;
        if (btn.dataset.lockedY) btn.style.top = btn.dataset.lockedY;
      });
    },
    makeBeodeulchiButton(slot, index) {
      const btn = document.createElement("button");
      const img = document.createElement("img");
      const viewset = FISH_VIEWSET_V450.beodeulchi;
      const entryPlan = patch.getEntryPlan(slot);
      btn.type = "button";
      btn.className = "fishBtn";
      btn.dataset.fishId = "beodeulchi";
      btn.dataset.schoolId = slot.key;
      btn.dataset.schoolIndex = String(index);
      btn.dataset.viewset = "beodeulchi";
      btn.dataset.entrySide = entryPlan.side;
      btn.dataset.preferredView = entryPlan.view;
      btn.dataset.fishView = entryPlan.view;
      btn.dataset.swimDirection = String(entryPlan.direction);
      btn.dataset.depthBias = String(patch.rangeCenter(slot.depthRange).toFixed(3));
      btn.dataset.speedBias = String(slot.speedBias || 1);
      btn.dataset.rhythmBias = String(slot.rhythmBias || 1);
      btn.dataset.motionState = "entry";
      btn.dataset.entering = "1";
      btn.dataset.entryTargetX = String(patch.randomBetween([slot.xRange[0], slot.xRange[1]]).toFixed(1));
      btn.dataset.entryTargetY = String(patch.randomBetween(slot.yRange).toFixed(1));
      btn.dataset.orbitAngle = String((index * 1.37 + Math.random() * 0.55).toFixed(3));
      btn.dataset.orbitClockwise = String(index % 2 === 0 ? 1 : -1);
      btn.setAttribute("aria-label", `버들치 ${index + 1}`);
      btn.style.left = `${entryPlan.entryX}%`;
      btn.style.top = `${entryPlan.entryY}%`;
      img.className = "fishSpriteBase";
      img.src = new URL(viewset[entryPlan.view], document.baseURI).href;
      img.alt = "버들치";
      img.decoding = "async";
      img.loading = "eager";
      img.style.width = `${slot.width}px`;
      btn.replaceChildren(img);
      return btn;
    },
    ensureUpperBeodeulchiSchool() {
      if (patch.getActiveZoneKey() !== "upper") return false;
      const fishLayer = document.getElementById("fishLayer");
      if (!fishLayer) return false;
      const currentSchool = Array.from(fishLayer.querySelectorAll('.fishBtn[data-fish-id="beodeulchi"][data-school-id]'));
      const otherFish = Array.from(fishLayer.querySelectorAll('.fishBtn:not([data-fish-id="beodeulchi"]), .fishBtn[data-fish-id="beodeulchi"]:not([data-school-id])'));
      const needsRebuild = currentSchool.length !== BEODEULCHI_SCHOOL_V454.length || otherFish.length > 0;
      if (!needsRebuild) return false;
      patch.schoolTimers.forEach((timer) => window.clearTimeout(timer));
      patch.schoolTimers.clear();
      fishLayer.replaceChildren(...BEODEULCHI_SCHOOL_V454.map((slot, index) => patch.makeBeodeulchiButton(slot, index)));
      patch.lastAppliedKey = "";
      patch.queueBeodeulchiEntrySchool();
      return true;
    },
    pickBeodeulchiTarget(btn) {
      const behavior = BEODEULCHI_BEHAVIOR_V451;
      const slot = patch.getSchoolSlot(btn);
      const currentX = parseFloat(btn.style.left) || 18;
      const currentY = parseFloat(btn.style.top) || 26;
      const previousDirection = parseFloat(btn.dataset.swimDirection || "1") || 1;
      const schoolIndex = parseInt(btn.dataset.schoolIndex || "0", 10) || 0;
      let direction = previousDirection;
      let turning = false;

      const xRange = slot.xRange || behavior.xRange;
      const yRangeBase = slot.yRange || behavior.yRange;
      const depthRange = slot.depthRange || [0.34, 0.66];
      const isHideCandidate = schoolIndex === 2 || schoolIndex === 3;
      const isHover = Math.random() < 0.36;
      const isHidePass = isHideCandidate && Math.random() < behavior.hidePassChance;
      const yRange = isHidePass ? behavior.hidePassYRange : yRangeBase;
      patch.seedOrbitState(btn, slot, schoolIndex);
      const orbit = patch.getOrbitConfig(isHidePass ? { ...slot, yRange } : slot, schoolIndex);
      const clockwise = parseFloat(btn.dataset.orbitClockwise || String(orbit.clockwise)) || orbit.clockwise;
      const currentAngle = parseFloat(btn.dataset.orbitAngle || "0") || 0;
      const step = patch.randomBetween([0.42, 0.74]) * clockwise * (slot.speedBias || 1);
      const nextAngle = currentAngle + step;
      let targetX = orbit.centerX + Math.cos(nextAngle) * orbit.width;
      let targetY = orbit.centerY + Math.sin(nextAngle) * orbit.height;
      const orbitWobble = Math.sin(Date.now() / 1200 + schoolIndex) * 0.7;
      targetX = patch.clamp(targetX + orbitWobble, xRange[0], xRange[1]);
      targetY = patch.clamp(targetY + Math.cos(nextAngle * 1.3 + schoolIndex) * 0.35, yRange[0], yRange[1]);
      if (Number.isFinite(currentY)) {
        const maxVerticalStep = isHover ? 2.2 : isHidePass ? 4.2 : 3.0;
        const blendedY = currentY * 0.58 + targetY * 0.42;
        // 한글 리마크: 한 번에 위아래로 확 움직이지 않게 현재 y와 목표 y를 섞고 이동폭을 제한한다.
        targetY = patch.clamp(blendedY, currentY - maxVerticalStep, currentY + maxVerticalStep);
        targetY = patch.clamp(targetY, yRange[0], yRange[1]);
      }
      let moveDistance = Math.hypot(targetX - currentX, targetY - currentY);

      for (let attempts = 0; attempts < 4 && moveDistance < 7; attempts += 1) {
        const retryAngle = nextAngle + step * (attempts + 1) * 0.7;
        targetX = patch.clamp(orbit.centerX + Math.cos(retryAngle) * orbit.width, xRange[0], xRange[1]);
        targetY = patch.clamp(orbit.centerY + Math.sin(retryAngle) * orbit.height * 0.72, yRange[0], yRange[1]);
        moveDistance = Math.hypot(targetX - currentX, targetY - currentY);
        btn.dataset.orbitAngle = String(retryAngle.toFixed(3));
      }

      const nextDirection = targetX >= currentX ? 1 : -1;
      turning = nextDirection !== previousDirection && Math.abs(targetX - currentX) > 2.2;
      direction = nextDirection;
      const depthCenter = patch.rangeCenter(depthRange);
      const verticalInfluence = patch.clamp((targetY - yRange[0]) / ((yRange[1] - yRange[0]) || 1), 0, 1);
      const nearArc = patch.clamp((Math.sin(nextAngle) + 1) / 2, 0, 1);
      const depthBias = patch.clamp(depthCenter * 0.34 + depthRange[0] * 0.24 + depthRange[1] * 0.18 + verticalInfluence * 0.10 + nearArc * 0.22, depthRange[0], depthRange[1]);
      const speedBias = slot.speedBias || 1;
      const rhythmBias = slot.rhythmBias || 1;
      const depthSpeed = patch.clamp(0.9 + depthBias * 0.34, 0.86, 1.18);
      // 한글 리마크: 앞쪽/중층 개체는 활발하게, 상층 개체는 약간 느리게 남겨 같은 무리가 아니라 각각 살아 움직이는 느낌을 만든다.
      const baseDuration = turning ? patch.randomBetween([5600, 8600]) : patch.randomBetween(isHover ? [5000, 7200] : isHidePass ? [3800, 5600] : [3900, 6100]);
      const distanceDuration = moveDistance * (isHover ? 178 : 142);
      const turnSlowdown = turning ? 1.24 : 1;
      const duration = Math.round((baseDuration + distanceDuration) * turnSlowdown * rhythmBias * (1 + schoolIndex * 0.04) / (speedBias * depthSpeed));
      const pause = Math.round(patch.randomBetween([80, 420]) * rhythmBias * (0.86 + schoolIndex * 0.04) * (turning ? 0.58 : 1));
      const state = turning ? "turn" : isHover ? "orbit-hover" : isHidePass ? "hide-pass" : "orbit";
      const swimEnergy = patch.clamp((moveDistance / 18) * 0.46 + (isHidePass ? 0.30 : 0) + (turning ? 0.18 : 0) + (isHover ? -0.06 : 0) + depthSpeed * 0.18 + (speedBias - 1) * 0.10, 0.24, 0.94);
      btn.dataset.orbitAngle = String(nextAngle.toFixed(3));

      return { x: targetX, y: targetY, depthBias, direction, duration, pause, state, swimEnergy };
    },
    moveBeodeulchiOnce() {
      const btn = document.querySelector('#fishLayer .fishBtn[data-fish-id="beodeulchi"]');
      if (!btn || document.body.dataset.appMode !== "aquarium") {
        patch.queueBeodeulchiMove(900);
        return;
      }

      const target = patch.pickBeodeulchiTarget(btn);
      btn.dataset.swimDirection = String(target.direction);
      btn.dataset.motionState = target.state;
      btn.dataset.depthBias = target.depthBias.toFixed(3);
      btn.dataset.swimEnergy = target.swimEnergy.toFixed(3);
      btn.style.transition = [
        `left ${target.duration}ms cubic-bezier(.46,0,.14,1)`,
        `top ${Math.round(target.duration * 1.42)}ms cubic-bezier(.38,0,.18,1)`,
        `transform ${target.state === "turn" ? 5600 : 3100}ms ease-in-out`,
        "opacity 2400ms ease-in-out",
        "filter 2400ms ease-in-out"
      ].join(", ");
      btn.style.left = `${target.x.toFixed(1)}%`;
      btn.style.top = `${target.y.toFixed(1)}%`;
      patch.preserveFishPosition(btn);

      patch.lastAppliedKey = "";
      patch.scheduleVisualTuning();
      window.setTimeout(() => {
        patch.lastAppliedKey = "";
        patch.scheduleVisualTuning();
      }, target.duration + 40);
      patch.queueBeodeulchiMove(target.duration + target.pause);
    },
    moveBeodeulchiSchoolMember(btn) {
      if (!btn || !btn.isConnected || document.body.dataset.appMode !== "aquarium") {
        patch.queueBeodeulchiMember(btn, 1200);
        return;
      }
      const target = patch.pickBeodeulchiTarget(btn);
      btn.dataset.swimDirection = String(target.direction);
      btn.dataset.motionState = target.state;
      btn.dataset.depthBias = target.depthBias.toFixed(3);
      btn.dataset.swimEnergy = target.swimEnergy.toFixed(3);
      btn.style.transition = [
        `left ${target.duration}ms cubic-bezier(.46,0,.14,1)`,
        `top ${Math.round(target.duration * 1.42)}ms cubic-bezier(.38,0,.18,1)`,
        `transform ${target.state === "turn" ? 5600 : 3100}ms ease-in-out`,
        "opacity 2400ms ease-in-out",
        "filter 2400ms ease-in-out"
      ].join(", ");
      btn.style.left = `${target.x.toFixed(1)}%`;
      btn.style.top = `${target.y.toFixed(1)}%`;
      patch.preserveFishPosition(btn);
      patch.lastAppliedKey = "";
      patch.scheduleVisualTuning();
      window.setTimeout(() => {
        patch.lastAppliedKey = "";
        patch.scheduleVisualTuning();
      }, target.duration + 40);
      patch.queueBeodeulchiMember(btn, target.duration + target.pause);
    },
    queueBeodeulchiMember(btn, delay) {
      if (!btn) return;
      const key = btn.dataset.schoolId || btn.dataset.schoolIndex || "single";
      const previous = patch.schoolTimers.get(key);
      if (previous) window.clearTimeout(previous);
      const timer = window.setTimeout(() => {
        patch.schoolTimers.delete(key);
        patch.moveBeodeulchiSchoolMember(btn);
      }, delay);
      patch.schoolTimers.set(key, timer);
    },
    queueBeodeulchiSchool() {
      const members = Array.from(document.querySelectorAll('#fishLayer .fishBtn[data-fish-id="beodeulchi"][data-school-id]'));
      members.forEach((btn, index) => {
        const slot = BEODEULCHI_SCHOOL_V454[index] || BEODEULCHI_SCHOOL_V454[0];
        patch.queueBeodeulchiMember(btn, slot.delay);
      });
    },
    enterBeodeulchiMember(btn) {
      if (!btn || !btn.isConnected) return;
      const slot = patch.getSchoolSlot(btn);
      const index = parseInt(btn.dataset.schoolIndex || "0", 10) || 0;
      const targetX = parseFloat(btn.dataset.entryTargetX || String(slot.x));
      const targetY = parseFloat(btn.dataset.entryTargetY || String(slot.y));
      const distance = Math.abs(targetX - (parseFloat(btn.style.left) || 0));
      const speedBias = slot.speedBias || 1;
      const rhythmBias = slot.rhythmBias || 1;
      const entrySpeed = slot.entrySpeed || 1;
      const entryVariance = patch.randomBetween([0.88, 1.16]);
      const duration = Math.round((9800 + distance * 120 + index * 850) * rhythmBias * entryVariance / (speedBias * entrySpeed));
      const direction = parseFloat(btn.dataset.swimDirection || "1") || 1;
      btn.dataset.motionState = "entry";
      btn.dataset.swimEnergy = "0.28";
      btn.dataset.preferredView = patch.getHeadForwardView(direction, false);
      btn.style.transition = [
        `left ${duration}ms cubic-bezier(.28,0,.16,1)`,
        `top ${Math.round(duration * 1.22)}ms cubic-bezier(.38,0,.18,1)`,
        "transform 2600ms ease-in-out",
        "opacity 2400ms ease-in-out",
        "filter 2400ms ease-in-out"
      ].join(", ");
      btn.style.left = `${targetX}%`;
      btn.style.top = `${targetY}%`;
      patch.preserveFishPosition(btn);
      patch.lastAppliedKey = "";
      patch.scheduleVisualTuning();
      window.setTimeout(() => {
        delete btn.dataset.entering;
        delete btn.dataset.entryTargetX;
        delete btn.dataset.entryTargetY;
        btn.dataset.preferredView = patch.getHeadForwardView(btn.dataset.swimDirection || slot.direction || 1, false);
        btn.dataset.motionState = "hover";
        patch.lastAppliedKey = "";
        patch.scheduleVisualTuning();
        patch.queueBeodeulchiMember(btn, 900 + index * 500);
      }, duration + 80);
    },
    queueBeodeulchiEntrySchool() {
      const members = Array.from(document.querySelectorAll('#fishLayer .fishBtn[data-fish-id="beodeulchi"][data-school-id]'));
      let nextDelay = 800;
      members.forEach((btn, index) => {
        const slot = BEODEULCHI_SCHOOL_V454[index] || BEODEULCHI_SCHOOL_V454[0];
        nextDelay += Math.round(patch.randomBetween([4200, 8200]));
        const timer = window.setTimeout(() => patch.enterBeodeulchiMember(btn), nextDelay);
        patch.schoolTimers.set(`entry-${slot.key}`, timer);
      });
    },
    queueBeodeulchiMove(delay) {
      if (patch.routeTimer) window.clearTimeout(patch.routeTimer);
      patch.routeTimer = window.setTimeout(() => {
        patch.routeTimer = 0;
        patch.moveBeodeulchiOnce();
      }, delay);
    },
    installBehaviorScheduler() {
      if (window.__pongdangBeodeulchiBehaviorV451 === true) return;
      window.__pongdangBeodeulchiBehaviorV451 = true;
      window.BEODEULCHI_BEHAVIOR_V451 = BEODEULCHI_BEHAVIOR_V451;
      window.BEODEULCHI_SCHOOL_V454 = BEODEULCHI_SCHOOL_V454;
      patch.ensureUpperBeodeulchiSchool();
      if (!patch.hasUpperBeodeulchiSchool()) patch.queueBeodeulchiSchool();
    }
  };

  window.FISH_VIEWSET_V450 = FISH_VIEWSET_V450;
  window.BEODEULCHI_BEHAVIOR_V451 = BEODEULCHI_BEHAVIOR_V451;
  window.BEODEULCHI_SCHOOL_V454 = BEODEULCHI_SCHOOL_V454;
  window.PONDANG_AUTO_PATCH = patch;

  function runPatch() {
    try {
      patch.apply();
    } catch (error) {
      console.warn("[auto-patch] failed:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runPatch, { once: true });
  } else {
    runPatch();
  }
})();

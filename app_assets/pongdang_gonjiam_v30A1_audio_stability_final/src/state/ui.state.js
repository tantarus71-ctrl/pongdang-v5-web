/* v29 UI 상태 관리 기준
   모든 패널/팝업은 UI_STATE와 open/close 함수로 단일 관리한다.
   activePanel: explore | dex | mission | camera | feature | null
   activePopup: fish | card | acquire | capture | gps | audio | null
   새 기능 추가 시 index.html이 아니라 해당 ui 모듈과 UI_STATE 규칙을 따른다. */
export const UI_STATE_SCHEMA = {
  activePanel: null,
  activePopup: null,
  activeSpeciesId: null,
  activeCaptureId: null,
  audioPlaying: false,
  captureInProgress: false,
  gpsChecking: false
};

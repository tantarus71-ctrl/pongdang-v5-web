// v26 음성 설명 데이터 분리 기준 파일입니다.
// 실제 mp3가 준비되면 audioPath에 경로를 넣고, 비어 있으면 브라우저 TTS fallback을 사용합니다.
export const AUDIO_CONFIG_VERSION = 'v30A-1-audio-stability-schema';
export const AUDIO_SCRIPT_DATABASE = {
  zone_utmul: { title: '웃물 설명', emoji: '💧', text: '여기는 웃물이에요. 물이 얕고 맑아서 작은 물고기들이 살기 좋아요.', audioPath: null },
  zone_yeoul: { title: '여울 설명', emoji: '🌊', text: '여기는 여울이에요. 물살이 반짝이며 흐르고, 물고기들이 물살을 타고 지나가요.', audioPath: null },
  zone_janyeoul: { title: '잔여울 설명', emoji: '🍃', text: '여기는 잔여울이에요. 수초가 많고 물살이 부드러워 차분히 관찰하기 좋아요.', audioPath: null },
  zone_gipmul: { title: '깊물 설명', emoji: '🪨', text: '여기는 깊물이에요. 조금 더 깊고 조용해서 물고기가 천천히 움직여요.', audioPath: null },
  zone_mulmoi: { title: '물모이 설명', emoji: '🌿', text: '여기는 물모이예요. 물길이 모여 수초와 작은 생물이 많이 모여요.', audioPath: null },
  species_beodeulchi: { title: '버들치 설명', emoji: '🐟', text: '버들치는 맑은 하천에서 사는 작은 민물고기예요. 친구들과 함께 물살을 타고 헤엄쳐요.', audioPath: null },
  mission_intro: { title: '미션 설명', emoji: '🎯', text: '미션은 오늘의 관찰 놀이예요. 물고기를 찾으면 진행 막대가 채워져요.', audioPath: null },
  dex_intro: { title: '도감 설명', emoji: '📖', text: '도감에는 내가 발견한 물고기 카드가 모여요. 아직 못 찾은 물고기는 수족관에서 찾아보세요.', audioPath: null }
};

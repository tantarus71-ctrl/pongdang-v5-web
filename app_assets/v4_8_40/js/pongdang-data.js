// 퐁당퐁당 v4.8.57 경량 데이터 모듈
// 한글 주석: 화면 데이터와 어종 데이터를 HTML에서 분리해 index 파일을 가볍게 유지한다.
// 한글 주석: v4.8.57에서는 아이들이 바로 이해하도록 문구를 더 짧고 행동 중심으로 다듬었다.

export const ZONES = [
  { id: 'upper', name: '웃물', emoji: '💧', title: '웃물 탐험', desc: '맑은 물에서 작은 물고기를 찾아요.' },
  { id: 'riffle', name: '여울', emoji: '〰️', title: '여울 탐험', desc: '반짝이는 물살 속 친구를 찾아요.' },
  { id: 'run', name: '잔여울', emoji: '🌿', title: '잔여울 탐험', desc: '수초와 돌 사이를 천천히 살펴요.' },
  { id: 'pool', name: '깊물', emoji: '🔵', title: '깊물 탐험', desc: '조용한 깊은 물을 들여다봐요.' },
  { id: 'confluence', name: '물모이', emoji: '🌀', title: '물모이 탐험', desc: '물이 만나는 자리에서 친구를 찾아요.' }
];

export const MENU = [
  { id: 'guide', buttonId: 'openGuide', emoji: '🫧', label: '탐험', sub: '물속' },
  { id: 'book', buttonId: 'openBook', emoji: '🐟', label: '도감', sub: '친구' },
  { id: 'rare', buttonId: 'openRare', emoji: '✨', label: '반짝', sub: '희귀' },
  { id: 'camera', buttonId: 'openCamera', emoji: '📷', label: '카메라', sub: '보기' }
];

export const FISH = [
  {
    id: 'beodeulchi',
    name: '버들치',
    zone: 'upper',
    summary: '맑은 물에서 빠르게 헤엄치는 친구',
    kid: '버들치는 맑은 물을 좋아해요. 물살이 있어도 몸을 살짝 틀며 빠르게 헤엄쳐요.',
    teacher: '버들치는 하천 상류와 여울에서 관찰되는 소형 어류로, 빠른 유영과 민첩한 방향 전환을 학습 요소로 활용할 수 있습니다.',
    img: '../assets/fish/beodeulchi/swim.svg',
    cardImg: '../assets/fish/beodeulchi/card.svg',
    popupImg: '../assets/fish/beodeulchi/popup.svg',
    x: 48,
    y: 46,
    speed: 1,
    scale: 0.86
  }
];

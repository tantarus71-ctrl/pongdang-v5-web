// 퐁당퐁당 v4.8.40 경량 데이터 모듈
// 한글 주석: 화면 데이터와 어종 데이터를 HTML에서 분리해 index 파일을 가볍게 유지한다.

export const ZONES = [
  { id: 'upper', name: '웃물', emoji: '💧', title: '웃물 민물 친구 탐험', desc: '맑은 물이 시작되는 곳에서 작은 친구들을 찾아요.' },
  { id: 'riffle', name: '여울', emoji: '〰️', title: '여울 물살 관찰', desc: '물살이 반짝이는 곳에서 빠르게 움직이는 친구를 봐요.' },
  { id: 'run', name: '잔여울', emoji: '🌿', title: '잔여울 느린 탐험', desc: '수초와 작은 돌 사이를 천천히 살펴요.' },
  { id: 'pool', name: '깊물', emoji: '🔵', title: '깊물 조용한 관찰', desc: '조금 깊은 곳의 그림자와 움직임을 봐요.' },
  { id: 'confluence', name: '물모이', emoji: '🌀', title: '물모이 만남의 자리', desc: '물이 만나는 곳에서 여러 친구를 만나요.' }
];

export const MENU = [
  { id: 'guide', buttonId: 'openGuide', emoji: '🫧', label: '탐험', sub: '물속보기' },
  { id: 'book', buttonId: 'openBook', emoji: '🐟', label: '도감', sub: '친구보기' },
  { id: 'rare', buttonId: 'openRare', emoji: '✨', label: '반짝', sub: '희귀찾기' },
  { id: 'camera', buttonId: 'openCamera', emoji: '📷', label: '카메라', sub: '비춰보기' }
];

export const FISH = [
  {
    id: 'beodeulchi',
    name: '버들치',
    zone: 'upper',
    summary: '맑은 물을 좋아하는 빠른 민물 친구',
    kid: '버들치는 맑은 물에서 빠르게 헤엄치는 작은 민물 친구예요. 물살이 있는 곳에서도 몸을 살짝 틀며 잘 움직여요.',
    teacher: '버들치는 하천 상류와 여울에서 관찰되는 소형 어류로, 빠른 유영과 민첩한 방향 전환을 학습 요소로 활용할 수 있습니다.',
    img: '../assets/fish/beodeulchi/swim.svg',
    cardImg: '../assets/fish/beodeulchi/card.svg',
    popupImg: '../assets/fish/beodeulchi/popup.svg',
    x: 48,
    y: 46,
    speed: 1,
    scale: 1
  }
];

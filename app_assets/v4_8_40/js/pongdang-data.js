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
    img: '../assets/fish/beodeulchi/cartoon_v1/swim_right_2.png',
    cardImg: '../assets/fish/beodeulchi/cartoon_v1/card.png',
    popupImg: '../assets/fish/beodeulchi/cartoon_v1/popup.png',
    x: 48,
    y: 46,
    speed: 1,
    scale: 0.86,
    depth: 0.72,
    aquariumInstances: [
      { instanceId: 'lead', x: 47, y: 48, depth: 0.78, scale: 0.92, speed: 1.02, swim: { phase: 0.3, xAmp: 20, yAmp: 9, roll: 3.6, tailRate: 8, idleEvery: 8.5, idleHold: 1.05, avoidRadius: 132 } },
      { instanceId: 'back-left', x: 27, y: 34, depth: 0.34, scale: 0.72, speed: 0.82, swim: { phase: 2.4, xAmp: 14, yAmp: 6, roll: 2.4, tailRate: 6, idleEvery: 10.2, idleHold: 1.35, avoidRadius: 118 } },
      { instanceId: 'mid-right', x: 68, y: 42, depth: 0.56, scale: 0.8, speed: 0.94, swim: { phase: 4.1, xAmp: 17, yAmp: 7, roll: 3, tailRate: 7, idleEvery: 9.2, idleHold: 1.2, avoidRadius: 126 } },
      { instanceId: 'front-pass', x: 57, y: 68, depth: 0.92, scale: 1.02, speed: 1.18, swim: { phase: 5.7, xAmp: 24, yAmp: 10, roll: 4.2, tailRate: 9, idleEvery: 7.8, idleHold: 0.85, avoidRadius: 150 } },
      { instanceId: 'bottom-scout', x: 35, y: 72, depth: 0.48, scale: 0.76, speed: 0.76, swim: { phase: 7.6, xAmp: 12, yAmp: 5, roll: 2.2, tailRate: 5, idleEvery: 11.5, idleHold: 1.55, avoidRadius: 110 } }
    ],
    swim: {
      phase: 0.3,
      xAmp: 18,
      yAmp: 8,
      roll: 3.5,
      tailRate: 8,
      idleEvery: 8.5,
      idleHold: 1.15,
      avoidRadius: 128
    },
    sprites: {
      left: [
        '../assets/fish/beodeulchi/cartoon_v1/swim_left_1.png',
        '../assets/fish/beodeulchi/cartoon_v1/swim_left_2.png',
        '../assets/fish/beodeulchi/cartoon_v1/swim_left_3.png'
      ],
      right: [
        '../assets/fish/beodeulchi/cartoon_v1/swim_right_1.png',
        '../assets/fish/beodeulchi/cartoon_v1/swim_right_2.png',
        '../assets/fish/beodeulchi/cartoon_v1/swim_right_3.png'
      ],
      frontLeft: [
        '../assets/fish/beodeulchi/cartoon_v1/front_left_1.png',
        '../assets/fish/beodeulchi/cartoon_v1/front_left_2.png',
        '../assets/fish/beodeulchi/cartoon_v1/front_left_3.png'
      ],
      frontRight: [
        '../assets/fish/beodeulchi/cartoon_v1/front_right_1.png',
        '../assets/fish/beodeulchi/cartoon_v1/front_right_2.png',
        '../assets/fish/beodeulchi/cartoon_v1/front_right_3.png'
      ],
      blinkOpen: '../assets/fish/beodeulchi/cartoon_v1/blink_open.png',
      blinkClosed: '../assets/fish/beodeulchi/cartoon_v1/blink_closed.png',
      fins: [
        '../assets/fish/beodeulchi/cartoon_v1/fin_layer_1.png',
        '../assets/fish/beodeulchi/cartoon_v1/fin_layer_2.png'
      ]
    }
  }
];

/* 퐁당퐁당 곤지암천 v30A-1 - 음성 안정화·중복재생 방지·TTS 우선 최적화 실행 스크립트 */
(() => {
  'use strict';
  const DEV_CACHE = window.PONGDANG_DEV_CACHE || String(Date.now());
  const freshUrl = (src) => {
    if (!src || src.startsWith('data:') || src.startsWith('blob:')) return src;
    return `${src}${src.includes('?') ? '&' : '?'}cache=${DEV_CACHE}`;
  };
  /* 파일 경로: 모든 존과 생태 요소는 독립 데이터에서 제어한다. */
  const ASSETS = {
    bodyRight:'assets/fish/beodeulchi/aquarium/beodeulchi_side_right.png',
    bodyLeft:'assets/fish/beodeulchi/aquarium/beodeulchi_side_left.png',
    quarterRight:'assets/fish/beodeulchi/aquarium/beodeulchi_quarter_right.png',
    quarterLeft:'assets/fish/beodeulchi/aquarium/beodeulchi_quarter_left.png',
    front:'assets/fish/beodeulchi/aquarium/beodeulchi_front_angle.png',
    tailIdle:'assets/fish/beodeulchi/aquarium/beodeulchi_tail_idle.png',
    tailLeft:'assets/fish/beodeulchi/aquarium/beodeulchi_tail_left.png',
    tailRight:'assets/fish/beodeulchi/aquarium/beodeulchi_tail_right.png'
  };

  /* v18 5존 독립 설정: 배경·유속·빛·수초·자갈·입자·물고기 규칙을 완전히 분리한다. */
  const ZONES = {
    utmul:{id:'utmul', name:'웃물', icon:'💧', desc:'얕고 맑은 상류', day:'assets/bg/upper/day.png', night:'assets/bg/upper/night.png', depth:[.30,.68], observeDepth:.88, flow:.35, light:.92, caustic:.30, plant:14, stone:18, particle:34, tone:['#7ee7ff','#d7f8ff'], fishCount:[4,6], behavior:{speed:[.18,.42], y:[.28,.64], patterns:['glide','s','ellipse']}},
    yeoul:{id:'yeoul', name:'여울', icon:'🌊', desc:'반짝이는 빠른 물살', day:'assets/bg/rapid/day.png', night:'assets/bg/rapid/night.png', depth:[.32,.72], observeDepth:.86, flow:.72, light:.86, caustic:.36, plant:20, stone:26, particle:48, tone:['#63dfff','#bdf3ff'], fishCount:[5,7], behavior:{speed:[.30,.70], y:[.30,.68], patterns:['s','arc','flow']}},
    janyeoul:{id:'janyeoul', name:'잔여울', icon:'🍃', desc:'부드러운 수중 정원', day:'assets/bg/soft-rapid/day.png', night:'assets/bg/soft-rapid/night.png', depth:[.36,.76], observeDepth:.86, flow:.48, light:.78, caustic:.24, plant:28, stone:20, particle:38, tone:['#74dec7','#d4f4e8'], fishCount:[5,7], behavior:{speed:[.22,.52], y:[.32,.68], patterns:['ellipse','circle','s']}},
    gipmul:{id:'gipmul', name:'깊물', icon:'🪨', desc:'깊고 고요한 물그늘', day:'assets/bg/deep/day.png', night:'assets/bg/deep/night.png', depth:[.42,.86], observeDepth:.84, flow:.24, light:.52, caustic:.15, plant:18, stone:30, particle:42, tone:['#275c8a','#9ec9e9'], fishCount:[3,5], behavior:{speed:[.14,.36], y:[.34,.70], patterns:['arc','deep','ellipse']}},
    mulmoi:{id:'mulmoi', name:'물모이', icon:'🌿', desc:'생명이 모이는 넓은 자리', day:'assets/bg/pool/day.png', night:'assets/bg/pool/night.png', depth:[.34,.82], observeDepth:.88, flow:.38, light:.68, caustic:.22, plant:34, stone:28, particle:58, tone:['#4bb8aa','#d1efd8'], fishCount:[6,8], behavior:{speed:[.18,.48], y:[.30,.70], patterns:['circle','ellipse','pause','s']}}
  };

  const SPECIES = {
    beodeulchi:{name:'버들치', layer:'중층~상층', text:'버들치는 맑은 하천의 중층에서 물살을 따라 부드럽게 헤엄치는 작은 민물고기예요. 몸은 길고 가늘며, 곤지암천의 맑은 구간에서 잘 어울려요.'}
  };

  /* v20: 수족관 안정화 후 확장될 전체 기능 데이터 자리 */
  const BUBBLE_PROFILES={
    utmul:{count:.72,size:[2.4,7.2],large:.18,opacity:[.28,.48],x:[[12,26],[68,86]],top:[70,110],drift:[-24,24],dur:[9,18]},
    yeoul:{count:.90,size:[2.6,8.6],large:.26,opacity:[.34,.56],x:[[30,44],[48,64],[58,76]],top:[64,112],drift:[-44,44],dur:[6.5,13]},
    janyeoul:{count:.78,size:[2.2,7.8],large:.20,opacity:[.30,.50],x:[[8,24],[72,92]],top:[66,112],drift:[-26,26],dur:[9,17]},
    gipmul:{count:.54,size:[2.0,6.6],large:.12,opacity:[.22,.40],x:[[14,28],[72,84]],top:[76,116],drift:[-18,18],dur:[12,23]},
    mulmoi:{count:.96,size:[2.4,8.2],large:.24,opacity:[.30,.54],x:[[8,22],[36,52],[68,90]],top:[62,114],drift:[-32,32],dur:[8,16]}
  };

  const FEATURE_MENUS = {
    explore:{icon:'🧭',title:'탐사',sub:'곤지암천 5존과 내 위치 탐사를 준비해요',rows:[['💧','5존 선택','웃물·여울·잔여울·깊물·물모이 독립 운영'],['📍','내 위치 보기','GPS는 탐사 메뉴 안에서 권한 안내 후 연결'],['🔊','존 설명 듣기','각 존의 물살·수초·물고기를 아이용 문장으로 안내']]},
    dex:{icon:'🐟',title:'도감',sub:'발견한 물고기를 모아 보는 곳',rows:[['📖','발견한 물고기','클릭한 어종은 컬러 카드로 저장'],['🌫️','아직 못 찾은 물고기','미발견 어종은 실루엣으로 표시'],['🗂️','구간 필터','웃물/여울/잔여울/깊물/물모이별 보기']]},
    mission:{icon:'🎯',title:'미션',sub:'오늘의 관찰 과제를 완성해요',rows:[['✅','관찰 미션','앞으로 온 물고기를 눌러 미션 달성'],['🏞️','존별 미션','각 존 생태에 맞는 과제 제공'],['🎁','카드 보상','첫 발견과 미션 완료 시 획득 카드 표시']]},
    camera:{icon:'📷',title:'카메라',sub:'관찰 순간을 사진처럼 남겨요',rows:[['📸','수족관 캡처','현재 수조 장면 저장 자리'],['📝','관찰 기록','발견한 물고기와 존 기록'],['📍','탐사 위치','실제 GPS 연동은 후순위로 예약']]}
  };
  const CARD_DATABASE = {
    beodeulchi:{name:'버들치',emoji:'🐟',lines:['맑은 물을 좋아해요.','친구들과 무리 지어 다녀요.','물살을 타고 부드럽게 움직여요.']}
  };
  const DEX_CARDS=[
    {id:'beodeulchi',name:'버들치',type:'민물고기',rarity:'normal',rarityLabel:'보통',acquired:false,zones:['웃물','여울','잔여울'],img:ASSETS.bodyRight,habitat:'맑고 흐름이 있는 하천의 중·상류',feature:'작은 몸으로 물살을 타며 무리 지어 움직여요.',point:'앞쪽으로 나온 버들치를 누르면 자세히 볼 수 있어요.'},
    {id:'piramii',name:'피라미',type:'민물고기',rarity:'common',rarityLabel:'흔함',acquired:true,zones:['웃물','여울','물모이'],img:ASSETS.bodyRight,habitat:'햇빛이 드는 얕은 물과 여울 주변',feature:'무리 지어 빠르게 오가며 반짝이는 몸빛이 보여요.',point:'여울에서 빠르게 지나가는 작은 물고기를 찾아보세요.'},
    {id:'siri',name:'쉬리',type:'민물고기',rarity:'rare',rarityLabel:'희귀',acquired:false,zones:['여울','깊물'],img:ASSETS.bodyRight,habitat:'깨끗한 자갈 바닥과 물살 있는 곳',feature:'길고 날렵한 몸으로 자갈 사이를 빠르게 지나요.',point:'여울의 자갈 주변을 천천히 관찰해 보세요.'},
    {id:'gaksi',name:'각시붕어',type:'민물고기',rarity:'rare',rarityLabel:'희귀',acquired:true,zones:['잔여울','물모이'],img:ASSETS.bodyRight,habitat:'수초가 많은 잔잔한 물가',feature:'작고 예쁜 몸빛을 가진 토종 민물고기예요.',point:'수초가 흔들리는 곳을 자세히 보세요.'},
    {id:'morae',name:'모래무지',type:'민물고기',rarity:'normal',rarityLabel:'보통',acquired:false,zones:['깊물','물모이'],img:ASSETS.bodyRight,habitat:'모래와 자갈이 섞인 바닥 가까이',feature:'바닥 근처에서 먹이를 찾는 모습이 보여요.',point:'깊물의 바닥 쪽을 살펴보세요.'},
    {id:'bungeo',name:'붕어',type:'민물고기',rarity:'common',rarityLabel:'흔함',acquired:true,zones:['물모이'],img:ASSETS.bodyRight,habitat:'물이 모이고 수초가 있는 곳',feature:'둥근 몸으로 천천히 움직이는 친숙한 물고기예요.',point:'물모이의 수초 뒤를 봐요.'},
    {id:'mil-eo',name:'밀어',type:'민물고기',rarity:'normal',rarityLabel:'보통',acquired:true,zones:['잔여울','물모이'],img:ASSETS.bodyRight,habitat:'자갈과 바위가 있는 얕은 바닥',feature:'바닥 가까이에서 살짝 멈추었다가 움직여요.',point:'바위 그림자 아래를 관찰해요.'},
    {id:'dongsa',name:'동사리',type:'민물고기',rarity:'rare',rarityLabel:'희귀',acquired:false,zones:['깊물','물모이'],img:ASSETS.bodyRight,habitat:'돌 틈과 그늘진 바닥 근처',feature:'잘 숨어 있다가 조용히 움직여요.',point:'어두운 돌 틈을 천천히 찾아보세요.'}
  ];


  /* v30B: 곤지암천 지명·5존 생태 스토리. 팝업/도감/미션/음성에서 공통 참조한다. */
  const ZONE_STORY_DATABASE = {
    utmul:{
      name:'웃물', emoji:'💧', oneLine:'맑고 얕아서 작은 물고기를 찾기 좋은 곳이에요.',
      story:'여기는 곤지암천의 웃물이에요. 물이 얕고 맑아서 바닥의 작은 자갈까지 잘 보여요. 작은 물고기들이 물살을 살짝 타며 지나가요.',
      observePoint:'자갈 사이를 천천히 살펴보세요. 작은 버들치가 지나갈 수 있어요.',
      audioScriptId:'zone_utmul', missions:['explore_utmul','observe_beodeulchi_1'],
      speciesStory:{beodeulchi:'버들치는 웃물에서 맑은 물살을 타고 조심스럽게 움직여요.',piramii:'피라미는 밝은 물속에서 은빛으로 반짝일 수 있어요.'}
    },
    yeoul:{
      name:'여울', emoji:'🌊', oneLine:'물살이 반짝이며 흐르는 곳이에요.',
      story:'여기는 여울이에요. 물이 자갈 사이를 지나며 반짝반짝 움직여요. 물살을 좋아하는 물고기들이 빠르게 지나갈 수 있어요.',
      observePoint:'반짝이는 물살 사이를 잘 보세요. 빠르게 지나가는 물고기를 찾을 수 있어요.',
      audioScriptId:'zone_yeoul', missions:['explore_yeoul'],
      speciesStory:{beodeulchi:'버들치는 여울에서 물살을 타고 방향을 살짝 바꾸며 지나가요.',piramii:'피라미는 빛을 받으면 몸이 반짝여요.',siri:'쉬리는 맑은 여울과 자갈이 있는 곳을 좋아해요.'}
    },
    janyeoul:{
      name:'잔여울', emoji:'🍃', oneLine:'물살이 부드럽고 수초가 흔들리는 곳이에요.',
      story:'여기는 잔여울이에요. 여울보다 물살이 조금 부드러워요. 수초 사이를 천천히 살펴보면 숨어 있던 물고기를 만날 수 있어요.',
      observePoint:'수초가 흔들리는 곳을 천천히 살펴보세요. 작은 물고기가 숨어 있을 수 있어요.',
      audioScriptId:'zone_janyeoul', missions:['explore_janyeoul'],
      speciesStory:{beodeulchi:'버들치는 잔여울에서 친구들과 함께 천천히 움직일 수 있어요.',gaksi:'각시붕어는 수초가 있는 곳에서 더 잘 어울려요.'}
    },
    gipmul:{
      name:'깊물', emoji:'🪨', oneLine:'조금 깊고 조용한 물속이에요.',
      story:'여기는 깊물이에요. 물이 조금 깊어서 빛이 천천히 내려와요. 큰 돌과 그림자 사이에 조용히 움직이는 물고기가 있을 수 있어요.',
      observePoint:'큰 돌 아래와 바닥 가까이를 살펴보세요. 숨어 있는 물고기가 보일 수 있어요.',
      audioScriptId:'zone_gipmul', missions:['explore_gipmul'],
      speciesStory:{beodeulchi:'버들치는 깊물에서는 조금 더 조용하게 움직여요.',morae:'모래무지는 모래와 비슷한 색이라 천천히 살펴봐야 해요.',siri:'쉬리는 바닥 가까이에서 조용히 움직일 수 있어요.'}
    },
    mulmoi:{
      name:'물모이', emoji:'🌿', oneLine:'여러 생물이 함께 모이는 곳이에요.',
      story:'여기는 물모이예요. 물길이 모이면서 수초와 자갈, 작은 생물들이 함께 살아가요. 여러 종류의 물고기를 만날 수 있는 재미있는 곳이에요.',
      observePoint:'수초, 자갈, 물살이 만나는 곳을 살펴보세요. 여러 물고기를 만날 수 있어요.',
      audioScriptId:'zone_mulmoi', missions:['explore_mulmoi','collect_cards_3'],
      speciesStory:{beodeulchi:'버들치는 물모이에서 다른 물고기와 함께 움직여요.',piramii:'피라미는 여러 마리가 함께 반짝일 수 있어요.',gaksi:'각시붕어는 수초 주변을 조심스럽게 지나가요.',morae:'모래무지는 바닥 가까이에서 먹이를 찾아요.'}
    }
  };

  const SPECIES_ZONE_STORY = {
    beodeulchi:{
      utmul:'맑은 웃물에서 조심스럽게 움직여요.',
      yeoul:'여울에서는 물살을 타고 빠르게 지나가요.',
      janyeoul:'잔여울에서는 수초 근처를 천천히 지나가요.',
      gipmul:'깊물에서는 조금 멀리 작게 보일 수 있어요.',
      mulmoi:'물모이에서는 다른 물고기와 함께 움직여요.'
    },
    piramii:{utmul:'밝은 물속에서 은빛으로 반짝여요.',yeoul:'여울 물살 사이를 빠르게 지나가요.',mulmoi:'여러 마리가 함께 보일 수 있어요.'},
    siri:{yeoul:'맑은 자갈 사이를 좋아해요.',gipmul:'바닥 가까이 조용히 움직여요.',mulmoi:'자갈 주변에서 관찰할 수 있어요.'},
    gaksi:{janyeoul:'수초 사이에서 살짝 보일 수 있어요.',mulmoi:'잔잔한 수초 주변을 좋아해요.'},
    morae:{gipmul:'바닥 가까이 숨어 있어요.',mulmoi:'모래와 자갈 사이를 천천히 살펴봐야 해요.'}
  };

  /* v22: 메뉴 이모지/이미지 아이콘 슬롯. image가 준비되면 emoji 대신 자동 적용한다. */
  const UI_ICON_CONFIG = {
    explore:{emoji:'🧭', image:'', label:'탐사'},
    dex:{emoji:'🐟', image:'', label:'도감'},
    mission:{emoji:'🎯', image:'', label:'미션'},
    camera:{emoji:'📷', image:'', label:'카메라'},
    gps:{emoji:'📍', image:'', label:'내 위치'},
    audio:{emoji:'🔊', image:'', label:'설명 듣기'},
    audioClose:{emoji:'✕', image:'', label:'음성 닫기'},
    audioStop:{emoji:'⏹️', image:'', label:'그만 듣기'},
    capture:{emoji:'📷', image:'', label:'찰칵 찍기'},
    gallery:{emoji:'🖼️', image:'', label:'내 관찰 사진'},
    download:{emoji:'⬇️', image:'', label:'다운로드'},
    delete:{emoji:'🗑️', image:'', label:'삭제'}
  };

  /* v30A: 아이들 눈높이 음성 스크립트. MP3가 있으면 audioPath 우선, 없으면 TTS fallback을 사용한다. */
  const AUDIO_SCRIPT_DATABASE = {
    zone_utmul:{id:'zone_utmul',type:'zone',title:'웃물 설명',emoji:'💧',text:'여기는 웃물이에요. 물이 얕고 맑아서 작은 물고기들이 살기 좋아요. 자갈 사이를 천천히 살펴봐요.',shortText:'웃물은 맑고 얕은 물길이에요.',audioPath:null,fallbackTts:true},
    zone_yeoul:{id:'zone_yeoul',type:'zone',title:'여울 설명',emoji:'🌊',text:'여기는 여울이에요. 물살이 조금 빠르고 빛이 자갈 위에서 반짝여요. 빠르게 움직이는 물고기를 찾아봐요.',shortText:'여울은 물살이 반짝이는 곳이에요.',audioPath:null,fallbackTts:true},
    zone_janyeoul:{id:'zone_janyeoul',type:'zone',title:'잔여울 설명',emoji:'🍃',text:'여기는 잔여울이에요. 물살이 부드럽고 수초가 천천히 흔들려요. 수초 사이를 살펴보면 작은 물고기를 찾을 수 있어요.',shortText:'잔여울은 편안한 물속 정원 같아요.',audioPath:null,fallbackTts:true},
    zone_gipmul:{id:'zone_gipmul',type:'zone',title:'깊물 설명',emoji:'🪨',text:'여기는 깊물이에요. 조금 깊고 조용한 곳이에요. 큰 돌 사이와 바닥 가까이를 천천히 살펴봐요.',shortText:'깊물은 조용하고 깊은 물길이에요.',audioPath:null,fallbackTts:true},
    zone_mulmoi:{id:'zone_mulmoi',type:'zone',title:'물모이 설명',emoji:'🌿',text:'여기는 물모이예요. 여러 물길과 생물이 함께 모이는 곳이에요. 다양한 물고기를 찾아볼까요?',shortText:'물모이는 생물이 많이 모이는 곳이에요.',audioPath:null,fallbackTts:true},
    species_beodeulchi:{id:'species_beodeulchi',type:'species',title:'버들치 설명',emoji:'🐟',text:'버들치는 맑은 물을 좋아하는 작은 민물고기예요. 친구들과 함께 물살을 타고 헤엄쳐요. 작고 길쭉한 몸을 찾아보세요.',shortText:'버들치는 맑은 물을 좋아해요.',audioPath:null,fallbackTts:true},
    species_piramii:{id:'species_piramii',type:'species',title:'피라미 설명',emoji:'🐟',text:'피라미는 빛을 받으면 몸이 반짝이는 물고기예요. 빠르게 지나갈 수 있으니 잘 살펴봐요.',shortText:'피라미는 은빛으로 반짝여요.',audioPath:null,fallbackTts:true},
    species_siri:{id:'species_siri',type:'species',title:'쉬리 설명',emoji:'🐟',text:'쉬리는 맑은 물과 자갈이 있는 곳을 좋아해요. 바닥 가까이를 천천히 살펴보세요.',shortText:'쉬리는 맑은 자갈 물길을 좋아해요.',audioPath:null,fallbackTts:true},
    species_gaksi:{id:'species_gaksi',type:'species',title:'각시붕어 설명',emoji:'🐟',text:'각시붕어는 작고 조심스러운 물고기예요. 수초 사이에서 살짝 보일 수 있어요.',shortText:'각시붕어는 수초 사이를 좋아해요.',audioPath:null,fallbackTts:true},
    species_morae:{id:'species_morae',type:'species',title:'모래무지 설명',emoji:'🐟',text:'모래무지는 바닥 가까이를 좋아해요. 모래색 몸이라 천천히 찾아봐야 해요.',shortText:'모래무지는 바닥 가까이에 있어요.',audioPath:null,fallbackTts:true},
    mission_intro:{id:'mission_intro',type:'mission',title:'미션 설명',emoji:'🎯',text:'미션은 오늘의 관찰 놀이예요. 물고기를 찾고 도감에 저장하면 진행 막대가 조금씩 채워져요.',shortText:'미션을 시작해 볼까요?',audioPath:null,fallbackTts:true},
    mission_complete:{id:'mission_complete',type:'mission',title:'미션 완료',emoji:'🎉',text:'잘했어요. 미션을 완료했어요. 보상을 받아볼까요?',shortText:'미션을 완료했어요.',audioPath:null,fallbackTts:true},
    dex_intro:{id:'dex_intro',type:'system',title:'도감 설명',emoji:'📖',text:'도감에는 내가 발견한 물고기 카드가 모여요. 아직 못 찾은 물고기는 수족관에서 찾아보세요.',shortText:'도감에서 발견한 물고기를 볼 수 있어요.',audioPath:null,fallbackTts:true},
    acquire_beodeulchi:{id:'acquire_beodeulchi',type:'system',title:'새 카드 획득',emoji:'✨',text:'새 물고기 발견! 버들치 카드를 얻었어요. 도감에 저장하고 다시 탐사를 이어가 볼까요?',shortText:'버들치 카드를 얻었어요.',audioPath:null,fallbackTts:true},
    capture_saved:{id:'capture_saved',type:'system',title:'사진 저장',emoji:'📷',text:'관찰 사진을 저장했어요. 내 관찰 사진에서 다시 볼 수 있어요.',shortText:'관찰 사진을 저장했어요.',audioPath:null,fallbackTts:true},
    gps_denied:{id:'gps_denied',type:'system',title:'위치 없이 탐사',emoji:'📍',text:'괜찮아요. 위치 없이도 수족관 탐사를 계속할 수 있어요.',shortText:'위치 없이도 탐사할 수 있어요.',audioPath:null,fallbackTts:true},
    gps_found:{id:'gps_found',type:'system',title:'탐사 구간 추천',emoji:'🧭',text:'가까운 탐사 구간을 찾아봤어요. 오늘은 추천 구간부터 살펴볼까요?',shortText:'가까운 탐사 구간을 찾아봤어요.',audioPath:null,fallbackTts:true},
    audio_unavailable:{id:'audio_unavailable',type:'system',title:'음성 준비 중',emoji:'🔇',text:'이 기기에서는 소리 설명을 사용할 수 없어요. 화면의 글자로 함께 볼 수 있어요.',shortText:'소리 설명을 사용할 수 없어요.',audioPath:null,fallbackTts:false}
  };
  let AUDIO_STATE = {supported:true,ttsSupported:('speechSynthesis' in window),isOpen:false,isPlaying:false,isLoading:false,mode:null,currentId:null,currentScriptId:null,currentText:'',currentTitle:'',lastScriptId:null,audio:null,utterance:null,startedAt:null,error:null,lastClickAt:0};

  /* v29: 전체 UI 충돌 방지를 위한 단일 상태표. 실제 패널/팝업은 open 함수에서 이 상태와 함께 갱신한다. */
  const UI_STATE = {
    activePanel: null,       // explore | dex | mission | camera | feature | null
    activePopup: null,       // fish | card | acquire | capture | gps | audio | null
    activeSpeciesId: null,
    activeCaptureId: null,
    audioPlaying: false,
    captureInProgress: false,
    gpsChecking: false
  };
  function setActivePanel(panel){UI_STATE.activePanel=panel||null;}
  function setActivePopup(popupName, detail={}){UI_STATE.activePopup=popupName||null;if('speciesId' in detail)UI_STATE.activeSpeciesId=detail.speciesId||null;if('captureId' in detail)UI_STATE.activeCaptureId=detail.captureId||null;}
  function clearActivePopup(popupName){if(!popupName || UI_STATE.activePopup===popupName){UI_STATE.activePopup=null;UI_STATE.activeSpeciesId=null;UI_STATE.activeCaptureId=null;}}




  /* v27: 카메라 캡처·관찰 기록 저장 구조. 웹에서는 IndexedDB를 우선 사용하고 localStorage를 fallback으로 사용한다. */
  const CAPTURE_STORAGE_KEY = 'pongdang.capture.v1';
  const CAPTURE_MAX_COUNT = 30;
  let CAPTURE_DATABASE = {captures: []};
  const CAMERA_STATE = {panelOpen:false,galleryOpen:false,detailOpen:false,selectedCaptureId:null,captureInProgress:false,lastCaptureAt:0};
  function getDeviceType(){const w=innerWidth;return w<600?'mobile':w<1024?'tablet':'desktop'}
  function captureId(){return `capture_${Date.now()}_${Math.random().toString(36).slice(2,7)}`}
  function formatCaptureTime(iso){try{const d=new Date(iso);return d.toLocaleString('ko-KR',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}catch(_){return '방금 전'}}
  function loadCaptures(){try{const raw=localStorage.getItem(CAPTURE_STORAGE_KEY);CAPTURE_DATABASE=raw?JSON.parse(raw):{captures:[]};if(!Array.isArray(CAPTURE_DATABASE.captures))CAPTURE_DATABASE={captures:[]};}catch(err){console.warn('관찰 사진 저장소를 불러오지 못했습니다.',err);CAPTURE_DATABASE={captures:[]};}}
  function saveCaptures(){try{CAPTURE_DATABASE.captures=CAPTURE_DATABASE.captures.slice(0,CAPTURE_MAX_COUNT);localStorage.setItem(CAPTURE_STORAGE_KEY,JSON.stringify(CAPTURE_DATABASE));}catch(err){console.warn('관찰 사진 저장 실패. 오래된 기록을 정리합니다.',err);CAPTURE_DATABASE.captures=CAPTURE_DATABASE.captures.slice(0,Math.max(5,CAPTURE_MAX_COUNT/2));try{localStorage.setItem(CAPTURE_STORAGE_KEY,JSON.stringify(CAPTURE_DATABASE));}catch(e){console.warn('관찰 사진 저장 fallback 실패',e)}}}
  function showCaptureToast(msg='📷 관찰 사진을 저장했어요!'){if(!captureToast)return;captureToast.textContent=msg;captureToast.classList.add('show');clearTimeout(showCaptureToast.t);showCaptureToast.t=setTimeout(()=>captureToast.classList.remove('show'),1800)}
  function closeCameraPanels(){stopAudio({hide:true,reason:'camera-panel-close'});cameraPanel?.classList.remove('show');captureGallery?.classList.remove('show');captureDetail?.classList.remove('show');CAMERA_STATE.panelOpen=false;CAMERA_STATE.galleryOpen=false;CAMERA_STATE.detailOpen=false;CAMERA_STATE.selectedCaptureId=null;if(UI_STATE.activePanel==='camera')setActivePanel(null);if(UI_STATE.activePopup==='capture')clearActivePopup('capture');}
  function openCameraPanel(){closeDexPanels();closeMissionPanel();closeExplorePanels();closeAcquiredCard();featurePanel?.classList.remove('show');popup?.classList.remove('show');cardDetail?.classList.remove('show');cameraPanel?.classList.add('show');CAMERA_STATE.panelOpen=true;setActivePanel('camera');renderCaptureGallery(false)}
  function openCaptureGalleryPanel(){cameraPanel?.classList.remove('show');captureGallery?.classList.add('show');CAMERA_STATE.panelOpen=false;CAMERA_STATE.galleryOpen=true;renderCaptureGallery(true)}
  function renderCaptureGallery(showEmpty=true){if(!captureGrid||!captureSummary)return;const items=CAPTURE_DATABASE.captures||[];captureSummary.textContent=`저장된 관찰 사진 ${items.length}장`;captureGrid.innerHTML=items.map(c=>`<button class="capture-card" data-capture-id="${c.id}" aria-label="${c.zoneName} ${c.observedSpeciesName} 관찰 사진 보기"><img src="${c.thumbData||c.imageData}" alt="${c.zoneName} 관찰 사진"><strong>${c.zoneIcon||'💧'} ${c.zoneName||'곤지암천'} · ${c.observedSpeciesName||'물고기'}</strong><span>${c.timeMode==='night'?'🌙 밤물':'☀️ 낮물'} · ${formatCaptureTime(c.createdAt)}</span></button>`).join('');captureEmpty?.classList.toggle('show',showEmpty&&items.length===0);captureGrid.querySelectorAll('[data-capture-id]').forEach(btn=>btn.addEventListener('click',()=>openCaptureDetail(btn.dataset.captureId)));}
  function openCaptureDetail(id){const c=CAPTURE_DATABASE.captures.find(x=>x.id===id);if(!c)return;CAMERA_STATE.selectedCaptureId=id;CAMERA_STATE.detailOpen=true;setActivePopup('capture',{captureId:id});captureDetailTitle.textContent='관찰 사진';captureDetailMeta.textContent=`${c.zoneIcon||''} ${c.zoneName||'곤지암천'} · ${c.observedSpeciesName||'물고기'} · ${c.timeMode==='night'?'밤물':'낮물'}`;captureDetailImage.src=c.imageData;captureDetailMemo.textContent=c.memo||`${c.zoneName||'곤지암천'}에서 ${c.observedSpeciesName||'물고기'}를 관찰했어요.`;captureDetail.classList.add('show');}
  function closeCaptureDetail(){captureDetail?.classList.remove('show');CAMERA_STATE.detailOpen=false;CAMERA_STATE.selectedCaptureId=null;clearActivePopup('capture');}
  function canvasToThumb(canvas){const t=document.createElement('canvas');const w=360,h=Math.round(w*0.72);t.width=w;t.height=h;const ctx=t.getContext('2d');ctx.fillStyle='#082b3d';ctx.fillRect(0,0,w,h);ctx.drawImage(canvas,0,0,w,h);return t.toDataURL('image/webp',.78)}
  function drawCaptureCanvas(){const rect=aquarium.getBoundingClientRect();const w=1280,h=820;const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');const grd=ctx.createLinearGradient(0,0,0,h);grd.addColorStop(0,isNight?'#09263c':'#70dbf1');grd.addColorStop(.55,isNight?'#123d54':'#b8f4ff');grd.addColorStop(1,isNight?'#17384b':'#d5f4de');ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);ctx.globalAlpha=.32;for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo((i*.16+0.02)*w,0);ctx.lineTo((i*.12+0.12)*w,h*.85);ctx.lineWidth=28;ctx.strokeStyle=isNight?'rgba(130,190,255,.18)':'rgba(255,255,220,.28)';ctx.stroke()}ctx.globalAlpha=1;for(let i=0;i<90;i++){ctx.fillStyle=`rgba(255,255,255,${rand(.08,.28)})`;ctx.beginPath();ctx.arc(rand(0,w),rand(0,h),rand(1,3.4),0,Math.PI*2);ctx.fill()}for(let i=0;i<36;i++){const x=rand(-40,w+40),y=rand(h*.72,h*.98),rw=rand(24,86),rh=rand(9,30);ctx.fillStyle=`rgba(${isNight?70:125},${isNight?104:135},${isNight?120:120},${rand(.32,.68)})`;ctx.beginPath();ctx.ellipse(x,y,rw,rh,rand(-.3,.3),0,Math.PI*2);ctx.fill()}const active=fishes.find(f=>f.id===activeFishId)||fishes.reduce((a,b)=>!a||b.depth>a.depth?b:a,null);if(active){const img=active.el?.frame;const fw=300*(.7+active.depth*.45),fh=fw*.42;const x=w*.50-fw*.5,y=h*.45-fh*.5;try{ctx.save();ctx.translate(x+fw/2,y+fh/2);ctx.rotate((active.bodyRotation||0)*Math.PI/180*.25);ctx.drawImage(img,-fw/2,-fh/2,fw,fh);ctx.restore();}catch(_){ctx.font='120px serif';ctx.textAlign='center';ctx.fillText('🐟',w/2,h*.46)}}ctx.fillStyle='rgba(5,31,45,.62)';ctx.beginPath();ctx.roundRect(28,28,360,74,26);ctx.fill();ctx.fillStyle='#ffffff';ctx.font='bold 31px system-ui, sans-serif';ctx.textAlign='left';ctx.fillText(`${zone.icon} ${zone.name} 관찰 사진`,52,75);ctx.font='20px system-ui, sans-serif';ctx.fillStyle='rgba(255,255,255,.86)';ctx.fillText(`${isNight?'밤물':'낮물'} · ${SPECIES.beodeulchi.name}`,52,105);return canvas}
  async function saveCurrentAquariumCapture(){const now=performance.now();if(CAMERA_STATE.captureInProgress||now-CAMERA_STATE.lastCaptureAt<1000)return;CAMERA_STATE.captureInProgress=true;CAMERA_STATE.lastCaptureAt=now;if(captureShot)captureShot.disabled=true;try{const canvas=drawCaptureCanvas();const imageData=canvas.toDataURL('image/png');const thumbData=canvasToThumb(canvas);const active=fishes.find(f=>f.id===activeFishId);const item={id:captureId(),imageData,thumbData,createdAt:new Date().toISOString(),zoneId:currentZoneId,zoneName:zone.name,zoneIcon:zone.icon,timeMode:isNight?'night':'day',observedSpeciesId:active?.species||'beodeulchi',observedSpeciesName:SPECIES.beodeulchi.name,missionIds:[],memo:`${zone.name}에서 ${SPECIES.beodeulchi.name}를 관찰했어요!`,appVersion:'v29',deviceType:getDeviceType()};CAPTURE_DATABASE.captures.unshift(item);CAPTURE_DATABASE.captures=CAPTURE_DATABASE.captures.slice(0,CAPTURE_MAX_COUNT);saveCaptures();renderCaptureGallery(false);showCaptureToast('📷 관찰 사진을 저장했어요!');try{onCaptureSaved(item)}catch(_){}}catch(err){console.error('캡처 실패',err);showCaptureToast('사진을 저장하지 못했어요. 다시 눌러볼까요?')}finally{CAMERA_STATE.captureInProgress=false;if(captureShot)captureShot.disabled=false;}}
  function downloadSelectedCapture(){const c=CAPTURE_DATABASE.captures.find(x=>x.id===CAMERA_STATE.selectedCaptureId);if(!c)return;const a=document.createElement('a');a.href=c.imageData;a.download=`pongdang_${c.zoneId}_${c.observedSpeciesId}_${(c.createdAt||'').slice(0,10).replaceAll('-','')}.png`;document.body.appendChild(a);a.click();a.remove();}
  function deleteSelectedCapture(){const id=CAMERA_STATE.selectedCaptureId;if(!id)return;if(!confirm('이 관찰 사진을 지울까요?'))return;CAPTURE_DATABASE.captures=CAPTURE_DATABASE.captures.filter(x=>x.id!==id);saveCaptures();closeCaptureDetail();renderCaptureGallery(true);showCaptureToast('🗑️ 관찰 사진을 지웠어요.');}
  function onCaptureSaved(capture){
    updateMissionProgress?.('capture_saved',{capture,zoneId:capture.zoneId,speciesId:capture.observedSpeciesId});
    playAudioById('capture_saved');
    saveExploreLog({zoneId:capture.zoneId,zoneName:capture.zoneName,actionType:'capture_saved',source:'camera',speciesId:capture.observedSpeciesId,speciesName:capture.observedSpeciesName,note:`${capture.zoneName}에서 관찰 사진을 저장했어요.`,timeMode:capture.timeMode});
  }

  /* v28: GPS 탐사·위치 권한 안내·탐사 기록 구조. 정확 좌표는 영구 저장하지 않는다. */
  const GPS_STATE_KEY='pongdang.gps.state.v1';
  const EXPLORE_LOG_KEY='pongdang.explore.log.v1';
  const EXPLORE_LOG_MAX=80;
  const GPS_ZONE_HINTS={
    utmul:{name:'웃물',emoji:'💧',kidText:'맑고 얕은 물을 먼저 살펴봐요.',recommendReason:'처음 탐사하기 좋은 구간이에요.'},
    yeoul:{name:'여울',emoji:'🌊',kidText:'물이 반짝이며 흐르는 곳이에요.',recommendReason:'물살을 좋아하는 물고기를 보기 좋아요.'},
    janyeoul:{name:'잔여울',emoji:'🍃',kidText:'수초 사이를 천천히 살펴봐요.',recommendReason:'편안하게 관찰하기 좋은 구간이에요.'},
    gipmul:{name:'깊물',emoji:'🪨',kidText:'조금 깊은 곳을 조심히 살펴봐요.',recommendReason:'숨어 있는 물고기를 찾기 좋아요.'},
    mulmoi:{name:'물모이',emoji:'🌿',kidText:'여러 생물이 모이는 곳이에요.',recommendReason:'다양한 물고기를 만날 수 있어요.'}
  };
  let GPS_STATE={supported:false,permission:'unknown',checking:false,lastCheckedAt:null,lastApproxZoneId:null,lastDistanceLabel:null,errorCode:null,errorMessage:null};
  let EXPLORE_LOG_DATABASE={logs:[]};
  function exploreId(){return `explore_${Date.now()}_${Math.random().toString(36).slice(2,6)}`}
  function initGpsState(){GPS_STATE.supported=!!(navigator.geolocation);try{const saved=JSON.parse(localStorage.getItem(GPS_STATE_KEY)||'{}');GPS_STATE={...GPS_STATE,...saved,supported:!!(navigator.geolocation),checking:false};}catch(_){}}
  function loadExploreLogs(){try{const raw=localStorage.getItem(EXPLORE_LOG_KEY);EXPLORE_LOG_DATABASE=raw?JSON.parse(raw):{logs:[]};if(!Array.isArray(EXPLORE_LOG_DATABASE.logs))EXPLORE_LOG_DATABASE={logs:[]};}catch(_){EXPLORE_LOG_DATABASE={logs:[]};}}
  function saveExploreLogs(){try{EXPLORE_LOG_DATABASE.logs=EXPLORE_LOG_DATABASE.logs.slice(0,EXPLORE_LOG_MAX);localStorage.setItem(EXPLORE_LOG_KEY,JSON.stringify(EXPLORE_LOG_DATABASE));}catch(err){console.warn('탐사 기록 저장 실패',err)}}
  function saveGpsState(){const safe={supported:GPS_STATE.supported,permission:GPS_STATE.permission,lastCheckedAt:GPS_STATE.lastCheckedAt,lastApproxZoneId:GPS_STATE.lastApproxZoneId,lastDistanceLabel:GPS_STATE.lastDistanceLabel,errorCode:GPS_STATE.errorCode,errorMessage:GPS_STATE.errorMessage};try{localStorage.setItem(GPS_STATE_KEY,JSON.stringify(safe));}catch(_){}}
  function saveExploreLog(log){const z=ZONES[log.zoneId]||zone;const item={id:exploreId(),createdAt:new Date().toISOString(),zoneId:log.zoneId||currentZoneId,zoneName:log.zoneName||z.name,zoneIcon:z.icon,actionType:log.actionType||'visit_zone',source:log.source||'manual',speciesId:log.speciesId||'',speciesName:log.speciesName||'',note:log.note||`${z.name}을 탐사했어요.`,timeMode:log.timeMode|| (isNight?'night':'day'),appVersion:'v29'};EXPLORE_LOG_DATABASE.logs.unshift(item);EXPLORE_LOG_DATABASE.logs=EXPLORE_LOG_DATABASE.logs.slice(0,EXPLORE_LOG_MAX);saveExploreLogs();if(explorePanel?.classList.contains('show'))renderExploreLogList();return item;}
  function renderExploreLogList(){if(!exploreLogList)return;const logs=EXPLORE_LOG_DATABASE.logs||[];if(!logs.length){exploreLogList.innerHTML='<div class="explore-empty">아직 탐사 기록이 없어요.<br>수족관에서 물고기를 찾아보세요!</div>';return;}exploreLogList.innerHTML=logs.slice(0,30).map(l=>`<article class="explore-log-card"><div class="explore-log-emoji">${l.actionType==='gps_check'?'📍':l.actionType==='capture_saved'?'📷':l.speciesId?'🐟':l.zoneIcon||'🧭'}</div><div><strong>${l.zoneIcon||''} ${l.zoneName||'곤지암천'} 탐사</strong><span>${l.note||'탐사 기록'} · ${formatCaptureTime(l.createdAt)}</span></div></article>`).join('');}
  function updateGpsResult(type='default',zoneId=currentZoneId,text=''){
    const hint=GPS_ZONE_HINTS[zoneId]||GPS_ZONE_HINTS.utmul;
    if(gpsResultIcon)gpsResultIcon.textContent=type==='error'?'🛟':hint.emoji;
    if(gpsResultTitle)gpsResultTitle.textContent=type==='near'?'곤지암천 가까이에 있어요!':type==='maybe'?'가까운 구간을 찾아봤어요':type==='far'?'멀리 있어도 탐사할 수 있어요':type==='error'?'위치 없이도 괜찮아요':`${hint.name}부터 살펴볼까요?`;
    if(gpsResultText)gpsResultText.textContent=text||`${hint.kidText} ${hint.recommendReason}`;
    if(gpsResultCard)gpsResultCard.dataset.zone=zoneId;
  }
  function openExplorePanel(){closeDexPanels();closeMissionPanel();closeCameraPanels();closeAcquiredCard();featurePanel?.classList.remove('show');popup?.classList.remove('show');cardDetail?.classList.remove('show');explorePanel?.classList.add('show');setActivePanel('explore');renderExploreLogList();updateGpsResult('default',GPS_STATE.lastApproxZoneId||currentZoneId);}
  function closeExplorePanels(){stopAudio({hide:true,reason:'explore-panel-close'});explorePanel?.classList.remove('show');closeGpsGuide();if(UI_STATE.activePanel==='explore')setActivePanel(null);}
  function openGpsGuidePanel(){if(!GPS_STATE.supported){handleGpsError({code:'unsupported',message:'이 기기에서는 위치 확인을 사용할 수 없어요.'});return;}gpsGuideBackdrop?.classList.add('show');gpsGuide?.classList.add('show');setActivePopup('gps');}
  function closeGpsGuide(){stopAudio({hide:true,reason:'gps-guide-close'});gpsGuideBackdrop?.classList.remove('show');gpsGuide?.classList.remove('show');clearActivePopup('gps');}
  async function queryPermissionState(){try{if(navigator.permissions?.query){const p=await navigator.permissions.query({name:'geolocation'});GPS_STATE.permission=p.state||GPS_STATE.permission;saveGpsState();}}catch(_){}}
  function recommendZoneByLocation(position){
    // v28에서는 정확 좌표를 저장하지 않고 구조만 안정화한다. 실제 좌표 기반 계산은 후속 단계에서 확장한다.
    const keys=['utmul','yeoul','janyeoul','gipmul','mulmoi'];
    const idx=Math.abs(Math.round(((position?.coords?.latitude||37.4)*1000)))%keys.length;
    return keys[idx]||currentZoneId||'utmul';
  }
  function requestUserLocation(){
    if(!navigator.geolocation){handleGpsError({code:'unsupported',message:'위치 확인을 사용할 수 없어요.'});return;}
    if(GPS_STATE.checking)return;
    GPS_STATE.checking=true; if(requestGpsBtn)requestGpsBtn.disabled=true; updateGpsResult('maybe',currentZoneId,'가까운 탐사 구간을 찾고 있어요...');
    navigator.geolocation.getCurrentPosition(handleGpsSuccess,handleGpsError,{enableHighAccuracy:false,timeout:7000,maximumAge:60000});
  }
  function handleGpsSuccess(position){
    GPS_STATE.checking=false; if(requestGpsBtn)requestGpsBtn.disabled=false;
    GPS_STATE.permission='granted'; GPS_STATE.lastCheckedAt=new Date().toISOString(); GPS_STATE.errorCode=null; GPS_STATE.errorMessage=null;
    const zoneId=recommendZoneByLocation(position); GPS_STATE.lastApproxZoneId=zoneId; GPS_STATE.lastDistanceLabel='near'; saveGpsState(); closeGpsGuide(); updateGpsResult('near',zoneId,`${GPS_ZONE_HINTS[zoneId]?.kidText||'가까운 구간을 찾아봤어요.'} 위치는 저장하지 않고 추천에만 사용했어요.`);
    saveExploreLog({zoneId,actionType:'gps_check',source:'gps',note:`가까운 탐사 구간으로 ${ZONES[zoneId]?.name||'곤지암천'}을 추천했어요.`,timeMode:isNight?'night':'day'});
    try{updateMissionProgress?.('gps_checked',{zoneId,result:'near'});}catch(_){ }
    try{playAudioById('gps_found')}catch(_){ }
  }
  function handleGpsError(error){
    GPS_STATE.checking=false; if(requestGpsBtn)requestGpsBtn.disabled=false;
    GPS_STATE.permission=error?.code===1?'denied':GPS_STATE.permission;GPS_STATE.errorCode=String(error?.code||'unsupported');GPS_STATE.errorMessage=error?.message||'위치를 확인할 수 없어요.';GPS_STATE.lastCheckedAt=new Date().toISOString();saveGpsState();closeGpsGuide();updateGpsResult('error',currentZoneId,'괜찮아요. 위치 없이도 수족관 탐사를 계속할 수 있어요.');
    saveExploreLog({zoneId:currentZoneId,actionType:'gps_check',source:'manual',note:'위치 확인 없이 수족관 탐사를 계속했어요.',timeMode:isNight?'night':'day'});
    try{playAudioById('gps_denied')}catch(_){ }
  }


  /* v24: 미션 데이터와 상태. 사용자의 관찰/첫 발견/도감 저장/존 진입 이벤트를 진행률로 연결한다. */
  const MISSION_STORAGE_KEY = 'pongdang_gonjiam_mission_v24';
  const MISSION_DATABASE = {
    observe_beodeulchi_1:{id:'observe_beodeulchi_1',type:'observe_species',title:'버들치 1마리 관찰하기',kidText:'버들치를 한 번 찾아봐요!',emoji:'🐟',zoneIds:['utmul','yeoul','janyeoul','gipmul','mulmoi'],speciesId:'beodeulchi',goal:1,rewardType:'card',rewardId:'beodeulchi',rewardLabel:'버들치 카드',difficulty:'easy'},
    first_fish_find:{id:'first_fish_find',type:'first_discovery',title:'새 물고기 처음 발견하기',kidText:'처음 보는 물고기를 찾아봐요!',emoji:'✨',goal:1,rewardType:'badge',rewardId:'first_find',rewardLabel:'첫 발견 배지',difficulty:'easy'},
    save_card_1:{id:'save_card_1',type:'save_card',title:'도감에 카드 저장하기',kidText:'찾은 물고기를 도감에 저장해요!',emoji:'📖',goal:1,rewardType:'mission_point',rewardId:'dex_save_point',rewardLabel:'도감 별 1개',difficulty:'easy'},
    explore_utmul:{id:'explore_utmul',type:'visit_zone',title:'웃물 탐사하기',kidText:'맑은 웃물에 들어가 봐요!',emoji:'💧',zoneIds:['utmul'],goal:1,rewardType:'badge',rewardId:'utmul_explorer',rewardLabel:'웃물 탐사 배지',difficulty:'easy'},
    collect_cards_3:{id:'collect_cards_3',type:'collect_cards',title:'도감 카드 3장 모으기',kidText:'물고기 카드를 3장 모아봐요!',emoji:'🎴',goal:3,rewardType:'badge',rewardId:'little_collector',rewardLabel:'작은 수집가 배지',difficulty:'normal'},
    night_observe_1:{id:'night_observe_1',type:'night_observe',title:'밤물에서 물고기 보기',kidText:'밤물에서도 물고기를 찾아봐요!',emoji:'🌙',goal:1,rewardType:'badge',rewardId:'night_watcher',rewardLabel:'밤물 관찰 배지',difficulty:'normal'},
    capture_one:{id:'capture_one',type:'capture_saved',title:'관찰 사진 1장 찍기',kidText:'물속 장면을 사진으로 남겨봐요!',emoji:'📷',goal:1,rewardType:'badge',rewardId:'little_photographer',rewardLabel:'꼬마 기록가 배지',difficulty:'easy'}
  };
  function makeInitialMissionState(){const state={};Object.keys(MISSION_DATABASE).forEach(id=>state[id]={progress:0,completed:false,completedAt:null,rewardClaimed:false});return state;}
  let MISSION_STATE = loadMissionState();
  let missionEventCooldown = {};
  function loadMissionState(){const base=makeInitialMissionState();try{const raw=localStorage.getItem(MISSION_STORAGE_KEY);if(!raw)return base;return {...base,...JSON.parse(raw)}}catch(err){console.warn('미션 상태를 불러오지 못해 기본값을 사용합니다.',err);return base}}
  function saveMissionState(){try{localStorage.setItem(MISSION_STORAGE_KEY,JSON.stringify(MISSION_STATE));}catch(err){console.warn('미션 상태 저장 실패',err)}}
  function clampMissionProgress(missionId){const m=MISSION_DATABASE[missionId],s=MISSION_STATE[missionId];if(!m||!s)return;s.progress=Math.max(0,Math.min(m.goal,s.progress));}
  function getMissionPercent(missionId){const m=MISSION_DATABASE[missionId],s=MISSION_STATE[missionId];if(!m||!s)return 0;return Math.round(Math.min(1,s.progress/m.goal)*100);}
  function completeMission(missionId){const s=MISSION_STATE[missionId];if(!s||s.completed)return; s.completed=true; s.completedAt=new Date().toISOString(); saveMissionState(); showMissionToast(`✅ ${MISSION_DATABASE[missionId].title} 완료!`); try{playAudioById('mission_complete')}catch(_){ }}
  function claimMissionReward(missionId){const s=MISSION_STATE[missionId];const m=MISSION_DATABASE[missionId];if(!s||!m||!s.completed||s.rewardClaimed)return; s.rewardClaimed=true; saveMissionState(); showMissionToast(`🎁 ${m.rewardLabel} 받았어요!`); renderMissionList();}
  function canCountMissionEvent(key,ms=1100){const now=performance.now();if(missionEventCooldown[key]&&now-missionEventCooldown[key]<ms)return false;missionEventCooldown[key]=now;return true;}
  function updateMissionProgress(eventType,payload={}){let changed=false;Object.values(MISSION_DATABASE).forEach(m=>{const s=MISSION_STATE[m.id];if(!s||s.completed)return;let match=false,amount=1;if(m.type==='observe_species'&&eventType==='observe_species')match=payload.speciesId===m.speciesId&&(!m.zoneIds||m.zoneIds.includes(payload.zoneId));if(m.type==='first_discovery'&&eventType==='first_discovery')match=true;if(m.type==='save_card'&&eventType==='save_card')match=!m.speciesId||payload.speciesId===m.speciesId;if(m.type==='visit_zone'&&eventType==='visit_zone')match=m.zoneIds?.includes(payload.zoneId);if(m.type==='night_observe'&&eventType==='observe_species')match=!!payload.isNight;if(m.type==='capture_saved'&&eventType==='capture_saved')match=true;if(m.type==='collect_cards'&&(eventType==='save_card'||eventType==='first_discovery')){const count=Object.values(DISCOVERY_STATE).filter(x=>x?.cardUnlocked||x?.discovered).length;amount=Math.max(0,count-s.progress);match=amount>0;}if(!match)return;const key=`${m.id}:${eventType}:${payload.speciesId||''}:${payload.zoneId||''}`;if(!canCountMissionEvent(key))return;s.progress+=amount;clampMissionProgress(m.id);changed=true;if(s.progress>=m.goal)completeMission(m.id);});if(changed){saveMissionState();if(missionPanel?.classList.contains('show'))renderMissionList();else showMissionToast('🎯 미션이 진행됐어요!');}}
  function onFishObserved(speciesId,zoneId){updateMissionProgress('observe_species',{speciesId,zoneId,isNight});}
  function onFirstDiscovery(speciesId,zoneId){updateMissionProgress('first_discovery',{speciesId,zoneId});}
  function onCardSaved(speciesId){updateMissionProgress('save_card',{speciesId});}
  function onZoneEntered(zoneId){updateMissionProgress('visit_zone',{zoneId}); if(EXPLORE_LOG_DATABASE?.logs){const z=ZONES[zoneId]||zone;saveExploreLog({zoneId,zoneName:z.name,actionType:'visit_zone',source:'manual',note:`${z.name} 구간에 들어왔어요.`,timeMode:isNight?'night':'day'});}}
  function showMissionToast(text){if(!missionToast)return;missionToast.textContent=text;missionToast.classList.add('show');clearTimeout(showMissionToast._t);showMissionToast._t=setTimeout(()=>missionToast.classList.remove('show'),1500);}

  /* v22: 도감 획득/미획득 상태 저장 구조. 추후 서버/앱 저장소로 교체 가능하다. */
  const DISCOVERY_STORAGE_KEY = 'pongdang_gonjiam_discovery_v24';
  function makeInitialDiscoveryState(){
    const state = {};
    DEX_CARDS.forEach(card=>{
      state[card.id] = {
        discovered: !!card.acquired,
        seenCount: card.acquired ? 1 : 0,
        firstZone: card.acquired ? (card.zones[0] || '') : '',
        firstFoundAt: card.acquired ? new Date().toISOString() : '',
        cardUnlocked: !!card.acquired,
        rewardClaimed: false
      };
    });
    return state;
  }
  let DISCOVERY_STATE = loadDiscoveryState();
  function loadDiscoveryState(){
    const base = makeInitialDiscoveryState();
    try{
      const raw = localStorage.getItem(DISCOVERY_STORAGE_KEY);
      if(!raw) return base;
      const saved = JSON.parse(raw);
      return {...base, ...saved};
    }catch(err){
      console.warn('도감 상태를 불러오지 못해 기본값을 사용합니다.', err);
      return base;
    }
  }
  function saveDiscoveryState(){
    try{ localStorage.setItem(DISCOVERY_STORAGE_KEY, JSON.stringify(DISCOVERY_STATE)); }
    catch(err){ console.warn('도감 상태 저장 실패', err); }
  }
  function getCardState(cardId){
    if(!DISCOVERY_STATE[cardId]) DISCOVERY_STATE[cardId] = {discovered:false,seenCount:0,firstZone:'',firstFoundAt:'',cardUnlocked:false,rewardClaimed:false};
    return DISCOVERY_STATE[cardId];
  }
  function isCardDiscovered(cardId){ return !!getCardState(cardId).discovered; }
  function markSpeciesDiscovered(speciesId, zoneName){
    const state = getCardState(speciesId);
    const wasNew = !state.discovered;
    state.discovered = true;
    state.cardUnlocked = true;
    state.seenCount = (state.seenCount || 0) + 1;
    if(!state.firstZone) state.firstZone = zoneName || '';
    if(!state.firstFoundAt) state.firstFoundAt = new Date().toISOString();
    saveDiscoveryState();
    return wasNew;
  }
  function getCardView(card){
    const st = getCardState(card.id);
    return {...card, acquired: !!st.discovered, seenCount: st.seenCount || 0, firstZone: st.firstZone || ''};
  }
  function applyMenuIconSlots(){
    document.querySelectorAll('[data-icon-slot]').forEach(slot=>{
      const cfg = UI_ICON_CONFIG[slot.dataset.iconSlot];
      if(!cfg) return;
      if(cfg.image){
        slot.innerHTML = `<img class="nav-icon-img" src="${cfg.image}" alt="" />`;
      }else{
        slot.textContent = cfg.emoji || '•';
      }
      slot.parentElement?.setAttribute('aria-label', `${cfg.label} 메뉴`);
    });
  }

  let dexFilterValue='all';


  /* v18: 존 독립 운영 검증용 내부 상태. 존 전환 시 이전 존의 관찰 대상·클릭 상태·팝업 상태가 남지 않도록 한다. */
  const ZONE_RUNTIME = {
    loadedAt: 0,
    lastZoneId: null,
    changeCount: 0,
    validation: 'ready'
  };

  const CFG = { clickableDepth:.78, repickDelay:[900,1700], observeMs:[5200,8400], cooldown:[4200,7600], turnCooldown:950, maxDt:33, deadZone:28, hysteresis:8 };
  const app=document.getElementById('app'), bg=document.getElementById('bg'), fishLayer=document.getElementById('fishLayer'), ecoLayer=document.getElementById('ecoLayer'), particles=document.getElementById('particles'), zoneStrip=document.getElementById('zoneStrip'), zoneDesc=document.getElementById('zoneDesc'), modeBtn=document.getElementById('modeBtn'), fullBtn=document.getElementById('fullBtn'), popup=document.getElementById('popup'), closePopup=document.getElementById('closePopup'), popupTitle=document.getElementById('popupTitle'), popupZone=document.getElementById('popupZone'), popupText=document.getElementById('popupText'), infoLayer=document.getElementById('infoLayer'), infoFlow=document.getElementById('infoFlow'), debugChip=document.getElementById('debugChip'), cardTitle=document.getElementById('cardTitle'), cardSub=document.getElementById('cardSub'), featurePanel=document.getElementById('featurePanel'), featureIcon=document.getElementById('featureIcon'), featureTitle=document.getElementById('featureTitle'), featureSub=document.getElementById('featureSub'), featureBody=document.getElementById('featureBody'), featureClose=document.getElementById('featureClose'), featureAction=document.getElementById('featureAction'), acquireCard=document.getElementById('acquireCard'), acquireImage=document.getElementById('acquireImage'), acquireName=document.getElementById('acquireName'), acquireLines=document.getElementById('acquireLines'), saveCard=document.getElementById('saveCard'), keepExplore=document.getElementById('keepExplore'), dexPanel=document.getElementById('dexPanel'), dexGrid=document.getElementById('dexGrid'), dexFilter=document.getElementById('dexFilter'), dexProgress=document.getElementById('dexProgress'), dexClose=document.getElementById('dexClose'), cardDetail=document.getElementById('cardDetail'), detailName=document.getElementById('detailName'), detailMeta=document.getElementById('detailMeta'), detailImage=document.getElementById('detailImage'), detailHero=document.getElementById('detailHero'), detailLocked=document.getElementById('detailLocked'), detailHabitat=document.getElementById('detailHabitat'), detailFeature=document.getElementById('detailFeature'), detailPoint=document.getElementById('detailPoint'), detailClose=document.getElementById('detailClose'), detailClose2=document.getElementById('detailClose2'), detailListen=document.getElementById('detailListen'), missionPanel=document.getElementById('missionPanel'), missionList=document.getElementById('missionList'), missionClose=document.getElementById('missionClose'), missionSummary=document.getElementById('missionSummary'), missionToast=document.getElementById('missionToast'), audioBtn=document.getElementById('audioBtn'), popupAudio=document.getElementById('popupAudio'), audioPanel=document.getElementById('audioPanel'), audioFace=document.getElementById('audioFace'), audioTitle=document.getElementById('audioTitle'), audioText=document.getElementById('audioText'), audioClose=document.getElementById('audioClose'), audioReplay=document.getElementById('audioReplay'), audioStop=document.getElementById('audioStop'), cameraPanel=document.getElementById('cameraPanel'), cameraClose=document.getElementById('cameraClose'), captureShot=document.getElementById('captureShot'), openCaptureGallery=document.getElementById('openCaptureGallery'), captureGallery=document.getElementById('captureGallery'), captureGrid=document.getElementById('captureGrid'), captureEmpty=document.getElementById('captureEmpty'), captureSummary=document.getElementById('captureSummary'), captureGalleryClose=document.getElementById('captureGalleryClose'), captureDetail=document.getElementById('captureDetail'), captureDetailTitle=document.getElementById('captureDetailTitle'), captureDetailMeta=document.getElementById('captureDetailMeta'), captureDetailImage=document.getElementById('captureDetailImage'), captureDetailMemo=document.getElementById('captureDetailMemo'), captureDetailClose=document.getElementById('captureDetailClose'), captureDetailClose2=document.getElementById('captureDetailClose2'), captureDownload=document.getElementById('captureDownload'), captureDelete=document.getElementById('captureDelete'), captureToast=document.getElementById('captureToast');
  const explorePanel=document.getElementById('explorePanel'), exploreClose=document.getElementById('exploreClose'), openGpsGuide=document.getElementById('openGpsGuide'), recommendZoneBtn=document.getElementById('recommendZoneBtn'), openExploreLog=document.getElementById('openExploreLog'), exploreLogList=document.getElementById('exploreLogList'), gpsResultCard=document.getElementById('gpsResultCard'), gpsResultIcon=document.getElementById('gpsResultIcon'), gpsResultTitle=document.getElementById('gpsResultTitle'), gpsResultText=document.getElementById('gpsResultText'), startRecommendedZone=document.getElementById('startRecommendedZone'), gpsGuideBackdrop=document.getElementById('gpsGuideBackdrop'), gpsGuide=document.getElementById('gpsGuide'), gpsGuideClose=document.getElementById('gpsGuideClose'), requestGpsBtn=document.getElementById('requestGpsBtn'), cancelGpsBtn=document.getElementById('cancelGpsBtn');
  const acquireBackdrop=document.getElementById('acquireBackdrop'), acquireClose=document.getElementById('acquireClose'), acquireZone=document.getElementById('acquireZone'), acquireQuestion=document.getElementById('acquireQuestion'), acquireReward=document.getElementById('acquireReward');
  const ACQUIRE_CARD_STATE = {isOpen:false,speciesId:null,zoneId:null,openedAt:0};
  function notifyMissionProgress(type, speciesId, zoneId){ onFishObserved(speciesId, zoneId); }
  function notifyAudioReady(speciesId){ console.info('v26 음성 훅 준비:', speciesId); }

  function getAudioScript(id){
    if(!id) return AUDIO_SCRIPT_DATABASE.zone_utmul;
    if(AUDIO_SCRIPT_DATABASE[id]) return AUDIO_SCRIPT_DATABASE[id];
    for(const group of ['zones','species','mission','system']){
      const bucket=AUDIO_SCRIPT_DATABASE[group];
      if(bucket && bucket[id]) return bucket[id];
    }
    return AUDIO_SCRIPT_DATABASE.audio_unavailable || AUDIO_SCRIPT_DATABASE.zone_utmul;
  }
  function getZoneAudioId(zoneId=currentZoneId){return ZONE_STORY_DATABASE[zoneId]?.audioScriptId || `zone_${zoneId}`;}
  function setAudioPanel(script, status='듣는 중이에요 🔊'){
    if(!audioPanel||!script)return;
    audioFace.textContent=script.emoji||'🔊';
    audioTitle.textContent=script.title||'설명 듣기';
    audioText.textContent=`${status}\n${script.text||'아이 눈높이로 짧게 들려드려요.'}`;
    audioPanel.classList.add('show');
    audioBtn?.classList.toggle('listening',!!AUDIO_STATE.isPlaying||!!AUDIO_STATE.isLoading);
    AUDIO_STATE.isOpen=true;
    UI_STATE.audioPlaying=!!AUDIO_STATE.isPlaying;
  }
  function showAudioFallbackMessage(message='소리 설명을 잠깐 사용할 수 없어요.'){
    const script=getAudioScript('audio_unavailable');
    setAudioPanel({...script,text:message},message);
  }
  function resetAudioState(reason='stop'){
    AUDIO_STATE.isPlaying=false;
    AUDIO_STATE.isLoading=false;
    AUDIO_STATE.mode=null;
    AUDIO_STATE.currentId=null;
    AUDIO_STATE.currentScriptId=null;
    AUDIO_STATE.currentText='';
    AUDIO_STATE.currentTitle='';
    AUDIO_STATE.startedAt=null;
    UI_STATE.audioPlaying=false;
    audioBtn?.classList.remove('listening');
  }
  function stopAudio(options={}){
    const hide=!!options.hide;
    try{ if(AUDIO_STATE.audio){AUDIO_STATE.audio.pause();AUDIO_STATE.audio.removeAttribute('src');AUDIO_STATE.audio.load?.();} }catch(_){ }
    try{ window.speechSynthesis?.cancel(); }catch(_){ }
    AUDIO_STATE.audio=null;
    AUDIO_STATE.utterance=null;
    resetAudioState(options.reason||'stop');
    if(hide){ audioPanel?.classList.remove('show'); AUDIO_STATE.isOpen=false; clearActivePopup('audio'); }
  }
  function speakText(text){
    if(!text){showAudioFallbackMessage('설명 문구를 준비 중이에요.');return false;}
    if(!('speechSynthesis' in window)){AUDIO_STATE.error='tts_unsupported';showAudioFallbackMessage('이 기기에서는 소리 설명을 사용할 수 없어요.');return false;}
    try{ window.speechSynthesis.cancel(); }catch(_){ }
    const utter=new SpeechSynthesisUtterance(text);
    utter.lang='ko-KR';
    utter.rate=.88;
    utter.pitch=1.04;
    utter.volume=1;
    utter.onend=()=>{AUDIO_STATE.isPlaying=false;AUDIO_STATE.isLoading=false;AUDIO_STATE.mode=null;UI_STATE.audioPlaying=false;audioBtn?.classList.remove('listening')};
    utter.onerror=()=>{AUDIO_STATE.isPlaying=false;AUDIO_STATE.isLoading=false;AUDIO_STATE.error='tts_error';UI_STATE.audioPlaying=false;audioBtn?.classList.remove('listening');showAudioFallbackMessage('소리 설명을 잠깐 사용할 수 없어요.')};
    AUDIO_STATE.utterance=utter;
    AUDIO_STATE.mode='tts';
    AUDIO_STATE.isLoading=false;
    AUDIO_STATE.isPlaying=true;
    window.speechSynthesis.speak(utter);
    return true;
  }
  function playMp3ThenFallback(script){
    if(!script.audioPath){return speakText(script.text);}
    try{
      const a=new Audio(script.audioPath);
      AUDIO_STATE.audio=a;
      AUDIO_STATE.mode='mp3';
      AUDIO_STATE.isLoading=true;
      a.oncanplay=()=>{AUDIO_STATE.isLoading=false;};
      a.onended=()=>{AUDIO_STATE.isPlaying=false;AUDIO_STATE.isLoading=false;AUDIO_STATE.mode=null;UI_STATE.audioPlaying=false;audioBtn?.classList.remove('listening')};
      a.onerror=()=>{AUDIO_STATE.audio=null;AUDIO_STATE.error='mp3_error';AUDIO_STATE.isLoading=false;AUDIO_STATE.isPlaying=script.fallbackTts!==false && speakText(script.text); if(!AUDIO_STATE.isPlaying)showAudioFallbackMessage('설명을 준비 중이에요.')};
      AUDIO_STATE.isPlaying=true;
      UI_STATE.audioPlaying=true;
      a.play().then(()=>{AUDIO_STATE.isLoading=false;}).catch(()=>{AUDIO_STATE.audio=null;AUDIO_STATE.error='mp3_blocked';AUDIO_STATE.isLoading=false;AUDIO_STATE.isPlaying=script.fallbackTts!==false && speakText(script.text); if(!AUDIO_STATE.isPlaying)showAudioFallbackMessage('설명을 준비 중이에요.')});
      return true;
    }catch(err){
      AUDIO_STATE.error='mp3_exception';
      return script.fallbackTts!==false && speakText(script.text);
    }
  }
  function playAudioById(id, options={}){
    const now=performance.now();
    if(now-AUDIO_STATE.lastClickAt<650 && id===AUDIO_STATE.currentId) return getAudioScript(id);
    AUDIO_STATE.lastClickAt=now;
    const script=getAudioScript(id);
    stopAudio({reason:'new-audio'});
    if(!script){showAudioFallbackMessage('설명을 준비 중이에요.');return null;}
    AUDIO_STATE.currentId=script.id;
    AUDIO_STATE.currentScriptId=script.id;
    AUDIO_STATE.lastScriptId=script.id;
    AUDIO_STATE.currentText=script.text||'';
    AUDIO_STATE.currentTitle=script.title||'';
    AUDIO_STATE.startedAt=Date.now();
    AUDIO_STATE.isLoading=true;
    setActivePopup('audio');
    setAudioPanel(script,'설명을 준비하고 있어요.');
    const ok=script.audioPath ? playMp3ThenFallback(script) : (script.fallbackTts!==false && speakText(script.text));
    if(!ok){AUDIO_STATE.isLoading=false;showAudioFallbackMessage('설명을 준비 중이에요.');}
    else setAudioPanel(script,'듣는 중이에요 🔊');
    return script;
  }
  function replayAudio(){if(AUDIO_STATE.lastScriptId)playAudioById(AUDIO_STATE.lastScriptId);else playCurrentZoneAudio();}

  function playCurrentZoneAudio(){return playAudioById(getZoneAudioId(currentZoneId));}

  let currentZoneId='utmul', zone=ZONES.utmul, isNight=false, fishes=[], activeFishId=null, lastActiveFishId=null, nextPickAt=0, lastT=performance.now();
  const rand=(a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)], clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t, ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

  function safeRect(){const w=innerWidth,h=innerHeight;return{w,h,minX:Math.max(26,w*.06),maxX:Math.min(w-26,w*.94),minY:Math.max(112+parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-top')||0),h*.24),maxY:Math.min(h-118,h*.72),centerMin:w*.30,centerMax:w*.70}}
  const BACKGROUND_LOAD_STATE={loaded:new Set(),loading:new Map(),requested:0,failed:new Set()};
  function resolveAssetUrl(src){return new URL(freshUrl(src),document.baseURI).href}
  function loadBackground(src){
    if(!src)return Promise.resolve(false);
    const url=resolveAssetUrl(src);
    if(BACKGROUND_LOAD_STATE.loaded.has(src))return Promise.resolve(true);
    if(BACKGROUND_LOAD_STATE.loading.has(src))return BACKGROUND_LOAD_STATE.loading.get(src);
    BACKGROUND_LOAD_STATE.requested++;
    const task=new Promise(resolve=>{
      const img=new Image();
      let done=false;
      const finish=ok=>{if(done)return;done=true;if(ok){BACKGROUND_LOAD_STATE.loaded.add(src);BACKGROUND_LOAD_STATE.failed.delete(src)}else{BACKGROUND_LOAD_STATE.failed.add(src)}BACKGROUND_LOAD_STATE.loading.delete(src);resolve(ok)};
      img.decoding='async';
      img.onload=()=>finish(true);
      img.onerror=()=>finish(false);
      img.src=url;
      if(img.decode)img.decode().then(()=>finish(true)).catch(()=>{});
    });
    BACKGROUND_LOAD_STATE.loading.set(src,task);
    return task;
  }
  function preloadZoneBackgrounds(zoneId){
    const z=ZONES[zoneId];
    if(!z)return;
    loadBackground(z.day);
    loadBackground(z.night);
  }
  function getBackgroundLoadAudit(){
    const bgStyle=bg?getComputedStyle(bg):null;
    return {
      loaded:[...BACKGROUND_LOAD_STATE.loaded],
      loading:[...BACKGROUND_LOAD_STATE.loading.keys()],
      failed:[...BACKGROUND_LOAD_STATE.failed],
      requested:BACKGROUND_LOAD_STATE.requested,
      element:!!bg,
      selected:zone?(isNight?zone.night:zone.day):'',
      inlineImage:bg?.style.backgroundImage||'',
      computedImage:bgStyle?.backgroundImage||'',
      zIndex:bgStyle?.zIndex||'',
      opacity:bgStyle?.opacity||'',
      pointerEvents:bgStyle?.pointerEvents||''
    };
  }
  function preload(){Object.values(ASSETS).forEach(src=>{const img=new Image();img.decoding='async';img.src=freshUrl(src)});preloadZoneBackgrounds(currentZoneId)}
  function bodyFrameFor(f){if(!f.isTurning)return f.dir===1?ASSETS.bodyRight:ASSETS.bodyLeft;const p=f.turnProgress;if(f.dir===1&&f.desiredDir===-1){if(p<.22)return ASSETS.bodyRight;if(p<.43)return ASSETS.quarterRight;if(p<.62)return ASSETS.front;if(p<.82)return ASSETS.quarterLeft;return ASSETS.bodyLeft}if(f.dir===-1&&f.desiredDir===1){if(p<.22)return ASSETS.bodyLeft;if(p<.43)return ASSETS.quarterLeft;if(p<.62)return ASSETS.front;if(p<.82)return ASSETS.quarterRight;return ASSETS.bodyRight}return f.dir===1?ASSETS.bodyRight:ASSETS.bodyLeft}

  function setupZoneButtons(){
    zoneStrip.innerHTML='';
    Object.values(ZONES).forEach(z=>{
      const btn=document.createElement('button');
      btn.className='zone-btn';
      btn.dataset.zone=z.id;
      btn.setAttribute('aria-label',`${z.name} 구간 선택`);
      btn.innerHTML=`<span class="zone-emoji" aria-hidden="true">${z.icon}</span><span class="zone-label">${z.name}</span>`;
      btn.addEventListener('pointerenter',()=>preloadZoneBackgrounds(z.id),{passive:true});
      btn.addEventListener('focus',()=>preloadZoneBackgrounds(z.id));
      btn.addEventListener('click',()=>loadZone(z.id));
      zoneStrip.appendChild(btn);
    });
  }
  function applyZoneVisual(){const bgSrc=isNight?zone.night:zone.day;const bgUrl=resolveAssetUrl(bgSrc);loadBackground(bgSrc).then(ok=>{if(!ok)console.warn('배경 이미지 로드 실패',bgSrc,bgUrl)});bg.style.setProperty('--bg-img',`url("${bgUrl}")`);bg.style.backgroundImage=`url("${bgUrl}")`;bg.dataset.zone=zone.id;bg.dataset.mode=isNight?'night':'day';bg.dataset.src=bgSrc;document.documentElement.style.setProperty('--ray-opacity',String(Math.min(zone.light*.34,.34)));document.documentElement.style.setProperty('--caustic-opacity',String(Math.min(zone.caustic,.26)));const zstory=ZONE_STORY_DATABASE[zone.id];zoneDesc.textContent=`${zone.name} · ${(zstory?.oneLine)||zone.desc}`;cardTitle.textContent=`${zone.name} 버들치 관찰`;cardSub.textContent=(zstory?.observePoint)||`${zone.desc}에 맞춰 유영과 생태 레이어가 독립 적용됩니다.`;zoneStrip.querySelectorAll('.zone-btn').forEach(b=>b.classList.toggle('active',b.dataset.zone===zone.id));}
  function buildEcoLayer(){ecoLayer.innerHTML='';const r=safeRect();for(let i=0;i<zone.stone;i++){const s=document.createElement('div');s.className='stone';const w=rand(24,zone.id==='gipmul'?96:64);s.style.left=`${rand(-4,98)}%`;s.style.setProperty('--w',`${w}px`);s.style.opacity=String(rand(.42,.88));s.style.setProperty('--blur',`${rand(0,.45)}px`);s.style.transform=`translateY(${rand(-8,9)}px) rotate(${rand(-8,8)}deg)`;ecoLayer.appendChild(s)}for(let i=0;i<zone.plant;i++){const p=document.createElement('div');p.className='plant';p.style.left=`${rand(2,98)}%`;p.style.setProperty('--h',`${rand(zone.id==='gipmul'?50:34,zone.id==='mulmoi'?118:88)}px`);p.style.setProperty('--dur',`${rand(3.5,7.8)/(zone.flow+.45)}s`);p.style.setProperty('--tilt',`${rand(2,8+zone.flow*6)}`);p.style.opacity=String(rand(.35,.78));ecoLayer.appendChild(p)}}
  function pickBubbleX(profile){const range=pick(profile.x);return rand(range[0],range[1])}
  function makeParticles(){particles.innerHTML='';const profile=BUBBLE_PROFILES[zone.id]||BUBBLE_PROFILES.utmul,total=Math.max(18,Math.round(zone.particle*profile.count));for(let i=0;i<total;i++){const el=document.createElement('i'),isBubble=Math.random()<.58,isLarge=isBubble&&Math.random()<profile.large,size=isBubble?rand(profile.size[0],profile.size[1])*(isLarge?1.32:1):rand(1,3.1);el.className=`particle${isBubble?' bubble':''}${isLarge?' bubble-large':isBubble?' bubble-small':''}`;el.style.left=`${isBubble?pickBubbleX(profile):rand(0,100)}%`;el.style.top=`${isBubble?rand(profile.top[0],profile.top[1]):rand(0,110)}%`;el.style.setProperty('--s',`${size.toFixed(2)}px`);el.style.setProperty('--drift',`${rand(profile.drift[0],profile.drift[1])*(zone.flow+.48)}px`);el.style.setProperty('--dur',`${rand(profile.dur[0],profile.dur[1])/(zone.flow+.55)}s`);el.style.setProperty('--bubble-opacity',String(rand(profile.opacity[0],profile.opacity[1])));el.style.setProperty('--bubble-blur',`${isLarge?rand(0,.22):rand(0,.12)}px`);el.style.setProperty('--rise-start',`${rand(10,18)}vh`);el.style.setProperty('--rise-mid',`${rand(-58,-38)}vh`);el.style.animationDelay=`${rand(-18,0)}s`;particles.appendChild(el)}}
  function resetZoneRuntime(id){
    const now=performance.now();
    ZONE_RUNTIME.lastZoneId=currentZoneId;
    ZONE_RUNTIME.loadedAt=now;
    ZONE_RUNTIME.changeCount++;
    ZONE_RUNTIME.validation='reset';
    activeFishId=null;
    lastActiveFishId=null;
    nextPickAt=now+900;
    popup.classList.remove('show');
    fishes.forEach(f=>{ if(f.el&&f.el.root) f.el.root.classList.remove('clickable'); });
  }
  function validateZoneIsolation(){
    const clickableCount=fishes.filter(f=>f.clickable).length;
    const activeCount=fishes.filter(f=>f.activeFront).length;
    const ok=clickableCount<=1 && activeCount<=1 && !!ZONES[currentZoneId];
    ZONE_RUNTIME.validation=ok?'독립운영 정상':'점검 필요';
    return ok;
  }
  function loadZone(id){
    if(!ZONES[id])return;
    resetZoneRuntime(id);
    stopAudio({hide:true});
    currentZoneId=id;
    zone=ZONES[id];
    preloadZoneBackgrounds(id);
    applyZoneVisual();
    buildEcoLayer();
    makeParticles();
    initFishes();
    validateZoneIsolation();
    onZoneEntered(id);
  }

  function createFishElement(f){const root=document.createElement('div');root.className='fish-root';root.dataset.id=f.id;root.innerHTML=`<div class="fish-core"><div class="fish-body-wrap"><div class="fish-body-main"><img class="fish-body-frame" alt="버들치" draggable="false" /></div><i class="fish-belly"></i><i class="fish-eye"></i></div><div class="fish-tail-wrap"><img class="fish-tail" alt="" draggable="false" /></div><i class="fish-fin dorsal"></i><i class="fish-fin pectoral-l"></i><i class="fish-fin pectoral-r"></i></div>`;root.addEventListener('click',()=>onFishClick(f.id));fishLayer.appendChild(root);return{root,core:root.querySelector('.fish-core'),wrap:root.querySelector('.fish-body-wrap'),body:root.querySelector('.fish-body-main'),frame:root.querySelector('.fish-body-frame'),tailWrap:root.querySelector('.fish-tail-wrap'),tail:root.querySelector('.fish-tail'),belly:root.querySelector('.fish-belly'),dorsal:root.querySelector('.dorsal'),pectoralL:root.querySelector('.pectoral-l'),pectoralR:root.querySelector('.pectoral-r'),eye:root.querySelector('.fish-eye')}}
  function initFishes(){fishLayer.innerHTML='';const r=safeRect(),count=Math.round(rand(zone.fishCount[0],zone.fishCount[1]));fishes=[];for(let i=0;i<count;i++){const d=rand(zone.depth[0],zone.depth[1]),dir=Math.random()<.5?1:-1;const f={id:i+1,species:'beodeulchi',x:lerp(r.minX,r.maxX,(i+.5)/count)+rand(-28,28),y:rand(r.h*zone.behavior.y[0],r.h*zone.behavior.y[1]),depth:d,targetX:rand(r.minX,r.maxX),targetY:rand(r.h*zone.behavior.y[0],r.h*zone.behavior.y[1]),targetDepth:rand(zone.depth[0],zone.depth[1]),dir,desiredDir:dir,lastDirChangeAt:0,isTurning:false,turnStartAt:0,turnDuration:rand(900,1600),turnProgress:0,speed:rand(zone.behavior.speed[0],zone.behavior.speed[1]),targetSpeed:rand(zone.behavior.speed[0],zone.behavior.speed[1]),phase:rand(0,Math.PI*2),pattern:pick(zone.behavior.patterns),orbitAngle:rand(0,Math.PI*2),orbitRadius:rand(20,80),bodyRotation:0,tailSwing:0,finMotion:0,nextTargetAt:performance.now()+rand(900,5400),activeFront:false,clickable:false,cooldownUntil:0,seenCount:0,frameSrc:null,el:null};f.el=createFishElement(f);fishes.push(f)} }
  function pickNewTarget(f,now){const r=safeRect();f.targetX=rand(r.minX,r.maxX);f.targetY=rand(r.h*zone.behavior.y[0],r.h*zone.behavior.y[1]);f.targetDepth=rand(zone.depth[0],zone.depth[1]);f.targetSpeed=rand(zone.behavior.speed[0],zone.behavior.speed[1]);f.pattern=pick(zone.behavior.patterns);f.orbitRadius=rand(22,Math.min(96,r.w*.18));f.nextTargetAt=now+rand(3000,7600)}
  function updateDesiredDirection(f){const dx=f.targetX-f.x;if(Math.abs(dx)<CFG.deadZone)return;f.desiredDir=dx>CFG.hysteresis?1:-1}
  function startTurnIfNeeded(f,now){if(f.isTurning||f.desiredDir===f.dir||now-f.lastDirChangeAt<CFG.turnCooldown)return;f.isTurning=true;f.turnStartAt=now;f.turnDuration=rand(980,1600);f.turnProgress=0;f.targetSpeed=Math.max(zone.behavior.speed[0]*.75,f.speed*.62)}
  function updateTurn(f,now){if(!f.isTurning)return;const raw=clamp((now-f.turnStartAt)/f.turnDuration,0,1);f.turnProgress=ease(raw);if(raw>.62&&f.dir!==f.desiredDir){f.dir=f.desiredDir;f.lastDirChangeAt=now}if(raw>=1){f.isTurning=false;f.turnProgress=0;f.targetSpeed=rand(zone.behavior.speed[0],zone.behavior.speed[1])}}
  function updateMotion(f,now,dt){if(now>f.nextTargetAt)pickNewTarget(f,now);updateDesiredDirection(f);startTurnIfNeeded(f,now);updateTurn(f,now);const dx=f.targetX-f.x,dy=f.targetY-f.y,dist=Math.hypot(dx,dy)||1,nx=dx/dist,ny=dy/dist;f.speed=lerp(f.speed,f.targetSpeed,.035);f.orbitAngle+=(0.005+f.speed*.006)*(dt/16.67)*(f.id%2?1:-1);const turnBrake=f.isTurning?lerp(.42,.74,f.turnProgress):1;let ox=0,oy=0;if(f.pattern==='circle'){ox=Math.cos(f.orbitAngle+f.phase)*f.orbitRadius*.020;oy=Math.sin(f.orbitAngle+f.phase)*f.orbitRadius*.014}else if(f.pattern==='ellipse'){ox=Math.cos(f.orbitAngle+f.phase)*f.orbitRadius*.030;oy=Math.sin(f.orbitAngle+f.phase)*f.orbitRadius*.010}else if(f.pattern==='s'||f.pattern==='flow'){oy=Math.sin(f.orbitAngle+f.phase)*f.orbitRadius*.016;ox=Math.cos(f.orbitAngle*.7+f.phase)*f.orbitRadius*.010}else if(f.pattern==='deep'||f.pattern==='pause'){oy=Math.sin(f.orbitAngle*.55+f.phase)*f.orbitRadius*.007;ox=Math.cos(f.orbitAngle*.42+f.phase)*f.orbitRadius*.007}else{ox=Math.sin(f.orbitAngle+f.phase)*f.orbitRadius*.016;oy=Math.abs(Math.cos(f.orbitAngle+f.phase))*f.orbitRadius*.010}const flowPush=zone.flow*.08;f.x+=((nx*f.speed*1.85)+ox+flowPush*f.dir)*turnBrake*(dt/16.67);f.y+=((ny*f.speed*1.22)+oy+Math.sin(now*.0011+f.phase)*.045)*turnBrake*(dt/16.67);f.depth=lerp(f.depth,f.targetDepth,f.activeFront?.024:.014);const r=safeRect();if(f.x<r.minX-80||f.x>r.maxX+80||f.y<r.minY-50||f.y>r.maxY+50)pickNewTarget(f,now);f.x=clamp(f.x,r.minX-84,r.maxX+84);f.y=clamp(f.y,r.minY-54,r.maxY+54)}
  function getFishW(f){const r=safeRect(),base=r.w<480?112:r.w<900?138:160;return base*(.52+f.depth*.72)}
  function avoidCollision(){for(let loop=0;loop<5;loop++)for(let i=0;i<fishes.length;i++)for(let j=i+1;j<fishes.length;j++){const a=fishes[i],b=fishes[j],dx=b.x-a.x,dy=b.y-a.y,minX=(getFishW(a)+getFishW(b))*.27,minY=(getFishW(a)+getFishW(b))*.075;if(Math.abs(dx)<minX&&Math.abs(dy)<minY&&Math.abs(a.depth-b.depth)<.15){const push=(minY-Math.abs(dy)+2)*.2,sign=dy>=0?1:-1;if(a.activeFront&&!b.activeFront){b.y+=sign*push;b.targetDepth=Math.max(zone.depth[0],b.targetDepth-.04)}else if(b.activeFront&&!a.activeFront){a.y-=sign*push;a.targetDepth=Math.max(zone.depth[0],a.targetDepth-.04)}else{a.y-=sign*push*.5;b.y+=sign*push*.5}}}}
  function updateFrontSelection(now){if(activeFishId!=null||now<nextPickAt)return;fishes.forEach(f=>{if(!f.clickable){f.activeFront=false;}});const r=safeRect(),candidates=fishes.filter(f=>f.id!==lastActiveFishId&&now>f.cooldownUntil&&!f.isTurning);if(!candidates.length)return;const bag=[];candidates.forEach(f=>{const centerScore=1-Math.min(1,Math.abs(f.x-r.w*.5)/(r.w*.5));const seenScore=Math.max(1,5-f.seenCount);const weight=Math.round(2+centerScore*6+seenScore);for(let k=0;k<weight;k++)bag.push(f)});const f=pick(bag);f.activeFront=true;f.targetDepth=zone.observeDepth;f.targetX=rand(r.centerMin,r.centerMax);f.targetY=rand(r.h*.36,r.h*.62);f.targetSpeed=rand(zone.behavior.speed[0]*.72,zone.behavior.speed[1]*.72);f.seenCount++}
  function releaseActiveFish(now){if(activeFishId==null)return;const f=fishes.find(x=>x.id===activeFishId);if(!f)return;f.activeFront=false;f.clickable=false;f.cooldownUntil=now+rand(CFG.cooldown[0],CFG.cooldown[1]);f.targetDepth=rand(zone.depth[0],Math.min(.62,zone.depth[1]));lastActiveFishId=f.id;activeFishId=null;nextPickAt=now+rand(CFG.repickDelay[0],CFG.repickDelay[1]);f.el.root.classList.remove('clickable')}
  function updateClickable(f,now){const r=safeRect();const near=f.x>=r.centerMin&&f.x<=r.centerMax,front=f.depth>=CFG.clickableDepth,single=activeFishId==null||activeFishId===f.id;const crowded=fishes.some(o=>o.id!==f.id&&Math.abs(o.x-f.x)<getFishW(f)*.54&&Math.abs(o.y-f.y)<getFishW(f)*.18&&o.depth>.56);const can=f.activeFront&&near&&front&&single&&!crowded&&!f.isTurning;f.clickable=can;if(can){activeFishId=f.id;f.el.root.classList.add('clickable')}else f.el.root.classList.remove('clickable');if(activeFishId===f.id&&(f.x<r.w*.14||f.x>r.w*.86||f.depth<.66))releaseActiveFish(now)}
  function onFishClick(id){
    const f=fishes.find(x=>x.id===id);
    if(!f||!f.clickable||ACQUIRE_CARD_STATE.isOpen)return;
    const speciesId='beodeulchi';
    const firstFound=markSpeciesDiscovered(speciesId, zone.name);
    notifyMissionProgress('observe_species', speciesId, zone.id);
    if(firstFound){
      onFirstDiscovery(speciesId, zone.id);
      popup.classList.remove('show');
      showAcquireCard(speciesId, zone.id);
    }else{
      popupTitle.textContent=SPECIES.beodeulchi.name;
      popupZone.textContent=`${zone.name}에서 발견`;
      popupText.textContent=`${SPECIES.beodeulchi.text} 지금 구간은 ${zone.name}입니다. ${SPECIES_ZONE_STORY.beodeulchi?.[zone.id]||zone.desc} ${ZONE_STORY_DATABASE[zone.id]?.observePoint||''}`;
      infoLayer.textContent=SPECIES.beodeulchi.layer;
      infoFlow.textContent=zone.flow>.6?'빠른 물살':zone.flow<.3?'느린 물살':'부드러운 물살';
      popup.classList.add('show');setActivePopup('fish',{speciesId});
    }
    releaseActiveFish(performance.now());
  }


  function closeDexPanels(){stopAudio({hide:true,reason:'dex-close'});dexPanel.classList.remove('show');cardDetail.classList.remove('show')}

  function closeMissionPanel(){stopAudio({hide:true,reason:'mission-panel-close'});missionPanel.classList.remove('show');if(UI_STATE.activePanel==='mission')setActivePanel(null)}
  function openMissionPanel(){closeAcquiredCard();closeDexPanels();closeCameraPanels();closeExplorePanels();featurePanel.classList.remove('show');popup.classList.remove('show');renderMissionList();missionPanel.classList.add('show');setActivePanel('mission')}
  function renderMissionList(){
    const ids=Object.keys(MISSION_DATABASE);
    const done=ids.filter(id=>MISSION_STATE[id]?.completed).length;
    missionSummary.textContent=`완료 ${done} / ${ids.length}`;
    missionList.innerHTML=ids.map(id=>{
      const m=MISSION_DATABASE[id], s=MISSION_STATE[id]||{progress:0,completed:false,rewardClaimed:false};
      const pct=getMissionPercent(id);
      const badge=s.rewardClaimed?'보상 받음':s.completed?'완료':'진행 중';
      const btn=s.completed?`<button class="mission-reward-btn" data-claim-mission="${id}" ${s.rewardClaimed?'disabled':''}>${s.rewardClaimed?'🌟 받았어요':'보상 받기 🎁'}</button>`:'';
      return `<article class="mission-card ${s.completed?'completed':''} ${s.rewardClaimed?'claimed':''}"><div class="mission-card-emoji">${m.emoji}</div><div class="mission-content"><div class="mission-headline"><strong>${m.title}</strong><span class="mission-badge">${badge}</span></div><p class="mission-text">${m.kidText}</p><div class="mission-bar" aria-label="${m.title} 진행률"><div class="mission-fill" style="width:${pct}%"></div></div><div class="mission-foot"><span class="mission-count">진행 ${Math.min(s.progress,m.goal)} / ${m.goal}</span><span class="mission-reward">보상: ${m.rewardLabel}</span>${btn}</div></div></article>`;
    }).join('');
    missionList.querySelectorAll('[data-claim-mission]').forEach(btn=>btn.addEventListener('click',()=>claimMissionReward(btn.dataset.claimMission)));
  }

  function renderDexFilters(){const filters=[['all','전체'],['acquired','획득'],['locked','미획득'],['웃물','웃물'],['여울','여울'],['잔여울','잔여울'],['깊물','깊물'],['물모이','물모이']];dexFilter.innerHTML=filters.map(([id,label])=>`<button class="${dexFilterValue===id?'active':''}" data-dex-filter="${id}">${label}</button>`).join('');dexFilter.querySelectorAll('[data-dex-filter]').forEach(btn=>btn.addEventListener('click',()=>{dexFilterValue=btn.dataset.dexFilter;renderDexCards()}))}
  function renderDexCards(){renderDexFilters();const viewCards=DEX_CARDS.map(getCardView);const acquired=viewCards.filter(c=>c.acquired).length;dexProgress.textContent=`수집 ${acquired} / ${DEX_CARDS.length}`;let list=viewCards;if(dexFilterValue==='acquired')list=list.filter(c=>c.acquired);else if(dexFilterValue==='locked')list=list.filter(c=>!c.acquired);else if(dexFilterValue!=='all')list=list.filter(c=>c.zones.includes(dexFilterValue));dexGrid.innerHTML=list.map(c=>{const rarityClass=c.acquired?(c.rarity==='rare'?'rare':c.rarity==='normal'?'normal':'common'):'lock';const tag=c.acquired?`${c.zones.join(' · ')}<br>${c.type}${c.seenCount?` · ${c.seenCount}회 관찰`:''}`:'아직 발견하지 못했어요';return `<button class="dex-card ${c.acquired?'':'locked'}" data-card-id="${c.id}" aria-label="${c.name} 카드 보기"><span class="card-rarity ${rarityClass}">${c.acquired?c.rarityLabel:'미발견'}</span><span class="card-star">${c.acquired?'⭐':' '}</span><div class="dex-fish-img"><img src="${freshUrl(c.img)}" alt="${c.name}"></div>${c.acquired?'':'<div class="lock-mark">🔒</div>'}<div class="dex-name">${c.name}</div><div class="dex-tags">${tag}</div></button>`}).join('');dexGrid.querySelectorAll('[data-card-id]').forEach(btn=>btn.addEventListener('click',()=>openCardDetail(btn.dataset.cardId)))}
  function openDexPanel(){renderDexCards();dexPanel.classList.add('show');featurePanel.classList.remove('show');closeMissionPanel();closeCameraPanels();closeExplorePanels();closeAcquiredCard();popup.classList.remove('show');setActivePanel('dex')}
  function openCardDetail(id){const c=getCardView(DEX_CARDS.find(x=>x.id===id)||DEX_CARDS[0]);setActivePopup('card',{speciesId:id});detailName.textContent=c.name;detailMeta.textContent=c.acquired?`${c.zones.join(' · ')} · ${c.type}`:'미발견 카드';detailImage.src=freshUrl(c.img);detailHero.classList.toggle('locked',!c.acquired);detailLocked.style.display=c.acquired?'none':'grid';detailHabitat.textContent=c.acquired?c.habitat:'아직 발견하지 못했어요. 수족관을 탐사해 보세요.';detailFeature.textContent=c.acquired?c.feature:'발견하면 자세한 특징이 열립니다.';detailPoint.textContent=c.acquired?`${c.point}${c.firstZone?` · 첫 발견: ${c.firstZone}`:''}`:'여러 존을 차례대로 눌러 탐사해 보세요.';detailListen.dataset.audioId=({beodeulchi:'species_beodeulchi',piramii:'species_piramii',siri:'species_siri',gaksi:'species_gaksi',morae:'species_morae'}[c.id]||'dex_intro');cardDetail.classList.add('show')}

  function openFeaturePanel(type){
    if(type==='explore'){openExplorePanel();return}
    if(type==='dex'){openDexPanel();return}
    if(type==='mission'){openMissionPanel();return}
    if(type==='camera'){openCameraPanel();return}
    const data=FEATURE_MENUS[type]||FEATURE_MENUS.explore;
    featureIcon.textContent=data.icon; featureTitle.textContent=data.title; featureSub.textContent=data.sub;
    featureBody.innerHTML=data.rows.map(r=>`<div class="feature-row"><div><strong>${r[1]}</strong><small>${r[2]}</small></div><em>${r[0]}</em></div>`).join('');
    featurePanel.classList.add('show'); popup.classList.remove('show'); closeAcquiredCard();setActivePanel('feature');
  }
  function showAcquireCard(speciesId='beodeulchi', zoneId=currentZoneId){
    const card=CARD_DATABASE[speciesId]||CARD_DATABASE.beodeulchi;
    const dex=DEX_CARDS.find(c=>c.id===speciesId);
    const z=ZONES[zoneId]||zone;
    ACQUIRE_CARD_STATE.isOpen=true;
    playAudioById('acquire_beodeulchi');
    ACQUIRE_CARD_STATE.speciesId=speciesId;
    ACQUIRE_CARD_STATE.zoneId=zoneId;
    ACQUIRE_CARD_STATE.openedAt=performance.now();setActivePopup('acquire',{speciesId});
    if(dex && isCardDiscovered(speciesId)){
      acquireImage.innerHTML=`<img src="${freshUrl(dex.img)}" alt="${dex.name} 카드 이미지">`;
    }else{
      acquireImage.textContent=card.emoji || '🐟';
    }
    acquireName.textContent=card.name;
    acquireZone.textContent=`${z.icon || '💧'} ${z.name || zone.name}에서 발견`;
    acquireQuestion.textContent='도감에 저장할까요?';
    acquireReward.textContent='🎁 첫 발견 카드 획득';
    acquireLines.innerHTML=card.lines.map(line=>`<span>${line}</span>`).join('');
    popup.classList.remove('show');
    featurePanel.classList.remove('show');
    closeDexPanels();
    acquireBackdrop.classList.add('show');
    acquireCard.classList.add('show');
    notifyAudioReady(speciesId);
  }
  function closeAcquiredCard(){clearActivePopup('acquire');
    ACQUIRE_CARD_STATE.isOpen=false;
    acquireCard.classList.remove('show');
    acquireBackdrop.classList.remove('show');
  }
  function goToDexFromAcquiredCard(){
    const speciesId=ACQUIRE_CARD_STATE.speciesId || 'beodeulchi';
    onCardSaved(speciesId);
    closeAcquiredCard();
    dexFilterValue='acquired';
    openDexPanel();
    setTimeout(()=>{
      const card=dexGrid.querySelector(`[data-card-id="${speciesId}"]`);
      if(card){card.scrollIntoView({block:'center',inline:'center',behavior:'smooth'});card.classList.add('selected');setTimeout(()=>card.classList.remove('selected'),1200)}
    },80);
  }
  function continueExplorationFromAcquiredCard(){
    closeAcquiredCard();
    nextPickAt=performance.now()+900;
  }
  function closeFloatingPanels(){featurePanel.classList.remove('show'); closeMissionPanel(); closeAcquiredCard(); closeDexPanels(); closeCameraPanels(); closeExplorePanels();}

  function updateFrame(f){const src=bodyFrameFor(f);if(f.frameSrc!==src){f.el.frame.src=freshUrl(src);f.frameSrc=src}}
  function renderFish(f,now){updateFrame(f);const r=safeRect(),base=r.w<480?112:r.w<900?138:160,scale=clamp(.52+f.depth*.72,.58,1.2),opacity=clamp(.44+f.depth*.56,.48,1),blur=f.depth<.48?1.1:f.depth<.65?.38:0,z=Math.round(100+f.depth*220),t=now*.001,turnPower=f.isTurning?Math.sin(Math.PI*f.turnProgress):0,turnSign=f.desiredDir;const bodyTarget=Math.sin(t*2.05+f.phase)*(1+f.speed*1.4)+turnSign*turnPower*5.4;const tailTarget=Math.sin(t*(5.1+f.speed*3.8)+f.phase)*(3.8+f.speed*3.8+turnPower*7.0);const finTarget=Math.sin(t*3.5+f.phase*.7)*(0.85+turnPower*2.6);f.bodyRotation=lerp(f.bodyRotation,bodyTarget,.08);f.tailSwing=lerp(f.tailSwing,tailTarget,.12);f.finMotion=lerp(f.finMotion,finTarget,.08);const rootRot=turnSign*turnPower*2.2+Math.sin(t*.8+f.phase)*.45,x=Math.round((f.x-base*scale*.5)*100)/100,y=Math.round((f.y-base*scale*.28)*100)/100;f.el.root.style.setProperty('--fish-w',`${base}px`);f.el.root.style.opacity=opacity.toFixed(3);f.el.root.style.filter=`${f.clickable?'drop-shadow(0 0 12px rgba(255,236,141,.68)) drop-shadow(0 16px 16px rgba(0,0,0,.24))':'drop-shadow(0 12px 12px rgba(0,0,0,.14))'} blur(${blur.toFixed(2)}px)`;f.el.root.style.zIndex=z;f.el.root.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale.toFixed(3)}) rotate(${rootRot.toFixed(2)}deg)`;f.el.core.style.transform=`rotateY(${(turnPower*7*f.dir).toFixed(2)}deg)`;f.el.wrap.style.transform=`translate3d(${(turnPower*.55*f.dir).toFixed(2)}px,0,0) rotate(${(f.bodyRotation*.32).toFixed(2)}deg)`;f.el.body.style.transform=`rotate(${f.bodyRotation.toFixed(2)}deg)`;f.el.tail.src=freshUrl(Math.abs(f.tailSwing)>3?(f.tailSwing>0?ASSETS.tailRight:ASSETS.tailLeft):ASSETS.tailIdle);f.el.tailWrap.style.transform=`translate3d(${(-turnPower*.7*f.dir).toFixed(2)}px,0,0) rotate(${(f.tailSwing*.46).toFixed(2)}deg)`;f.el.belly.style.transform=`translate3d(${(Math.sin(t*1.35+f.phase)*.7).toFixed(2)}px,${(turnPower*.45).toFixed(2)}px,0)`;f.el.dorsal.style.transform=`rotate(${(f.finMotion*.5+turnPower*1.6*turnSign).toFixed(2)}deg)`;f.el.pectoralL.style.transform=`rotate(${(8+f.finMotion+turnPower*3.4*turnSign).toFixed(2)}deg)`;f.el.pectoralR.style.transform=`rotate(${(28-f.finMotion*.6+turnPower*2.8*turnSign).toFixed(2)}deg)`;f.el.eye.style.opacity=(f.clickable?.56:0).toFixed(2)}
  function tick(now){const dt=Math.min(CFG.maxDt,now-lastT||16.67);lastT=now;updateFrontSelection(now);fishes.forEach(f=>updateMotion(f,now,dt));avoidCollision();fishes.forEach(f=>updateClickable(f,now));fishes.forEach(f=>renderFish(f,now));const af=fishes.find(f=>f.id===activeFishId);validateZoneIsolation();debugChip.textContent=af?`v30A-1 · ${zone.name} · 관찰 #${af.id} · depth ${af.depth.toFixed(2)} · ${ZONE_RUNTIME.validation}`:`v30A-1 · ${zone.name} · 독립 생태 운영 · ${fishes.length}마리 · ${ZONE_RUNTIME.validation}`;requestAnimationFrame(tick)}

  function getRuntimeAudit(){
    const missionIds=Object.keys(MISSION_DATABASE);
    const discoveredIds=DEX_CARDS.filter(c=>isCardDiscovered(c.id)).map(c=>c.id);
    const clickable=fishes.filter(f=>f.clickable);
    const activeFront=fishes.filter(f=>f.activeFront);
    const outOfSafeArea=fishes.filter(f=>{
      const r=safeRect();
      return f.y<r.minY-56 || f.y>r.maxY+56 || f.x<r.minX-92 || f.x>r.maxX+92;
    }).map(f=>f.id);
    const overlapping=[];
    for(let i=0;i<fishes.length;i++){
      for(let j=i+1;j<fishes.length;j++){
        const a=fishes[i],b=fishes[j];
        if(Math.abs(a.x-b.x)<(getFishW(a)+getFishW(b))*.22 && Math.abs(a.y-b.y)<(getFishW(a)+getFishW(b))*.06 && Math.abs(a.depth-b.depth)<.12) overlapping.push([a.id,b.id]);
      }
    }
    const problems=[];
    if(clickable.length>1) problems.push(`clickable ${clickable.length}마리`);
    if(activeFront.length>1) problems.push(`activeFront ${activeFront.length}마리`);
    if(outOfSafeArea.length) problems.push(`safe area 이탈: ${outOfSafeArea.join(',')}`);
    if(overlapping.length) problems.push(`겹침 후보: ${overlapping.map(p=>p.join('-')).join(',')}`);
    if(!ZONES[currentZoneId]) problems.push(`알 수 없는 zone: ${currentZoneId}`);
    return {
      version:'v30A-1-codex-stabilized',
      cache:DEV_CACHE,
      zone:{id:currentZoneId,name:zone.name,isNight},
      viewport:{w:window.innerWidth,h:window.innerHeight,orientation:window.innerWidth>window.innerHeight?'landscape':'portrait'},
      fish:{count:fishes.length,activeFishId,clickableIds:clickable.map(f=>f.id),activeFrontIds:activeFront.map(f=>f.id),overlapping,outOfSafeArea},
      background:getBackgroundLoadAudit(),
      ui:{activePanel:UI_STATE.activePanel,activePopup:UI_STATE.activePopup},
      audio:{isOpen:AUDIO_STATE.isOpen,isSpeaking:AUDIO_STATE.isSpeaking,currentId:AUDIO_STATE.currentId},
      progress:{missionsCompleted:missionIds.filter(id=>MISSION_STATE[id]?.completed).length,missionsTotal:missionIds.length,discovered:discoveredIds},
      validation:ZONE_RUNTIME.validation,
      problems
    };
  }
  window.PondangV30A1Debug={
    audit:getRuntimeAudit,
    debugBackground:getBackgroundLoadAudit,
    freshUrl,
    reloadFresh(){location.replace(`${location.pathname}?inapp=v30A1&cache=${Date.now()}`)},
    async clearRuntimeCache(){
      if('caches' in window){
        const keys=await caches.keys();
        await Promise.all(keys.map(key=>caches.delete(key)));
      }
      this.reloadFresh();
    }
  };

  modeBtn.addEventListener('click',()=>{isNight=!isNight;app.classList.toggle('night',isNight);modeBtn.textContent=isNight?'☀️':'🌙';applyZoneVisual();updateMissionProgress('time_mode_changed',{mode:isNight?'night':'day',zoneId:currentZoneId})});fullBtn.addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen?.()});closePopup.addEventListener('click',()=>{popup.classList.remove('show');stopAudio({hide:true});});popupAudio?.addEventListener('click',()=>playAudioById('species_beodeulchi'));audioBtn?.addEventListener('click',playCurrentZoneAudio);audioClose?.addEventListener('click',()=>stopAudio({hide:true}));audioStop?.addEventListener('click',()=>stopAudio({hide:true}));audioReplay?.addEventListener('click',replayAudio);featureClose.addEventListener('click',()=>featurePanel.classList.remove('show'));missionClose.addEventListener('click',closeMissionPanel);featureAction.addEventListener('click',()=>showAcquireCard('beodeulchi', currentZoneId));saveCard.addEventListener('click',goToDexFromAcquiredCard);keepExplore.addEventListener('click',continueExplorationFromAcquiredCard);acquireClose.addEventListener('click',continueExplorationFromAcquiredCard);acquireBackdrop.addEventListener('click',continueExplorationFromAcquiredCard);dexClose.addEventListener('click',()=>dexPanel.classList.remove('show'));detailClose.addEventListener('click',()=>{cardDetail.classList.remove('show');stopAudio({hide:true});});detailClose2.addEventListener('click',()=>{cardDetail.classList.remove('show');stopAudio({hide:true});});cardDetail.addEventListener('click',e=>{if(e.target===cardDetail){cardDetail.classList.remove('show');stopAudio({hide:true,reason:'card-detail-backdrop'});}});detailListen.addEventListener('click',()=>{playAudioById(detailListen.dataset.audioId==='beodeulchi'?'species_beodeulchi':detailListen.dataset.audioId||'species_beodeulchi')});document.querySelectorAll('[data-menu]').forEach(btn=>btn.addEventListener('click',()=>openFeaturePanel(btn.dataset.menu)));cameraClose?.addEventListener('click',closeCameraPanels);captureShot?.addEventListener('click',saveCurrentAquariumCapture);openCaptureGallery?.addEventListener('click',openCaptureGalleryPanel);captureGalleryClose?.addEventListener('click',closeCameraPanels);captureDetailClose?.addEventListener('click',closeCaptureDetail);captureDetailClose2?.addEventListener('click',closeCaptureDetail);captureDetail?.addEventListener('click',e=>{if(e.target===captureDetail)closeCaptureDetail()});captureDownload?.addEventListener('click',downloadSelectedCapture);captureDelete?.addEventListener('click',deleteSelectedCapture);exploreClose?.addEventListener('click',closeExplorePanels);openGpsGuide?.addEventListener('click',openGpsGuidePanel);recommendZoneBtn?.addEventListener('click',()=>{updateGpsResult('maybe',GPS_STATE.lastApproxZoneId||currentZoneId);saveExploreLog({zoneId:GPS_STATE.lastApproxZoneId||currentZoneId,actionType:'gps_check',source:'manual',note:'가까운 탐사 구간을 추천했어요.',timeMode:isNight?'night':'day'});});openExploreLog?.addEventListener('click',renderExploreLogList);startRecommendedZone?.addEventListener('click',()=>{const zid=gpsResultCard?.dataset.zone||GPS_STATE.lastApproxZoneId||currentZoneId;loadZone(zid);closeExplorePanels();});gpsGuideClose?.addEventListener('click',closeGpsGuide);cancelGpsBtn?.addEventListener('click',closeGpsGuide);gpsGuideBackdrop?.addEventListener('click',closeGpsGuide);requestGpsBtn?.addEventListener('click',requestUserLocation);window.addEventListener('resize',()=>{buildEcoLayer();makeParticles();fishes.forEach(f=>pickNewTarget(f,performance.now()))},{passive:true});window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(AUDIO_STATE.isOpen)stopAudio({hide:true});else if(ACQUIRE_CARD_STATE.isOpen)continueExplorationFromAcquiredCard();else if(cardDetail.classList.contains('show'))cardDetail.classList.remove('show');else if(captureDetail?.classList.contains('show'))closeCaptureDetail();else if(gpsGuide?.classList.contains('show'))closeGpsGuide();else if(explorePanel?.classList.contains('show'))closeExplorePanels();else if(cameraPanel?.classList.contains('show')||captureGallery?.classList.contains('show'))closeCameraPanels();else if(missionPanel.classList.contains('show'))closeMissionPanel();else if(dexPanel.classList.contains('show'))dexPanel.classList.remove('show');else popup.classList.remove('show')}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAudio({hide:true,reason:'hidden'});});
    loadExploreLogs();loadCaptures();initGpsState();queryPermissionState();preload();setupZoneButtons();applyMenuIconSlots();loadZone(currentZoneId);requestAnimationFrame(tick);
})();

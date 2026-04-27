// 어종 데이터 분리 기준 파일입니다. 새 어종은 이 파일과 assets/fish/{speciesId}/만 추가합니다.
export const SPECIES_CONFIG_VERSION = 'v25R-species-schema';
export const SPECIES_ASSET_MAP = {
  beodeulchi: {
    name: '버들치',
    aquarium: {
      sideRight: './assets/fish/beodeulchi/aquarium/beodeulchi_side_right.png',
      sideLeft: './assets/fish/beodeulchi/aquarium/beodeulchi_side_left.png',
      quarterRight: './assets/fish/beodeulchi/aquarium/beodeulchi_quarter_right.png',
      quarterLeft: './assets/fish/beodeulchi/aquarium/beodeulchi_quarter_left.png',
      frontAngle: './assets/fish/beodeulchi/aquarium/beodeulchi_front_angle.png',
      tailIdle: './assets/fish/beodeulchi/aquarium/beodeulchi_tail_idle.png',
      tailLeft: './assets/fish/beodeulchi/aquarium/beodeulchi_tail_left.png',
      tailRight: './assets/fish/beodeulchi/aquarium/beodeulchi_tail_right.png'
    },
    cardImage: './assets/fish/beodeulchi/card/beodeulchi_card.png',
    dexImage: './assets/fish/beodeulchi/dex/beodeulchi_dex.png',
    popupImage: './assets/fish/beodeulchi/popup/beodeulchi_popup.png'
  }
};

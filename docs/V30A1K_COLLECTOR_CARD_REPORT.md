# v30A1K Collector Card Upgrade Report

## 기준
- branch: v30a1k-card-collector-upgrade
- purpose: 기존 코덱 기준 UI를 유지하면서 도감 카드와 상세 팝업을 수집 카드형으로 고도화한다.

## 보존한 구조
- 상단 타이틀: 퐁당퐁당 곤지암천
- 상단 버튼: 음성 / 낮밤 / 전체화면
- 5존: 웃물 / 여울 / 잔여울 / 깊물 / 물모이
- 하단 메뉴: 탐사 / 도감 / 미션 / 카메라
- 기존 물고기 유영
- 기존 배경 레이어
- 기존 버튼 이벤트 구조

## 추가 파일
- app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/collector-card-v30a1k.js

## 연결 파일
- app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/utmul-day-q88-override.js

## 적용 내용
- 도감 카드에 collector-card class 추가
- 카드번호 표시: GJ-001 등
- 등급 표시: LOCAL HERO, COMMON, RARE, SPECIAL
- 레벨 표시: Lv.2 ~ Lv.4
- 획득존 배지 표시
- 상세 팝업에 collector-detail class 추가
- 상세 팝업에 카드번호/등급/레벨/서식층 배지 추가
- 첫 발견 카드에 JOHN CHOI 표기 추가
- 하단 메뉴 아이콘에 collector-nav class 추가

## 안정성 원칙
- index.html 전체 재작성 없음
- 메뉴명 변경 없음
- 하단 메뉴 순서 변경 없음
- 설정 메뉴 추가 없음
- 기존 DOM id 변경 없음
- 기존 이벤트 구조 변경 없음

## 남은 검수
- 웹주소 기준 도감 버튼 클릭
- 카드 배지 표시 여부
- 상세 팝업 배지 표시 여부
- 첫 발견 카드 JOHN CHOI 표기 여부
- 탐사/도감/미션/카메라 메뉴 반응 유지 여부
- 콘솔 오류 여부

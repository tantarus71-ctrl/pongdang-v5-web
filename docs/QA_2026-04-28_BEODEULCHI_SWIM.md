# 2026-04-28 버들치 유영 QA 및 안정화

## 기준 안정본
- 기준 폴더: `app_assets/pongdang_gonjiam_v30A1_audio_stability_final`
- 기준 파일: `index.html`, `src/app.js`, `src/styles/main.css`
- 이번 단계는 버들치 유영 엔진만 수정하고 배경, 메뉴, 오디오, 팝업 구조는 건드리지 않는다.

## 이번 단계 목표
1. 버들치 겹침 현상 재확인 및 회피 강화
2. 화면 밖으로 나간 버들치가 자연스럽게 중앙권으로 복귀
3. 클릭 가능한 전면 버들치는 항상 1마리만 유지
4. 턴, 꼬리, 지느러미 움직임을 더 자연스럽게 조정

## 적용 내용
- `guideFishBackInside(f, now)`로 화면 경계 밖 물고기의 목표점을 중앙 관찰권으로 재설정한다.
- `clampFishSoft(f)`로 경계 보정이 갑자기 튀지 않게 완충 영역 안에서 제한한다.
- `avoidCollision()`을 x/y/depth 동시 보정 방식으로 강화했다.
- activeFront 물고기 주변의 다른 물고기는 뒤쪽 depth로 후퇴하고 속도를 낮춘다.
- `enforceSingleActiveFish(now)`를 추가해 clickable 또는 activeFront가 2마리 이상 생기는 예외를 즉시 정리한다.
- 관찰이 끝난 물고기는 `releaseActiveFish(now)`에서 클릭 해제 후 진행 방향 쪽으로 빠져나가며 뒤쪽 수심으로 복귀한다.
- 꼬리와 지느러미 진폭을 낮추고 보간값을 완만하게 조정해 장난감처럼 파닥이는 느낌을 줄였다.

## 검증 체크리스트
- JS 문법 검사: `node --check app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/app.js` 통과
- 충돌 방지: 같은 depth에서 x/y가 가까운 물고기를 6회 반복 회피 보정
- 화면 밖 복귀: 완충 margin을 넘으면 중앙권 target으로 재지정
- 클릭 제한: `enforceSingleActiveFish()`로 클릭 가능 물고기 1마리 유지
- 턴 안정화: 턴 중 과한 몸통/꼬리/지느러미 회전값 완화

## 수동 QA 방법
1. 앱 실행 후 각 존에서 20~30초 관찰한다.
2. 물고기가 겹치면 겹친 순간 바로 y/depth가 분리되는지 본다.
3. 화면 밖으로 나간 개체가 2~3초 안에 중앙권 목표로 돌아오는지 본다.
4. 개발자 콘솔에서 `PondangV30A1Debug.audit().fish`를 확인한다.
5. `.pond-fish.clickable` 클래스가 동시에 2개 이상 생기지 않는지 확인한다.

## 보류 및 리스크
- 현재 Codex in-app browser 자동 클릭/스크린샷 QA는 OS 접근 제한으로 실행하지 못했다.
- 실제 손 터치 기준의 자연스러움은 사용자가 화면에서 직접 20~30초 관찰하며 미세 조정할 필요가 있다.

## 다음 단계 제안
- 다음 1단계는 실제 기기 기준으로 존별 30초 관찰 QA를 하고, 버들치 속도와 꼬리 진폭만 소폭 튜닝한다.

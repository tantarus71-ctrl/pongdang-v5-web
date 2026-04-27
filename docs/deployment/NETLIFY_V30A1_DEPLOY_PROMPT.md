# Netlify v30A1 배포 프롬프트

## 목표
`pongdang_gonjiam_v30A1_audio_stability_final` 버전을 Netlify 정적 사이트로 배포한다. 배포 대상은 현재 v30A1 폴더이며, 저장소의 다른 실험본이나 루트 파일을 섞어 올리지 않는다.

## 배포 대상
```text
app_assets/pongdang_gonjiam_v30A1_audio_stability_final
```

## 현재 Netlify 프로젝트
```text
name: pongdong-johnchoi
siteId: a534d145-451b-4199-88b1-17437c29f2c6
primarySiteUrl: http://pongdong-johnchoi.netlify.app
```

## 배포 원칙
- 정적 사이트로 배포한다.
- 별도 build command는 사용하지 않는다.
- publish directory는 v30A1 폴더 하나로 고정한다.
- `index.html`, `src/app.js`, `src/styles/main.css`, `assets/`가 함께 올라가야 한다.
- 배경 10장, 버들치 수족관/카드/도감/팝업 자산이 누락되면 실패로 본다.
- 로컬에서 `node --check src/app.js`를 먼저 통과시킨다.
- Netlify 배포 전 HTTP 로컬 응답이 `200`인지 확인한다.
- 배포 후 Netlify URL에서 첫 화면, 존 메뉴, 낮/저녁 버튼, 하단 메뉴를 확인한다.

## Netlify CLI 명령
Preview 배포:
```powershell
npx netlify deploy --dir app_assets/pongdang_gonjiam_v30A1_audio_stability_final
```

Production 배포:
```powershell
npx netlify deploy --prod --dir app_assets/pongdang_gonjiam_v30A1_audio_stability_final
```

## Netlify 커넥터 배포 기준
CLI를 사용할 수 없을 때는 Netlify 커넥터의 `deploy-site` 작업을 사용한다.

```text
operation: deploy-site
siteId: a534d145-451b-4199-88b1-17437c29f2c6
```

저장소 루트의 `netlify.toml`은 publish directory를 v30A1 폴더로 고정한다.

## 배포 전 체크리스트
- `node --check app_assets/pongdang_gonjiam_v30A1_audio_stability_final/src/app.js`
- `index.html` 로컬 응답 200
- `src/app.js` 로컬 응답 200
- `src/styles/main.css` 로컬 응답 200
- 배경 10개 이미지 응답 200
- `docs/development_program/ALWAYS_REFERENCE_DEVELOPMENT_PLAN.md` 최신화

## 배포 후 체크리스트
- Netlify deploy URL 열림
- 첫 화면 배경 표시
- 웃물/여울/잔여울/깊물/물모이 메뉴 클릭
- 낮/저녁 전환
- 물방울/광선/물결 레이어가 배경을 가리지 않음
- 물고기 클릭 가능
- 하단 메뉴 클릭 가능

## 실패 시 처리
1. 오류 위치 보고
2. 인증 문제인지, 네트워크 문제인지, publish directory 문제인지 구분
3. 최소 수정
4. 재검증
5. 개발기획서에 기록

## 2026-04-28 진행 결과
- v30A1 배포 설정 파일 `netlify.toml`을 저장소 루트에 추가했다.
- publish directory는 `app_assets/pongdang_gonjiam_v30A1_audio_stability_final`로 고정했다.
- `app.js` 문법 검사는 통과했다.
- GitHub `main` 브랜치에 커밋 `896f7fe Prepare v30A1 Netlify deployment`로 반영했다.
- Netlify 프로젝트 `pongdong-johnchoi` 상태 확인 결과, 현재 활성 배포는 2026-04-24 수동 업로드본이다.
- Netlify 커넥터의 직접 업로드 명령은 `npx`가 필요하지만 현재 PC 환경에서 `npx`, `npm`, `netlify` 실행 파일을 찾을 수 없어 직접 업로드는 보류 상태다.

## 다음 배포 실행 조건
아래 둘 중 하나가 충족되면 바로 Netlify에 반영할 수 있다.

1. Netlify 프로젝트가 GitHub 저장소 `tantarus71-ctrl/pongdang-v5-web`의 `main` 브랜치 자동 배포로 연결되어 있어야 한다.
2. 로컬 PC에 Node.js/npm이 설치되어 `npx` 명령을 사용할 수 있어야 한다.

Node.js/npm 설치 후 실행할 명령:
```powershell
npx netlify deploy --prod --dir app_assets/pongdang_gonjiam_v30A1_audio_stability_final
```

Netlify 커넥터 배포를 사용할 때는 새 `deploy-site` 명령을 다시 발급받아 실행한다. 커넥터가 발급하는 `proxy-path`는 일회성일 수 있으므로 오래된 값을 문서에 고정하지 않는다.

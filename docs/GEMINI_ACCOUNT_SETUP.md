# Gemini 계정 연결 준비

Codex는 사용자의 Google/Gemini 계정에 직접 로그인하지 않는다. 비밀번호, 인증 코드, 쿠키, 세션 토큰도 저장소에 넣지 않는다.

대신 사용자가 직접 Gemini API 키를 만들고 로컬 환경변수에 넣으면, Codex는 그 키가 준비되어 있는지만 확인하고 프로젝트 협업 흐름에 연결한다.

## 가장 쉬운 설정 방법

1. Google AI Studio 또는 Google AI for Developers에서 새 Gemini API 키를 만든다.
2. 이미 채팅에 노출된 키가 있다면 먼저 삭제하거나 비활성화한다.
3. `GEMINI_KEY_SETUP_EASY.cmd`를 실행한다.
4. `New GEMINI_API_KEY`가 나오면 새 키를 붙여넣고 Enter를 누른다. 붙여넣은 키가 화면에 안 보여도 정상이다.

또는 PowerShell에서 프로젝트 폴더로 이동한다.

```powershell
cd C:\Users\tanta\Documents\Codex\2026-04-25\pongdang-v5-web-github
```

아래 스크립트를 실행하고, 화면에 `New GEMINI_API_KEY`가 나오면 새 키를 붙여넣는다.

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\set-gemini-user-key.ps1
```

이 스크립트는 키를 화면에 다시 출력하지 않고 Windows 사용자 환경변수 `GEMINI_API_KEY`에 저장한 뒤 바로 점검한다.

## 현재 PowerShell 창에서만 쓰는 방법

```powershell
$env:GEMINI_API_KEY="여기에_사용자_API_키"
powershell -ExecutionPolicy Bypass -File .\tools\check-gemini-config.ps1
```

## 준비 상태 확인

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\check-gemini-config.ps1
```

정상 연결이면 다음처럼 표시된다.

```text
GEMINI_API_KEY is present.
Secret value: hidden
OK: Gemini account access can be used by tools that read GEMINI_API_KEY.
```

## Codex가 할 일

- `GEMINI_API_KEY`가 있는지 확인한다.
- 키 값 자체는 출력하지 않는다.
- 키가 없으면 설정 방법만 안내한다.
- 키가 있어도 결제, 권한, 계정 설정 변경은 사용자의 직접 확인 없이는 하지 않는다.
- Gemini 결과는 제안으로만 받고, Codex 검증 후 저장소에 반영한다.

## 안전 규칙

- `.env`, `.env.local`, `*.key`, `*secret*` 파일은 커밋하지 않는다.
- Gemini 응답은 `docs/AI_COLLABORATION_PROTOCOL.md` 기준에 따라 ChatGPT/Codex 결과와 상호 검토한다.
- 최종 기준은 GitHub `main`과 `tools/validate-release.ps1` 검증 결과다.

## 공식 문서

- Gemini API 문서: https://ai.google.dev/gemini-api/docs
- Gemini 모델: https://ai.google.dev/gemini-api/docs/models/gemini-v2
- Gemini safety settings: https://ai.google.dev/gemini-api/docs/safety-settings

# Gemini 계정 연결 준비

Codex는 사용자의 Google/Gemini 계정에 직접 로그인하지 않는다. 비밀번호, 인증 코드, 쿠키, 세션 토큰도 저장소에 넣지 않는다.

대신 사용자가 직접 Gemini API 키를 만들고 로컬 환경변수에 넣으면, Codex는 그 키가 준비되어 있는지만 확인하고 프로젝트 협업 흐름에 연결한다.

## 사용자가 직접 할 일

1. Google AI Studio 또는 Google AI for Developers에서 Gemini API 키를 만든다.
2. 키를 저장소 파일에 쓰지 않는다.
3. PowerShell에서 현재 세션용으로만 환경변수를 설정한다.

```powershell
$env:GEMINI_API_KEY="여기에_사용자_API_키"
```

4. 준비 상태를 확인한다.

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\check-gemini-config.ps1
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

# ChatGPT/OpenAI 연결 가이드

## 현재 연결 방식

이 프로젝트는 ChatGPT 웹사이트에 직접 붙는 방식이 아니라, OpenAI Responses API로 패치를 생성하는 방식입니다.

연결 스크립트:

```powershell
node .\bridge\generate-patch.mjs --source-mode local
```

## API 키 설정

로컬에서는 `.env` 파일에 아래 값을 넣습니다.

```text
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5-codex
PONGDANG_SOURCE_MODE=local
```

GitHub Actions에서는 저장소 Secret으로 `OPENAI_API_KEY`를 넣습니다.

## 검증

```powershell
node --check patches\latest.generated.patch.js
node bridge\validate-structure.mjs
node bridge\diagnose-stability.mjs
```

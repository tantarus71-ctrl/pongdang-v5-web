# ChatGPT가 Gemini를 연동하는 방법

이 프로젝트에서 ChatGPT는 Gemini 계정에 직접 로그인하지 않는다. 대신 ChatGPT가 검토 요청 초안을 만들고, Codex가 `tools/invoke-gemini-bridge.ps1`로 Gemini API를 호출한다. Gemini 응답은 후보 검토 자료로 저장하고, Codex가 검증 후에만 저장소에 반영한다.

## 기본 흐름

1. ChatGPT가 기능 초안, UX 초안, 기술 도입안, 리뷰 요청을 만든다.
2. 초안을 `.md` 파일로 저장한다.
3. Codex가 `tools/request-gemini-review.ps1`를 실행한다.
4. Gemini 응답은 `docs/gemini_reviews/`에 저장된다.
5. Codex가 Gemini 응답을 읽고 구조 오류, 위험, 중복, 성능 문제를 정리한다.
6. 검증된 변경만 GitHub `main`과 필요 시 `gh-pages`에 반영한다.

## ChatGPT가 Codex에게 줄 요청 형식

```text
이 초안을 Gemini에게 검토시켜줘.
초안 파일: docs/drafts/example.md
검토 이름: example_feature_review
검토 기준:
- 안정 런타임 v4.8.30을 깨지 말 것
- 최신 기술은 공식 출처 기준으로 판단할 것
- 결제/권한/API 키는 다루지 말 것
- Codex가 실행할 수 있는 지시로 정리할 것
```

## Codex 실행 명령

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\request-gemini-review.ps1 -DraftFile docs\drafts\example.md -ReviewName example_feature_review
```

직접 프롬프트를 보낼 수도 있다.

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\invoke-gemini-bridge.ps1 -Prompt "Gemini bridge ready?"
```

## 저장 위치

- ChatGPT 초안: `docs/drafts/`
- Gemini 검토: `docs/gemini_reviews/`
- Codex 반영 결과: `data/development_memory.json`, `docs/LEARNING_LOG.md`, 실제 코드/데이터 파일

## 보안 규칙

- ChatGPT는 API 키, 비밀번호, 인증 코드를 만들거나 요구하지 않는다.
- Gemini 키는 `GEMINI_API_KEY` 환경변수에서만 읽는다.
- Gemini 응답은 자동 실행하지 않고 후보 입력으로만 사용한다.
- Codex가 `tools/validate-release.ps1`를 통과시키기 전에는 런타임 기준으로 승격하지 않는다.

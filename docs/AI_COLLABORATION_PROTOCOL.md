# ChatGPT + Gemini + Codex AI 협력 프로토콜

이 문서는 프로젝트마다 ChatGPT, Gemini, Codex가 서로 보완하며 최적의 효율, 성능, 안정성을 내기 위한 운영 기준이다.

## 핵심 원칙

1. GitHub 저장소가 최종 기준점이다.
2. AI 답변은 제안이며, 검증된 커밋만 프로젝트 기억이 된다.
3. ChatGPT와 Gemini는 확장 아이디어와 분석을 만들고, Codex는 저장소 적용, 구조 정리, 안정화, 검증, 배포를 맡는다.
4. 최신 기술 판단은 공식 문서와 출처 링크를 남긴 뒤 후보로만 받아들인다.
5. 결제, 계정 권한, 공개 설정, 비밀키, 민감 정보는 사용자가 직접 결정한다.

## 역할 분담

- ChatGPT: 기획, 사용자 경험, 교육 흐름, 기능 초안, 프롬프트 정리, 다음 버전 방향을 만든다.
- Gemini: 긴 문서/큰 코드/이미지/PDF/멀티모달 검토, 대안 비교, Google Search grounding 기반 최신 자료 확인을 맡는다.
- Codex: 저장소 최신화, 코드 적용, 문법/구조 오류 정리, 중복 제거, 성능 최적화, 회귀 검증, 커밋/배포를 맡는다.
- GitHub: AI 간 교환의 공통 기억, 버전 기록, 되돌림 지점, 배포 기준을 제공한다.

## 권장 협업 순서

1. ChatGPT가 새 기능 또는 다음 버전 초안을 만든다.
2. Gemini가 초안의 긴 문맥, 누락, 최신 기술 후보, 멀티모달 자료를 검토한다.
3. Codex가 두 AI 산출물을 후보 문서/후보 데이터/후보 패치로 분리한다.
4. Codex가 기존 안정 런타임과 충돌하는 부분을 정리한다.
5. Codex가 `tools/validate-release.ps1`와 로컬/Pages 실행 확인을 통과시킨다.
6. GitHub `main`에 저장하고, 배포가 필요하면 `gh-pages`를 같은 커밋으로 맞춘다.
7. 다음 ChatGPT와 Gemini 작업은 GitHub 최신 `main`을 기준으로 다시 시작한다.

## 상호 보안 구조

- ChatGPT가 만든 아이디어는 Gemini가 반대 관점으로 검토한다.
- Gemini가 제안한 최신 기술은 Codex가 공식 문서 출처와 프로젝트 호환성을 확인한다.
- Codex가 적용한 변경은 검증 스크립트, 로컬 실행, 공개 Pages 응답으로 확인한다.
- 서로 충돌하는 제안은 `docs/DECISION_LOG.md`에 이유를 남기고 하나만 채택한다.
- 어떤 AI도 단독으로 결제, 권한 변경, 비밀키 생성, 공개 설정 변경을 결정하지 않는다.

## 최신 기술 조사 기준

- OpenAI 모델/추론/도구 관련 정보는 OpenAI 공식 문서를 우선한다.
- Gemini 모델/grounding/safety 관련 정보는 Google AI for Developers 공식 문서를 우선한다.
- 웹 기술은 MDN, Web.dev, W3C, WHATWG 같은 1차 출처를 우선한다.
- 조사 결과는 `data/technology_research_log.json` 또는 별도 후보 문서에 남긴다.

## 현재 공식 기준으로 본 강점

- OpenAI 최신 모델 문서는 GPT 계열이 코딩, 추론, 에이전트 작업에 적합하다고 설명한다.
- OpenAI reasoning 문서는 복잡한 문제 해결, 코딩, 다단계 계획에 추론 모델을 쓰는 방식을 제시한다.
- Gemini 모델 문서는 Gemini 2.5 Pro가 긴 컨텍스트, 코드/수학/STEM 추론, 오디오/이미지/비디오/텍스트/PDF 입력을 지원한다고 설명한다.
- Gemini grounding 문서는 Google Search grounding으로 최신 정보 접근과 출처 메타데이터를 제공할 수 있다고 설명한다.
- Gemini safety 문서는 요청별 안전 필터와 차단 기준을 조정하는 구조를 제공한다.

## 프로젝트별 적용 규칙

- 작은 UI 수정: ChatGPT 초안 -> Codex 바로 정리/검증.
- 큰 기획 또는 긴 문서: ChatGPT 초안 -> Gemini 긴 문맥 검토 -> Codex 적용.
- 최신 기술 도입: Gemini 또는 ChatGPT 조사 -> 공식 출처 확인 -> Codex 후보 패치 -> 검증 후 반영.
- 성능 최적화: Codex가 실제 코드와 실행 결과를 기준으로 판단하고, 필요하면 ChatGPT/Gemini에게 대안 비교를 맡긴다.
- 안전/권한/비용이 걸린 작업: 사용자 확인 전에는 문서화까지만 진행한다.

## 출처

- OpenAI Models: https://platform.openai.com/docs/models
- OpenAI Reasoning: https://platform.openai.com/docs/guides/reasoning
- Gemini Models: https://ai.google.dev/gemini-api/docs/models/gemini-v2
- Gemini Grounding with Google Search: https://ai.google.dev/gemini-api/docs/google-search
- Gemini Safety Settings: https://ai.google.dev/gemini-api/docs/safety-settings

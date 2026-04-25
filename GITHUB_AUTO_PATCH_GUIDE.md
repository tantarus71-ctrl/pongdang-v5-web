# GitHub Actions 자동 패치 PR 가이드

## 가장 안정적인 방식

이 프로젝트는 OpenAI가 만든 패치를 `main`에 바로 넣지 않습니다.

안정적인 흐름은 다음과 같습니다.

1. GitHub Actions를 수동 실행한다.
2. OpenAI Responses API가 패치를 생성한다.
3. 구조/문법/안정성 검사를 통과해야 한다.
4. 통과하면 자동으로 새 브랜치와 Pull Request를 만든다.
5. 사람이 PR을 확인한 뒤 merge한다.

## 필요한 GitHub Secret

GitHub 저장소에서 아래 Secret을 추가합니다.

`Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`

필수 Secret:

```text
OPENAI_API_KEY
```

## 실행 방법

1. GitHub 저장소로 이동한다.
2. `Actions` 탭을 연다.
3. `OpenAI Auto Patch PR` 워크플로를 선택한다.
4. `Run workflow`를 누른다.
5. 완료 후 `Pull requests` 탭에서 자동 생성된 PR을 확인한다.

## 안전 장치

- `main`에 직접 push하지 않음.
- 검증 실패 시 PR 생성 안 함.
- PR을 merge하기 전 사람이 변경 내용을 볼 수 있음.

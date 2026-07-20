---
name: pull-request-convention
description: PR 생성 전 코드 리뷰를 수행하고 이슈가 없으면 PR을 생성합니다.
triggers:
  - PR
  - PR 만들어줘
  - pull request
  - git pr
---

# PR 생성 워크플로우

PR 생성 전 코드 리뷰를 자동 수행하여 품질을 보장합니다.

---

## 워크플로우 개요

```
[Step 1] 미커밋 변경사항 확인 및 커밋
    ↓
[Step 2] 코드 리뷰 수행 (code-reviewer 에이전트)
    ↓
[Step 3] 리뷰 결과 판단
    ↓
[Step 4] PR 생성
```

---

## Step 1: 미커밋 변경사항 처리

```bash
git status
```

미커밋 변경사항이 있으면 커밋 후 push까지 완료하고 PR을 생성합니다.

---

## Step 2: 코드 리뷰 수행

**code-reviewer 에이전트를 호출하여 변경사항을 검토합니다.**

```
Agent 도구 호출:
- subagent_type: "code-reviewer"
- prompt: "현재 브랜치의 변경사항을 리뷰해주세요."
```

### 리뷰 대상

- `git diff main...HEAD`로 확인되는 모든 변경사항
- 컨벤션 준수 여부
- 보안 취약점
- 코드 품질

---

## Step 3: 리뷰 결과 판단

| 결과 | 조건 | 조치 |
|------|------|------|
| **BLOCKED** | CRITICAL 이슈 존재 | PR 생성 중단, 수정 필요 사항 안내 |
| **WARNING** | WARNING 이슈만 존재 | 사용자에게 확인 후 진행 여부 질문 |
| **APPROVED** | SUGGESTION 이하만 존재 | PR 생성 진행 |

### BLOCKED 시 출력 형식

```
## PR 생성 불가

코드 리뷰에서 CRITICAL 이슈가 발견되어 PR을 생성할 수 없습니다.

### 발견된 이슈

[CRITICAL] 이슈 제목
- 파일: src/path/to/file.ts:42
- 문제: 문제 설명
- 수정: 수정 방법

### 다음 단계

1. 위 이슈들을 수정해주세요.
2. 수정 후 다시 "PR 올려줘"를 요청해주세요.
```

---

## Step 4: PR 생성

### 4-1. 변경사항 분석

```bash
git log main..HEAD --oneline
git diff main...HEAD --stat
```

### 4-2. PR 제목

```
<type>: <description>
```

- 브랜치명 또는 커밋에서 type 추출
- 한국어로 간결하게 작성

### 4-3. PR 라벨

| 커밋 타입 | PR 라벨 |
|-----------|---------|
| `feat` | `enhancement` |
| `refactor` | `refactoring` |
| `fix` | `bug` |
| `docs` | `documentation` |
| `test` | `test` |
| `chore` | (라벨 없음) |

### 4-4. PR 본문 템플릿

```markdown
## Summary

(1-3줄 요약)

---

## Changes

(변경사항 상세. 모듈/기능별로 구분하여 작성)

---

## Test plan

- [ ] 주요 기능 동작 확인
- [ ] lint 통과
- [ ] build 통과
```

### 4-5. base 브랜치 선택

PR 생성 전 사용자에게 base 브랜치를 확인합니다.

| 브랜치 | 용도 |
|--------|------|
| `develop` | 일반적인 기능 개발/버그 수정 **(기본값)** |
| `main` | 핫픽스, 긴급 배포, 릴리스 |

### 4-6. gh CLI 명령

```bash
gh pr create \
  --title "<type>: <description>" \
  --base develop \
  --label "<label>" \
  --body "$(cat <<'EOF'
## Summary
...
EOF
)"
```

---

## 주의사항

1. **base 브랜치**: 기본값은 `develop`. 사용자가 명시적으로 `main`을 지정한 경우에만 `main`으로 PR
2. **리모트 푸시 확인**: PR 생성 전 현재 브랜치가 origin에 push되어 있는지 확인
3. **라벨 설정**: 타입에 맞는 라벨 반드시 추가

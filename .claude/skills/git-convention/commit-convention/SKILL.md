---
name: commit-convention
description: Git 커밋 메시지 및 브랜치 네이밍 컨벤션. 커밋, 브랜치 생성 시 참조합니다.
triggers:
  - 커밋
  - commit
  - 브랜치
  - branch
---

# Git 커밋 & 브랜치 컨벤션

## 개요

커밋 메시지 작성과 브랜치 네이밍에 대한 규칙을 정의합니다.

---

## 커밋 메시지 컨벤션

### 타입 (Type)

| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 기능 추가/변경 (입출력 변경 포함) | `feat: 사용자 인증 API 추가` |
| `refactor` | 리팩토링 (입출력 변경 없음) | `refactor: UserService 메서드 분리` |
| `fix` | 버그 수정 | `fix: 로그인 토큰 만료 처리 오류 수정` |
| `docs` | 문서 변경 | `docs: README 설치 가이드 업데이트` |
| `chore` | 기타 (빌드, 설정, 주석 등) | `chore: UserService 주석 추가` |
| `test` | 테스트 추가/수정 | `test: UserService 유닛 테스트 추가` |

### 커밋 메시지 형식

```
<type>: <subject>

<body (optional)>
```

### 규칙

1. **제목(subject)**
   - 50자 이내
   - 마침표 없음
   - 명령형으로 작성 (예: "추가", "수정", "변경")

2. **본문(body)**
   - 선택사항
   - 무엇을, 왜 변경했는지 설명
   - 72자마다 줄바꿈

---

## 브랜치 네이밍

### 형식

```
<type>-<description>
```

### 예시

| 타입 | 브랜치 이름 |
|------|-------------|
| feat | `feat-user-authentication` |
| fix | `fix-login-token-expiry` |
| refactor | `refactor-user-service-split` |
| docs | `docs-unit-test-convention` |
| chore | `chore-user-service-annotation` |

### 규칙

- **kebab-case** 사용 (슬래시 `/` 사용 금지, 하이픈 `-`만 사용)
- 영어로 작성
- 간결하고 명확하게

---

## 예시

### 좋은 예시

**커밋:**
```
feat: User Service 추가

- 유저 서비스 파일 추가
- findUserById 메서드 구현
```

**브랜치:** `feat-user-model`

### 피해야 할 예시

- ❌ `update code` (무엇을 업데이트했는지 불명확)
- ❌ `fix bug` (어떤 버그인지 불명확)
- ❌ `WIP` (작업 중인 상태로 커밋)
- ❌ `asdf` (의미 없는 메시지)
- ❌ `feat/user-auth` (슬래시 사용 금지)
---
name: general-convention
description: TypeScript/JavaScript 코드 작성 시 일반적인 코딩 컨벤션을 적용합니다.
triggers:
  - 코드 작성
  - 리팩토링
  - convention
  - 컨벤션
---

# 일반 코딩 컨벤션

## 개요

TypeScript/JavaScript 코드 작성 시 적용되는 일반적인 코딩 컨벤션입니다. 일관성 있고 유지보수하기 쉬운 코드를 위해 이 규칙을 따릅니다.

---

## 값 존재 여부 확인

### isDefined 사용

변수에 값이 할당되어 있는지 확인할 때는 항상 `class-validator`의 `isDefined` 함수를 사용합니다.

```typescript
import { isDefined } from 'class-validator';

// ❌ Bad
if (value !== null && value !== undefined) { }
if (value != null) { }
if (typeof value !== 'undefined') { }

// ✅ Good
if (isDefined(value)) { }
```

### isDefined vs 기타 방법 비교

| 방법 | `null` | `undefined` | `0` | `""` | `false` |
|------|--------|-------------|-----|------|---------|
| `isDefined(x)` | ❌ | ❌ | ✅ | ✅ | ✅ |
| `x != null` | ❌ | ❌ | ✅ | ✅ | ✅ |
| `!!x` | ❌ | ❌ | ❌ | ❌ | ❌ |
| `Boolean(x)` | ❌ | ❌ | ❌ | ❌ | ❌ |

`isDefined`는 `null`과 `undefined`만 falsy로 처리하고, `0`, `""`, `false` 같은 유효한 값은 정상적으로 통과시킵니다.

```typescript
import { isDefined } from 'class-validator';

const count = 0;
const name = '';
const isActive = false;

// ❌ Bad - 유효한 값도 falsy로 처리됨
if (count) { }      // 실행 안됨
if (name) { }       // 실행 안됨
if (isActive) { }   // 실행 안됨

// ✅ Good - 0, '', false도 정상 통과
if (isDefined(count)) { }     // 실행됨
if (isDefined(name)) { }      // 실행됨
if (isDefined(isActive)) { }  // 실행됨
```

---

## 함수 선언

### 화살표 함수 사용

`function` 키워드 대신 화살표 함수(`const fn = () => {}`)를 사용합니다.

```typescript
// ❌ Bad
function calculateSum(a: number, b: number): number {
  return a + b;
}

// ✅ Good
const calculateSum = (a: number, b: number): number => {
  return a + b;
};

// ✅ Good - 단일 표현식은 암시적 반환
const double = (n: number): number => n * 2;
```

### export 함수도 화살표 함수

```typescript
// ❌ Bad
export function parseData(raw: string): Data {
  // ...
}

// ✅ Good
export const parseData = (raw: string): Data => {
  // ...
};
```

### 예외: 클래스 메서드

클래스 내부의 메서드는 일반 메서드 문법을 사용합니다.

```typescript
// ✅ Good - 클래스 메서드
class Parser {
  parse(text: string): Result {
    // ...
  }

  async loadData(): Promise<void> {
    // ...
  }
}
```

---

## 조건문

### Early Return 지향, else/else if 지양

`else`와 `else if`는 최대한 지양하고 early return을 사용합니다.

```typescript
// ❌ Bad - else 사용
const getStatus = (user: User): string => {
  if (user.isActive) {
    return 'active';
  } else if (user.isPending) {
    return 'pending';
  } else {
    return 'inactive';
  }
};

// ✅ Good - Early return으로 else 제거
const getStatus = (user: User): string => {
  if (user.isActive) {
    return 'active';
  }

  if (user.isPending) {
    return 'pending';
  }

  return 'inactive';
};
```

**예외:** switch문을 대체할 수 없거나 로직상 반드시 필요한 경우에만 사용합니다.


### 중괄호 필수

if문은 한 줄이라도 반드시 중괄호 `{}`를 사용합니다.

```typescript
import { isDefined } from 'class-validator';

// ❌ Bad - 중괄호 없음
if (!isDefined(user)) return null;
if (isValid) doSomething();

// ✅ Good - 중괄호 필수
if (!isDefined(user)) {
  return null;
}

if (isValid) {
  doSomething();
}
```

---

## 코드 포맷팅

### 제어문 예약어 위 공백

`return`, `continue`, `break`, `throw` 같은 제어문 예약어 위에는 한 줄을 띄웁니다.

```typescript
// ❌ Bad - 공백 없음
const processItems = (items: Item[]): Result[] => {
  const results: Result[] = [];
  for (const item of items) {
    if (!item.isValid) {
      continue;
    }
    const result = transform(item);
    results.push(result);
  }
  return results;
};

// ✅ Good - 제어문 위 공백
const processItems = (items: Item[]): Result[] => {
  const results: Result[] = [];

  for (const item of items) {
    if (!item.isValid) {
      continue;
    }

    const result = transform(item);
    results.push(result);
  }

  return results;
};
```

**규칙:**
- `return` 위: 한 줄 공백 (함수 시작 직후 return 제외)
- `continue` 위: 한 줄 공백
- `break` 위: 한 줄 공백
- 여러 줄 로직 후 제어문이 오는 경우 가독성을 위해 공백 추가

```typescript
// ✅ Good - 함수 시작 직후 return은 공백 불필요
const validateUser = (user: User | null): string => {
  if (!isDefined(user)) {
    return 'No user';
  }

  // 로직이 있는 경우 return 위 공백
  const validation = performValidation(user);

  return validation.result;
};
```

---

## 타입 선언

### 타입 추론 활용

명확한 경우 타입 추론을 활용합니다.

```typescript
// ❌ Bad - 불필요한 타입 선언
const count: number = 0;
const name: string = 'John';
const items: string[] = ['a', 'b', 'c'];

// ✅ Good - 타입 추론 활용
const count = 0;
const name = 'John';
const items = ['a', 'b', 'c'];
```

### 함수 반환 타입 명시

함수의 반환 타입은 명시적으로 선언합니다.

```typescript
// ❌ Bad
const calculateSum = (a: number, b: number) => {
  return a + b;
};

// ✅ Good
const calculateSum = (a: number, b: number): number => {
  return a + b;
};
```

### interface vs type

객체 타입은 `interface`, 유니온/교차 타입은 `type`을 사용합니다.

```typescript
// ✅ Good - 객체 타입은 interface
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Good - 유니온 타입은 type
type Status = 'pending' | 'active' | 'inactive';
type Result<T> = T | Error;
```

---

## 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 변수/함수 | camelCase | `userName`, `fetchData` |
| 상수 | SCREAMING_SNAKE_CASE | `MAX_RETRY`, `API_URL` |
| 클래스/인터페이스 | PascalCase | `UserService`, `ParseResult` |
| 타입 별칭 | PascalCase | `UserId`, `ApiResponse` |
| 파일명 | kebab-case 또는 camelCase | `user-service.ts`, `userService.ts` |
| 불리언 변수 | is/has/can 접두사 | `isActive`, `hasError`, `canEdit` |

---

## 주석

### 불필요한 주석 금지

코드로 설명 가능한 내용은 주석 없이 작성합니다.

```typescript
// ❌ Bad
// 사용자 이름 가져오기
const userName = user.name;

// ✅ Good - 코드가 자체 설명적
const userName = user.name;
```

### 필요한 경우만 주석 작성

```typescript
// ✅ Good - 복잡한 로직 설명
// 나무위키 접기 문법을 Obsidian callout으로 변환
// {{{#!folding [제목] ... }}} → > [!note]- 제목
const convertFolding = (text: string): string => {
  // ...
};
```

---

## 적용 범위

- 새로 작성하는 모든 TypeScript/JavaScript 코드
- 기존 코드 리팩토링 시
- 코드 리뷰 시 체크리스트로 활용
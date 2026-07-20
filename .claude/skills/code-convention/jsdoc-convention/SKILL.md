---
name: jsdoc-convention
description: TypeScript 파일의 모든 메서드에 JSDoc 주석을 추가합니다.
triggers:
  - jsdoc
  - 주석
  - 문서화
  - documentation
---

# JSDoc 주석 추가 스킬

## 개요

TypeScript 파일의 모든 메서드에 JSDoc 주석을 추가합니다. 코드의 가독성과 IDE 지원을 향상시킵니다.

---

## JSDoc 형식

모든 메서드에 다음 형식의 JSDoc 주석을 추가합니다:

```typescript
/**
 * 메서드가 수행하는 작업에 대한 간결한 설명
 *
 * @param {타입} 파라미터명 파라미터에 대한 설명
 * @returns {리턴타입} 반환값에 대한 설명
 */
```

---

## 작성 규칙

### 1. 메서드 설명

- 첫 줄에 메서드가 **무엇을 하는지** 간결하게 작성
- 한글로 작성
- 마침표로 종료하지 않음

### 2. @param 태그

- 모든 파라미터에 대해 작성
- 형식: `@param {타입} 파라미터명 설명`
- 타입은 TypeScript 타입을 그대로 사용
- 제네릭 타입도 그대로 표기 (예: `Promise<T>`, `Map<K, V>`)
- optional 파라미터는 `[파라미터명]` 형식으로 표기

### 3. @returns 태그

- 반환값이 있는 경우 필수 작성
- 형식: `@returns {타입} 설명`
- `void` 혹은 `Promise<void>` 반환인 경우 생략 가능
- Promise 반환 시 내부 타입까지 명시 (예: `Promise<User[]>`)

### 4. @throws 태그 (선택)

- 예외를 던지는 경우 작성
- 형식: `@throws {에러타입} 발생 조건 설명`

### 5. @example 태그 (선택)

- 복잡한 메서드의 경우 사용 예시 추가
- 코드 블록으로 작성

---

## 타입 표기 규칙

| TypeScript 타입 | JSDoc 표기 |
|-----------------|------------|
| `string` | `{string}` |
| `number` | `{number}` |
| `boolean` | `{boolean}` |
| `string[]` | `{string[]}` |
| `Array<string>` | `{Array<string>}` |
| `Promise<void>` | `{Promise<void>}` |
| `Map<string, number>` | `{Map<string, number>}` |
| `T extends Base` | `{T}` |
| `Record<K, V>` | `{Record<K, V>}` |
| `CustomType` | `{CustomType}` |
| `string \| null` | `{string \| null}` |
| `Partial<User>` | `{Partial<User>}` |

---

## 예시

### 기본 메서드

```typescript
/**
 * 사용자 ID로 사용자 정보를 조회
 *
 * @param {string} userId 조회할 사용자의 고유 ID
 * @returns {Promise<User>} 조회된 사용자 정보
 */
async findUserById(userId: string): Promise<User> {
  // ...
}
```

### 여러 파라미터

```typescript
/**
 * 페이지네이션을 적용하여 게시글 목록을 조회
 *
 * @param {number} page 조회할 페이지 번호 (1부터 시작)
 * @param {number} limit 페이지당 게시글 수
 * @param {string} [sortBy] 정렬 기준 필드명
 * @returns {Promise<Post[]>} 게시글 목록
 */
async getPosts(page: number, limit: number, sortBy?: string): Promise<Post[]> {
  // ...
}
```

### 제네릭 메서드

```typescript
/**
 * 캐시에서 데이터를 조회하거나 없으면 로더 함수를 실행하여 캐시에 저장
 *
 * @param {string} key 캐시 키
 * @param {() => Promise<T>} loader 캐시 미스 시 실행할 로더 함수
 * @returns {Promise<T>} 캐시된 데이터 또는 새로 로드된 데이터
 */
async getOrSet<T>(key: string, loader: () => Promise<T>): Promise<T> {
  // ...
}
```

### void 반환

```typescript
/**
 * 이벤트 리스너를 등록
 *
 * @param {string} eventName 이벤트 이름
 * @param {EventHandler} handler 이벤트 핸들러 함수
 */
on(eventName: string, handler: EventHandler): void {
  // ...
}
```

### 예외 발생

```typescript
/**
 * 설정 파일을 파싱하여 객체로 변환
 *
 * @param {string} filePath 설정 파일 경로
 * @returns {Config} 파싱된 설정 객체
 * @throws {FileNotFoundError} 파일이 존재하지 않는 경우
 * @throws {ParseError} 파일 형식이 올바르지 않은 경우
 */
parseConfig(filePath: string): Config {
  // ...
}
```

### private/protected 메서드

```typescript
/**
 * 내부 캐시를 초기화
 */
private clearCache(): void {
  // ...
}
```

### 콜백 함수 파라미터

```typescript
/**
 * 배열의 각 요소에 대해 비동기 작업을 순차적으로 실행
 *
 * @param {T[]} items 처리할 항목 배열
 * @param {(item: T, index: number) => Promise<R>} callback 각 항목에 대해 실행할 비동기 콜백
 * @returns {Promise<R[]>} 모든 콜백 결과의 배열
 */
async mapSequential<T, R>(
  items: T[],
  callback: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  // ...
}
```

---

## 적용 대상

다음 메서드/함수에 JSDoc을 추가합니다:

- 클래스 메서드 (public, private, protected)
- 인터페이스 메서드 시그니처
- 함수 선언 (`function`)
- 화살표 함수 (변수에 할당된 경우)
- getter/setter

---

## 제외 대상

다음은 JSDoc 추가를 생략합니다:

- 이미 JSDoc이 있는 메서드
- constructor (명확한 경우)
- 단순 getter/setter (자명한 경우)
- 오버라이드 메서드 (부모 클래스 문서 참조)

---

## 실행 방법

1. 대상 TypeScript 파일을 지정
2. 파일 내 모든 메서드를 분석
3. JSDoc이 없는 메서드에 주석 추가
4. 메서드의 시그니처를 분석하여 타입 정보 추출
5. 메서드명과 컨텍스트를 기반으로 설명 생성
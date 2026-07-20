---
name: nestjs-cqrs
description: NestJS 백엔드 기능 구현 시 CQRS + UseCase 아키텍처 패턴을 적용합니다.
triggers:
  - 백엔드 기능 추가
  - API 추가
  - NestJS
  - UseCase
  - CQRS
  - 엔드포인트 추가
---

# NestJS CQRS + UseCase 아키텍처 컨벤션

새 기능을 `src/<feature>/` 단위로 구성합니다.

---

## 디렉토리 구조

```
src/<feature>/
├── <feature>.module.ts
├── <feature>.error.ts
├── entities/
│   └── <name>.entity.ts
├── presenter/
│   └── http/
│       ├── <feature>.http.controller.ts
│       ├── <feature>.path.presenter.ts
│       └── dto/
│           ├── <action>-request.dto.ts
│           └── <action>-response.dto.ts
└── application/
    ├── use-cases/
    │   └── <action>.use-case.ts
    ├── commands/
    │   └── <action>.command.ts
    └── queries/
        └── <action>.query.ts
```

---

## 핵심 원칙

- **엔드포인트 1개 = UseCase 1개** (1:1 대응)
- Controller는 UseCase 호출만 담당 (비즈니스 로직 없음)
- 모듈 간 데이터 교환은 CQRS(Command/Query)로만
- DB 직접 접근은 Command/Query Handler에서만

---

## 1. Path Presenter

라우트 경로와 API 태그를 상수로 관리합니다.

```typescript
// src/<feature>/presenter/http/<feature>.path.presenter.ts
export const ToolsRouter = {
  Root: 'tools',
  HttpApiTags: 'Tools',
  Http: {
    GetList: '',
    GetOne: ':id',
    Create: '',
    Update: ':id',
    Delete: ':id',
  },
} as const;
```

---

## 2. Controller (HTTP Presenter)

UseCase를 호출하는 얇은 레이어. 비즈니스 로직 없음.

```typescript
// src/<feature>/presenter/http/<feature>.http.controller.ts
@ApiTags(ToolsRouter.HttpApiTags)
@Controller(ToolsRouter.Root)
export class ToolsHttpController {
  constructor(
    private readonly getToolListUseCase: GetToolListUseCase,
    private readonly createToolUseCase: CreateToolUseCase,
  ) {}

  @ApiOperation({ summary: '도구 목록 조회' })
  @Get(ToolsRouter.Http.GetList)
  async getList(): Promise<ToolListResponseDto> {
    return this.getToolListUseCase.execute();
  }

  @ApiOperation({ summary: '도구 생성' })
  @Post(ToolsRouter.Http.Create)
  async create(@Body() bodyDto: CreateToolRequestDto): Promise<CreateToolResponseDto> {
    return this.createToolUseCase.execute({ bodyDto });
  }
}
```

### 인증이 필요한 엔드포인트

```typescript
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
@Get(ToolsRouter.Http.GetOne)
async getOne(
  @User() user: { id: number },
  @Param('id') id: string,
): Promise<ToolResponseDto> {
  return this.getToolUseCase.execute({ userId: user.id, toolId: id });
}
```

---

## 3. UseCase

비즈니스 로직을 담당. `execute` 메서드를 진입점으로, 세부 동작은 개별 메서드로 분리합니다.

```typescript
// src/<feature>/application/use-cases/<action>.use-case.ts
@Injectable()
export class CreateToolUseCase {
  constructor(
    private readonly commandBus: TypedCommandBus<SaveToolCommand>,
    private readonly queryBus: TypedQueryBus<GetToolByNameQuery>,
  ) {}

  async execute(props: CreateToolUseCaseProps): Promise<CreateToolResponseDto> {
    const { bodyDto } = props;

    await this.checkNameDuplication(bodyDto.name);

    const tool = await this.saveTool(bodyDto);

    return this.buildResponseDto(tool);
  }

  /**
   * 이름 중복 체크
   *
   * @param {string} name 도구 이름
   * @throws {AppException} 이미 존재하는 이름인 경우
   */
  async checkNameDuplication(name: string): Promise<void> {
    const existing = await this.queryBus.execute(new GetToolByNameQuery({ name }));

    if (isDefined(existing)) {
      throw new AppException(TOOL_ERRORS.NAME_ALREADY_EXISTS);
    }
  }

  /**
   * 도구 저장
   *
   * @param {CreateToolRequestDto} dto 생성 데이터
   * @returns {Promise<ToolEntity>} 저장된 도구
   */
  async saveTool(dto: CreateToolRequestDto): Promise<ToolEntity> {
    return await this.commandBus.execute(new SaveToolCommand({ name: dto.name }));
  }

  /**
   * 응답 DTO 생성
   *
   * @param {ToolEntity} tool 도구 엔티티
   * @returns {CreateToolResponseDto} 응답 데이터
   */
  buildResponseDto(tool: ToolEntity): CreateToolResponseDto {
    return CreateToolResponseDto.from(tool);
  }
}

interface CreateToolUseCaseProps {
  bodyDto: CreateToolRequestDto;
}
```

### UseCase 작성 규칙

- `execute` 메서드가 유일한 **public** 진입점
- 세부 동작(조회, 검증, 저장, 이벤트 발행 등)은 반드시 **`private` 메서드**로 분리
- 같은 로직이 다른 UseCase에 중복되더라도 각 UseCase 내부 private 메서드로 구현 (공유 X)
- 메서드마다 JSDoc 작성 (execute 포함)
- Props 인터페이스는 파일 하단에 선언

---

## 4. Command Handler

DB 쓰기 작업. Command와 Handler를 같은 파일에 작성합니다.

```typescript
// src/<feature>/application/commands/<action>.command.ts
export class SaveToolCommand extends Command<ToolEntity> {
  constructor(public readonly props: SaveToolCommandProps) {
    super();
  }
}

@CommandHandler(SaveToolCommand)
export class SaveToolCommandHandler implements ICommandHandler<SaveToolCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: SaveToolCommand): Promise<ToolEntity> {
    const { name } = command.props;

    return await this.prisma.tool.create({ data: { name } });
  }
}

interface SaveToolCommandProps {
  name: string;
}
```

### 반환 타입 결정

| 상황 | 반환 타입 |
|------|-----------|
| 생성 후 엔티티 반환 | `Command<ToolEntity>` |
| 수정 후 엔티티 반환 | `Command<ToolEntity>` |
| 삭제/상태 변경 | `Command<void>` |

---

## 5. Query Handler

DB 읽기 작업. Query와 Handler를 같은 파일에 작성합니다.

```typescript
// src/<feature>/application/queries/<action>.query.ts
export class GetToolByIdQuery extends Query<ToolEntity | null> {
  constructor(public readonly props: GetToolByIdQueryProps) {
    super();
  }
}

@QueryHandler(GetToolByIdQuery)
export class GetToolByIdQueryHandler implements IQueryHandler<GetToolByIdQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetToolByIdQuery): Promise<ToolEntity | null> {
    const { toolId } = query.props;

    return await this.prisma.tool.findUnique({ where: { id: toolId } });
  }
}

interface GetToolByIdQueryProps {
  toolId: string;
}
```

---

## 6. TypedCommandBus / TypedQueryBus

UseCase에서 타입 안전하게 Command/Query를 실행합니다.

```typescript
import { TypedCommandBus, TypedQueryBus } from 'src/common/cqrs';

// 여러 Command/Query 사용 시 유니온 타입
constructor(
  private readonly commandBus: TypedCommandBus<SaveToolCommand | DeleteToolCommand>,
  private readonly queryBus: TypedQueryBus<GetToolByIdQuery | GetToolByNameQuery>,
) {}

// 실행
const tool = await this.commandBus.execute(new SaveToolCommand({ name }));
const found = await this.queryBus.execute(new GetToolByIdQuery({ toolId }));
```

---

## 7. Error 정의

```typescript
// src/<feature>/<feature>.error.ts
import { HttpStatus } from '@nestjs/common';

export const TOOL_ERRORS = {
  NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'TOOL_NOT_FOUND',
    message: '도구를 찾을 수 없습니다',
  },
  NAME_ALREADY_EXISTS: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'TOOL_NAME_ALREADY_EXISTS',
    message: '이미 존재하는 도구 이름입니다',
  },
};

// 사용
throw new AppException(TOOL_ERRORS.NOT_FOUND);
```

---

## 8. DTO 패턴

**엔드포인트 1개 = DTO 파일 1개** — Request와 Response DTO를 같은 파일에 작성합니다.

```
presenter/http/dto/
├── create-tool.dto.ts    # CreateToolRequestDto + CreateToolResponseDto
├── get-tool.dto.ts       # GetToolResponseDto (요청 DTO 없으면 응답만)
└── delete-tool.dto.ts    # (응답 DTO만 있거나 없으면 파일 생략 가능)
```

```typescript
// src/<feature>/presenter/http/dto/<action>.dto.ts

// 요청 DTO - class-validator 데코레이터
export class CreateToolRequestDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  name!: string;
}

// 응답 DTO - static from() 팩토리 메서드 사용
export class CreateToolResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  static from(data: CreateToolResponseDto): CreateToolResponseDto {
    return { id: data.id, name: data.name };
  }
}
```

---

## 9. Module 등록

```typescript
// src/<feature>/<feature>.module.ts
@Module({
  controllers: [ToolsHttpController],
  providers: [
    /** query-handlers */
    GetToolByIdQueryHandler,
    GetToolByNameQueryHandler,

    /** command-handlers */
    SaveToolCommandHandler,
    DeleteToolCommandHandler,

    /** use-cases */
    GetToolListUseCase,
    GetToolUseCase,
    CreateToolUseCase,
    DeleteToolUseCase,
  ],
})
export class ToolsModule {}
```

- providers는 `query-handlers` → `command-handlers` → `use-cases` 순서로 주석 구분
- 모듈 등록 후 `app.module.ts`의 imports 배열에 추가

---

## 10. 모듈 간 데이터 교환

다른 모듈의 데이터가 필요할 때는 해당 모듈의 Command/Query를 호출합니다.

```typescript
// auth 모듈에서 users 모듈의 유저 조회 예시
import { GetOneUserByEmailQuery } from 'src/users/application/queries/get-one-user-by-email.query';

// Handler는 UsersModule에 등록, AuthModule에서 TypedQueryBus로 호출
const user = await this.queryBus.execute(new GetOneUserByEmailQuery({ email }));
```

**단, 핸들러는 소유 모듈에만 등록합니다.** NestJS CQRS 버스는 애플리케이션 전역이므로 별도 import 불필요.

---

## 체크리스트

새 기능 구현 시:

- [ ] `<feature>.error.ts` 에러 코드 정의
- [ ] Path Presenter 라우트 상수 정의
- [ ] 엔드포인트별 UseCase 1:1 생성
- [ ] Command/Query Handler 작성 (DB 접근은 Handler에서만)
- [ ] Module providers 등록 (query-handlers → command-handlers → use-cases 순)
- [ ] `app.module.ts` imports에 추가
- [ ] 각 메서드 JSDoc 작성

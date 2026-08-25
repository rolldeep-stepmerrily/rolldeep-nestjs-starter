import { ApiAllResponse } from '@@decorators';
import { GLOBAL_ERRORS } from '@@exceptions';
import { SuccessResponse } from '@@types';
import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from 'src/users/application/use-cases/create-user.use-case';
import { GetUsersUseCase } from 'src/users/application/use-cases/get-users.use-case';
import { CreateUserRequestDto, CreateUserResponseDto } from './dto/create-user.dto';
import { GetUsersMetaDto, GetUsersRequestDto, GetUsersResponseDto } from './dto/get-users.dto';
import { UsersRouter } from './users.path.presenter';

@ApiTags(UsersRouter.HttpApiTags)
@Controller(UsersRouter.Root)
export class UsersHttpController {
  constructor(
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  /**
   * 유저 목록을 페이지네이션으로 조회
   *
   * @param {GetUsersRequestDto} query 페이지/페이지당 개수 등 조회 조건
   * @returns {Promise<SuccessResponse<GetUsersResponseDto[], GetUsersMetaDto>>} 유저 목록과 페이지네이션 메타 정보
   */
  @ApiAllResponse({
    name: 'GetUsers',
    description: '유저 조회',
    responseDataDto: [GetUsersResponseDto],
    responseMetaDto: GetUsersMetaDto,
  })
  @Get(UsersRouter.Http.GetUsers)
  async getUsers(@Query() query: GetUsersRequestDto): Promise<SuccessResponse<GetUsersResponseDto[], GetUsersMetaDto>> {
    const { users, meta } = await this.getUsersUseCase.execute({ page: query.page, limit: query.limit });

    return { data: users, meta };
  }

  /**
   * 유저를 생성
   *
   * @param {CreateUserRequestDto} body 생성할 유저 정보
   * @returns {Promise<SuccessResponse<CreateUserResponseDto>>} 생성된 유저 응답
   */
  @ApiAllResponse({
    name: 'CreateUser',
    description: '유저 생성',
    status: HttpStatus.CREATED,
    responseDataDto: CreateUserResponseDto,
    exceptions: [GLOBAL_ERRORS.DUPLICATE_LOGIN_ID, GLOBAL_ERRORS.DUPLICATE_EMAIL],
  })
  @Post(UsersRouter.Http.CreateUser)
  async createUser(@Body() body: CreateUserRequestDto): Promise<SuccessResponse<CreateUserResponseDto>> {
    const user = await this.createUserUseCase.execute(body);

    return { data: user };
  }
}

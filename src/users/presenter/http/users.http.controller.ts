import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUsersUseCase } from 'src/users/application/use-cases/get-users.use-case';
import { GetUsersRequestDto, GetUsersResponseDto } from './dto/get-users.dto';
import { UsersRouter } from './users.path.presenter';

@ApiTags(UsersRouter.HttpApiTags)
@Controller(UsersRouter.Root)
export class UsersHttpController {
  constructor(private readonly getUsersUseCase: GetUsersUseCase) {}

  @ApiOperation({
    summary: '유저 조회',
  })
  @Get(UsersRouter.Http.GetUsers)
  async getUsers(@Query() query: GetUsersRequestDto): Promise<GetUsersResponseDto[]> {
    return await this.getUsersUseCase.execute({ limit: query.limit });
  }
}

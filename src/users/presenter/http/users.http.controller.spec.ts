import { Test } from '@nestjs/testing';
import { CreateUserUseCase } from 'src/users/application/use-cases/create-user.use-case';
import { GetUsersUseCase } from 'src/users/application/use-cases/get-users.use-case';
import { CreateUserRequestDto, CreateUserResponseDto } from './dto/create-user.dto';
import { GetUsersMetaDto, GetUsersRequestDto, GetUsersResponseDto } from './dto/get-users.dto';
import { UsersHttpController } from './users.http.controller';

describe('UsersHttpController', () => {
  let controller: UsersHttpController;
  let getUsersUseCase: { execute: jest.Mock };
  let createUserUseCase: { execute: jest.Mock };

  beforeEach(async () => {
    getUsersUseCase = { execute: jest.fn() };
    createUserUseCase = { execute: jest.fn() };

    const module = await Test.createTestingModule({
      controllers: [UsersHttpController],
      providers: [
        { provide: GetUsersUseCase, useValue: getUsersUseCase },
        { provide: CreateUserUseCase, useValue: createUserUseCase },
      ],
    }).compile();

    controller = module.get(UsersHttpController);
  });

  describe('getUsers', () => {
    it('유저 목록과 페이지네이션 메타 정보를 반환한다', async () => {
      const query: GetUsersRequestDto = { page: 1, limit: 20 };
      const users: GetUsersResponseDto[] = [{ id: 1, email: 'user@test.com', createdAt: new Date() }];
      const meta: GetUsersMetaDto = { total: 1, page: 1, limit: 20 };
      getUsersUseCase.execute.mockResolvedValue({ users, meta });

      const result = await controller.getUsers(query);

      expect(getUsersUseCase.execute).toHaveBeenCalledWith({ page: query.page, limit: query.limit });
      expect(result).toEqual({ data: users, meta });
    });
  });

  describe('createUser', () => {
    it('생성된 유저를 반환한다', async () => {
      const body: CreateUserRequestDto = { loginId: 'testuser', password: 'Password123!', email: 'user@test.com' };
      const createdUser: CreateUserResponseDto = {
        id: 1,
        loginId: body.loginId,
        email: body.email,
        createdAt: new Date(),
      };
      createUserUseCase.execute.mockResolvedValue(createdUser);

      const result = await controller.createUser(body);

      expect(createUserUseCase.execute).toHaveBeenCalledWith(body);
      expect(result).toEqual({ data: createdUser });
    });
  });
});

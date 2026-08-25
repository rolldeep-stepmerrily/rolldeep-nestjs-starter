import { Module } from '@nestjs/common';
import { CreateUserCommandHandler } from './application/commands/create-user.command';
import { GetUsersQueryHandler } from './application/queries/get-users.query';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUsersUseCase } from './application/use-cases/get-users.use-case';
import { UsersHttpController } from './presenter/http/users.http.controller';

@Module({
  controllers: [UsersHttpController],
  providers: [
    /** command-handlers */
    CreateUserCommandHandler,

    /** query-handlers */
    GetUsersQueryHandler,

    /** use-cases */
    CreateUserUseCase,
    GetUsersUseCase,
  ],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { GetUsersQueryHandler } from './application/queries/get-users.query';
import { GetUsersUseCase } from './application/use-cases/get-users.use-case';
import { UsersHttpController } from './presenter/http/users.http.controller';

@Module({
  controllers: [UsersHttpController],
  providers: [
    /** query-handlers */
    GetUsersQueryHandler,

    /** use-cases */
    GetUsersUseCase,
  ],
})
export class UsersModule {}

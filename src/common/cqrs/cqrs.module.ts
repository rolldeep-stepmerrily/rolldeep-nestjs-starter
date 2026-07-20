import { Global, Module } from '@nestjs/common';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';

import { TypedCommandBus } from './typed-command-bus';
import { TypedQueryBus } from './typed-query-bus';

@Global()
@Module({
  imports: [CqrsModule],
  providers: [
    {
      provide: TypedQueryBus,
      useFactory: (queryBus: QueryBus) => queryBus,
      inject: [QueryBus],
    },
    {
      provide: TypedCommandBus,
      useFactory: (commandBus: CommandBus) => commandBus,
      inject: [CommandBus],
    },
  ],
  exports: [CqrsModule, TypedQueryBus, TypedCommandBus],
})
export class GlobalCqrsModule {}

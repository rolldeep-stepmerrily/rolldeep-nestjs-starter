import { Query, QueryBus } from '@nestjs/cqrs';

export class TypedQueryBus<T extends Query<unknown>> extends QueryBus<T> {
  override async execute<ReturnType>(query: Query<ReturnType> & T): Promise<ReturnType> {
    return await super.execute(query);
  }
}

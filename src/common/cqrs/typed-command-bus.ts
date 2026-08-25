import { Command, CommandBus } from '@nestjs/cqrs';

export class TypedCommandBus<T extends Command<unknown>> extends CommandBus<T> {
  override async execute<ReturnType>(command: Command<ReturnType> & T): Promise<ReturnType> {
    return await super.execute(command);
  }
}

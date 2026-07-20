import { type Command } from '@nestjs/cqrs';
import { type RESULT_TYPE_SYMBOL } from '@nestjs/cqrs/dist/classes/constants';

export type CommandProps<T extends Command<unknown>> = Omit<T, typeof RESULT_TYPE_SYMBOL>;

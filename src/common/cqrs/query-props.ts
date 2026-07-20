import { type Query } from '@nestjs/cqrs';
import { type RESULT_TYPE_SYMBOL } from '@nestjs/cqrs/dist/classes/constants';

export type QueryProps<T extends Query<unknown>> = Omit<T, typeof RESULT_TYPE_SYMBOL>;

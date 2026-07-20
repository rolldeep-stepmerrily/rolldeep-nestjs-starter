import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, T | Record<string, never>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<T | Record<string, never>> {
    return next.handle().pipe(map((data) => data ?? {}));
  }
}

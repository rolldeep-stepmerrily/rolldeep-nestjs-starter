import { AppException, GLOBAL_ERRORS } from '@@exceptions';
import { Logger } from '@nestjs/common';

const logger = new Logger('CatchDatabaseErrors');

// biome-ignore lint/suspicious/noExplicitAny: 데코레이터 대상 클래스 타입 제약 없음
type ClassCtor = new (...args: any[]) => any;

export const CatchDatabaseErrors = () => {
  return (target: ClassCtor): void => {
    const prototype = target.prototype;
    const propertyNames = Object.getOwnPropertyNames(prototype);

    for (const propertyName of propertyNames) {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);

      if (!descriptor || typeof descriptor.value !== 'function') {
        throw new AppException(GLOBAL_ERRORS.UNKNOWN_ERROR);
      }

      const originalMethod = descriptor.value;

      // biome-ignore lint/suspicious/noExplicitAny: 원본 메서드 시그니처를 유지하기 위한 가변 인자
      descriptor.value = async function (...args: any[]) {
        try {
          return await originalMethod.apply(this, args);
        } catch (e) {
          logger.error(e);

          throw new AppException(GLOBAL_ERRORS.DATABASE_ERROR);
        }
      };

      Object.defineProperty(prototype, propertyName, descriptor);
    }
  };
};

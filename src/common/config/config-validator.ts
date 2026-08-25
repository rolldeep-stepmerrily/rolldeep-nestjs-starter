import { type ClassConstructor, plainToInstance } from 'class-transformer';
import { isDefined, validateSync } from 'class-validator';

const validatedConfigCache = new WeakMap<ClassConstructor<object>, object>();

/**
 * 환경변수를 class-validator 데코레이터가 적용된 설정 클래스로 변환하고 검증
 *
 * 동일한 클래스에 대해서는 검증 결과를 캐싱하여 중복 검증을 방지
 *
 * @param {ClassConstructor<T>} cls 검증할 설정 클래스
 * @returns {T} 검증된 설정 클래스 인스턴스
 */
export const configValidator = <T extends object>(cls: ClassConstructor<T>): T => {
  const cached = validatedConfigCache.get(cls);

  if (isDefined(cached)) {
    return cached as T;
  }

  const validatedConfig = plainToInstance(cls, process.env, {
    excludeExtraneousValues: true,
  });

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  validatedConfigCache.set(cls, validatedConfig);

  return validatedConfig;
};

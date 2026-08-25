import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger';
import { isDefined } from 'class-validator';
import { SuccessResponse } from './success-response';

interface TypedSuccessResponseOptions {
  name?: string;
  data?: ApiPropertyOptions;
  meta?: ApiPropertyOptions;
}

/**
 * Swagger 문서화를 위해 data/meta 타입 정보가 적용된 SuccessResponse 서브클래스를 동적으로 생성
 *
 * @param {TypedSuccessResponseOptions} options 생성할 클래스 이름과 data/meta의 ApiProperty 옵션
 * @returns {new (...args: unknown[]) => unknown} 생성된 SuccessResponse 서브클래스
 */
export const TypedSuccessResponse = (options: TypedSuccessResponseOptions): (new (...args: unknown[]) => unknown) => {
  const { data, meta, name } = options;

  class GenericSuccessResponse extends SuccessResponse {}

  if (isDefined(name)) {
    Object.defineProperty(GenericSuccessResponse, 'name', { value: name, writable: false });
  }

  if (isDefined(meta)) {
    ApiProperty(meta)(GenericSuccessResponse.prototype, 'meta');
  }

  if (isDefined(data)) {
    ApiProperty(data)(GenericSuccessResponse.prototype, 'data');
  }

  return GenericSuccessResponse;
};

import type { ConfigFactory } from '@nestjs/config';
import type { ClassConstructor } from 'class-transformer';

/**
 * 전달된 값이 class-validator 설정 클래스가 아닌 @nestjs/config의 ConfigFactory인지 판별
 *
 * @param {ClassConstructor<object> | ConfigFactory} cls 판별 대상
 * @returns {boolean} ConfigFactory 여부
 */
export const isConfigFactory = (cls: ClassConstructor<object> | ConfigFactory): cls is ConfigFactory =>
  'KEY' in cls && 'asProvider' in cls;

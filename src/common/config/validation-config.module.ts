import type { DynamicModule, FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { type ConfigFactory, ConfigModule, type ConfigModuleOptions, registerAs } from '@nestjs/config';
import type { ClassConstructor } from 'class-transformer';
import { configValidator } from './config-validator';
import { isConfigFactory } from './is-config-factory';

interface ValidationConfigModuleOptions extends Omit<ConfigModuleOptions, 'load'> {
  load?: Array<ClassConstructor<object> | ConfigFactory>;
}

// biome-ignore lint/complexity/noStaticOnlyClass: @nestjs/config의 ConfigModule 관례(정적 forRoot)를 따름
export class ValidationConfigModule {
  /**
   * class-validator 기반 설정 클래스 검증을 지원하는 ConfigModule을 생성
   *
   * @param {ValidationConfigModuleOptions} options ConfigModule 옵션과 검증 대상 설정 클래스 목록
   * @returns {Promise<DynamicModule>} 검증된 설정 클래스가 DI에 등록된 동적 모듈
   */
  static async forRoot(options: ValidationConfigModuleOptions): Promise<DynamicModule> {
    const load: NonNullable<ConfigModuleOptions['load']> = [];
    const providers: FactoryProvider[] = [];
    const exports: ModuleMetadata['exports'] = [];

    options.load?.forEach((cls) => {
      if (isConfigFactory(cls)) {
        load.push(cls);

        return;
      }

      const config = registerAs(cls.name.toLowerCase(), () => configValidator(cls));
      load.push(config);
      providers.push({ provide: cls, useFactory: config });
      exports.push(cls);
    });

    const resolvedModule = await ConfigModule.forRoot({ ...options, load });

    resolvedModule.providers = [...(resolvedModule.providers ?? []), ...providers];
    resolvedModule.exports = [...(resolvedModule.exports ?? []), ...exports];

    return resolvedModule;
  }
}

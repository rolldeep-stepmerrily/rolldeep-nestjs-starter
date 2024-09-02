import { ConfigService } from '@nestjs/config';

const createConfigProvider = <T>(key: string, type: 'string' | 'number' = 'string') => {
  return {
    provide: key,
    useFactory: (configService: ConfigService) => {
      const value = configService.getOrThrow<T>(key);
      return type === 'number' ? Number(value) : value;
    },
    inject: [ConfigService],
  };
};

export const SERVER_URL_PROVIDER = createConfigProvider<string>('SERVER_URL');
export const NODE_ENV_PROVIDER = createConfigProvider<string>('NODE_ENV');
export const PORT_PROVIDER = createConfigProvider<number>('PORT', 'number');
export const DATABASE_URL_PROVIDER = createConfigProvider<string>('DATABASE_URL');
export const ADMIN_NAME_PROVIDER = createConfigProvider<string>('ADMIN_NAME');
export const ADMIN_PASSWORD_PROVIDER = createConfigProvider<string>('ADMIN_PASSWORD');
export const GUEST_NAME_PROVIDER = createConfigProvider<string>('GUEST_NAME');
export const GUEST_PASSWORD_PROVIDER = createConfigProvider<string>('GUEST_PASSWORD');

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AdminConfig, AppConfig, DatabaseConfig, RedisConfig, ValidationConfigModule } from './common/config';
import { GlobalCqrsModule } from './common/cqrs';
import { HttpLoggerMiddleware } from './common/middlewares';
import { PrismaModule } from './common/prisma';
import { RedisModule } from './common/redis';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ValidationConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [AppConfig, DatabaseConfig, RedisConfig, AdminConfig],
      cache: true,
    }),
    GlobalCqrsModule,
    PrismaModule,
    RedisModule,
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes('{*splat}');
  }
}

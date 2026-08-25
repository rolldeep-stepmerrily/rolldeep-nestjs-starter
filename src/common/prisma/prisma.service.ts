import { AppConfig, DatabaseConfig } from '@@config';
import { PrismaClient } from '@@prisma';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(databaseConfig: DatabaseConfig, appConfig: AppConfig) {
    const adapter = new PrismaPg({
      connectionString: databaseConfig.databaseUrl,
    });

    super({
      adapter,
      log: ['local', 'development'].includes(appConfig.nodeEnv) ? ['info', 'warn', 'error'] : ['warn', 'error'],
    });
  }

  /**
   * 모듈 초기화 시 데이터베이스에 연결
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
}

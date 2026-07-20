import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isDefined } from 'class-validator';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;

  constructor(private readonly configService: ConfigService) {}

  /**
   * 모듈 초기화 시 Redis 클라이언트를 생성
   */
  onModuleInit(): void {
    const password = this.configService.get<string>('REDIS_PASSWORD');

    this.client = new Redis({
      host: this.configService.getOrThrow<string>('REDIS_HOST'),
      port: this.configService.getOrThrow<number>('REDIS_PORT'),
      ...(isDefined(password) && { password }),
      lazyConnect: true,
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }

  /**
   * Redis 클라이언트 반환
   *
   * @returns {Redis} ioredis 클라이언트
   */
  getClient(): Redis {
    return this.client;
  }
}

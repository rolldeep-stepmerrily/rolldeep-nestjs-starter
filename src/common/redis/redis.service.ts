import { RedisConfig } from '@@config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { isDefined } from 'class-validator';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;

  constructor(private readonly redisConfig: RedisConfig) {}

  /**
   * 모듈 초기화 시 Redis 클라이언트를 생성
   */
  onModuleInit(): void {
    const { host, port, password } = this.redisConfig;

    this.client = new Redis({
      host,
      port,
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

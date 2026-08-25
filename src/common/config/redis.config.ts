import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class RedisConfig {
  @IsString()
  @Expose({ name: 'REDIS_HOST' })
  host!: string;

  @IsInt()
  @Type(() => Number)
  @Expose({ name: 'REDIS_PORT' })
  port!: number;

  @IsOptional()
  @IsString()
  @Expose({ name: 'REDIS_PASSWORD' })
  password?: string;
}

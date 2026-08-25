import { Expose, Type } from 'class-transformer';
import { IsIn, IsInt, IsString } from 'class-validator';

export class AppConfig {
  @IsIn(['local', 'development', 'production', 'test'])
  @Expose({ name: 'NODE_ENV' })
  nodeEnv!: 'local' | 'development' | 'production' | 'test';

  @IsInt()
  @Type(() => Number)
  @Expose({ name: 'PORT' })
  port!: number;

  @IsString()
  @Expose({ name: 'SERVER_URL' })
  serverUrl!: string;
}

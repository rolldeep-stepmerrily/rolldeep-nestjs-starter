import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class DatabaseConfig {
  @IsString()
  @Expose({ name: 'DATABASE_URL' })
  databaseUrl!: string;
}

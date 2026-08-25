import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AdminConfig {
  @IsString()
  @Expose({ name: 'ADMIN_NAME' })
  name!: string;

  @IsString()
  @Expose({ name: 'ADMIN_PASSWORD' })
  password!: string;
}

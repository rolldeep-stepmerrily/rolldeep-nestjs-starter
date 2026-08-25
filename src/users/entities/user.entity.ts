import { BaseEntity } from '@@entities';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UserEntity extends BaseEntity {
  @ApiProperty({
    description: '유저 ID',
  })
  @IsNumber()
  id!: number;

  @ApiProperty({
    description: '아이디',
  })
  @IsString()
  loginId!: string;

  @ApiProperty({
    description: '이메일',
  })
  @IsEmail()
  email!: string;
}

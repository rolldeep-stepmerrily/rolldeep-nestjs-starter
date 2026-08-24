import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { UserEntity } from 'src/users/entities/user.entity';

export class GetUsersRequestDto {
  @ApiPropertyOptional({ description: '조회 개수', default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit: number = 20;
}

export class GetUsersResponseDto {
  @ApiProperty({ description: '유저 ID' })
  id!: number;

  @ApiProperty({ description: '이메일' })
  email!: string;

  @ApiProperty({ description: '생성일' })
  createdAt!: Date;

  static from(user: UserEntity): GetUsersResponseDto {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
